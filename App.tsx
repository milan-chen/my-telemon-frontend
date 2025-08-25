import React, { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MonitorConfig, ServerConfigStatus, StatusResponse, MonitorStatusType } from './types';
import { apiService, getFriendlyErrorMessage } from './services/api';
import Header from './components/Header';
import MonitorTable from './components/MonitorTable';
import MonitorFormModal from './components/MonitorFormModal';
import UserManualModal from './components/UserManualModal';
import ServerStatusBanner from './components/ServerStatusBanner';
import BackendUrlModal from './components/BackendUrlModal';
import { PlusIcon } from './components/icons/PlusIcon';

// 扩展MonitorConfig以包含服务器状态
interface MonitorWithStatus extends MonitorConfig {
  status: MonitorStatusType;
}

const App: React.FC = () => {
  const [monitors, setMonitors] = useState<MonitorWithStatus[]>([]);
  const [backendUrl, setBackendUrl] = useLocalStorage<string>('telemon-backend-url', '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<MonitorConfig | null>(null);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isBackendUrlModalOpen, setIsBackendUrlModalOpen] = useState(!backendUrl);
  const [syncingMonitors, setSyncingMonitors] = useState<Set<string>>(new Set());
  const [serverStatus, setServerStatus] = useState<ServerConfigStatus | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 当后端地址变化时，更新API服务实例
  useEffect(() => {
    if (backendUrl) {
      apiService.setBaseUrl(backendUrl);
    }
  }, [backendUrl]);

  // 从服务器加载监控数据
  const loadDataFromServer = useCallback(async () => {
    if (!backendUrl || !serverStatus?.all_ready) {
      return;
    }

    setIsLoadingData(true);
    try {
      const statusResponse = await apiService.getStatus();
      
      // 将服务器返回的监控数据转换为本地MonitorWithStatus格式
      const serverMonitors: MonitorWithStatus[] = statusResponse.monitors.map(monitor => ({
        id: monitor.id,
        channel: monitor.channel,
        channelTitle: monitor.channelTitle, 
        keywords: monitor.keywords,
        useRegex: monitor.useRegex,
        isEnabled: monitor.status === 'running', // 保持兼容性
        status: monitor.status
      }));

      setMonitors(serverMonitors);
    } catch (error) {
      console.warn('从服务器加载数据失败:', getFriendlyErrorMessage(error));
      // 加载失败时设置为空数组，避免显示过期数据
      setMonitors([]);
    } finally {
      setIsLoadingData(false);
    }
  }, [backendUrl, serverStatus]);

  // 当服务器状态变为就绪时，加载数据
  useEffect(() => {
    if (serverStatus?.all_ready && backendUrl) {
      loadDataFromServer();
    }
  }, [serverStatus?.all_ready, backendUrl, loadDataFromServer]);

  const handleOpenModal = useCallback((monitor?: MonitorConfig) => {
    setEditingMonitor(monitor || null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingMonitor(null);
  }, []);
  
  const handleOpenManual = useCallback(() => setIsManualOpen(true), []);
  const handleCloseManual = useCallback(() => setIsManualOpen(false), []);
  
  const handleOpenBackendUrlModal = useCallback(() => setIsBackendUrlModalOpen(true), []);
  const handleCloseBackendUrlModal = useCallback(() => {
    if (backendUrl) { // 只有在已有后端地址时才可以关闭
      setIsBackendUrlModalOpen(false);
    }
  }, [backendUrl]);
  
  const handleSaveBackendUrl = useCallback((url: string) => {
    setBackendUrl(url);
    setIsBackendUrlModalOpen(false);
  }, [setBackendUrl]);

  const handleSaveMonitor = useCallback(async (monitor: MonitorConfig) => {
    // 检查服务器配置状态
    if (!serverStatus?.all_ready) {
      alert('服务器配置不完整，请先完成服务器端配置后再创建监控。');
      return;
    }

    const existingMonitor = monitors.find(m => m.id === monitor.id);
    setSyncingMonitors(prev => new Set(prev).add(monitor.id));
    
    try {
      // 构造符合新 API 的请求体
      const requestBody = {
        id: monitor.id,
        channel: monitor.channel,
        keywords: monitor.keywords,
        useRegex: monitor.useRegex
      };

      // 对于新监控或更新后需要启用的监控
      if (monitor.isEnabled) {
        if (existingMonitor && existingMonitor.status === 'stopped') {
          // 如果是已停止的监控，使用恢复接口
          await apiService.resumeMonitor(monitor.id);
        } else {
          // 否则使用启动接口
          await apiService.startMonitor(requestBody);
        }
      } else if (existingMonitor && existingMonitor.status === 'running') {
        // 如果现有监控正在运行，但用户设置为禁用，则停止
        await apiService.stopMonitor(monitor.id);
      }
      
      // 操作成功后重新加载数据
      await loadDataFromServer();
      
      handleCloseModal();
    } catch (error) {
      const message = getFriendlyErrorMessage(error);
      alert(`保存失败: ${message}`);
    } finally {
      setSyncingMonitors(prev => {
        const next = new Set(prev);
        next.delete(monitor.id);
        return next;
      });
    }
  }, [monitors, handleCloseModal, serverStatus, loadDataFromServer]);

  const handleDeleteMonitor = useCallback(async (id: string) => {
    const monitor = monitors.find(m => m.id === id);
    if (!monitor) return;
    
    // 确认删除
    if (!confirm('确定要彻底删除这个监控吗？这个操作不可恢复。')) {
      return;
    }
    
    setSyncingMonitors(prev => new Set(prev).add(id));
    try {
      await apiService.deleteMonitor(id);
      await loadDataFromServer();
    } catch (error) {
      const message = getFriendlyErrorMessage(error);
      alert(`删除失败: ${message}`);
    } finally {
      setSyncingMonitors(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [monitors, loadDataFromServer]);

  const handleToggleMonitor = useCallback(async (id: string) => {
    const monitor = monitors.find(m => m.id === id);
    if (!monitor) return;

    // 检查服务器配置状态（只在启动时检查）
    if (monitor.status !== 'running' && !serverStatus?.all_ready) {
      alert('服务器配置不完整，无法启动监控。请先完成服务器端配置。');
      return;
    }

    setSyncingMonitors(prev => new Set(prev).add(id));

    try {
      if (monitor.status === 'running') {
        // 当前正在运行，停止它
        await apiService.stopMonitor(id);
      } else if (monitor.status === 'stopped') {
        // 当前已停止，恢复它
        await apiService.resumeMonitor(id);
      } else {
        // 其他状态（error等），尝试重新启动
        const requestBody = {
          id: monitor.id,
          channel: monitor.channel,
          keywords: monitor.keywords,
          useRegex: monitor.useRegex
        };
        await apiService.startMonitor(requestBody);
      }
      
      // 操作成功后重新加载数据
      await loadDataFromServer();
    } catch (error) {
      const message = getFriendlyErrorMessage(error);
      alert(`操作失败: ${message}`);
    } finally {
      setSyncingMonitors(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [monitors, serverStatus, loadDataFromServer]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <Header onHelpClick={handleOpenManual} onSettingsClick={handleOpenBackendUrlModal} />
      <main className="container mx-auto p-4 md:p-8">
        {/* 服务器状态检查横幅 */}
        <ServerStatusBanner backendUrl={backendUrl} onStatusChange={setServerStatus} />
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">监控仪表盘</h1>
            {isLoadingData && (
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span>加载中...</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* 手动加载按钮 */}
            {serverStatus?.all_ready && (
              <button
                onClick={loadDataFromServer}
                disabled={isLoadingData}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  isLoadingData
                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
                title="手动加载服务器数据"
              >
                <svg className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                加载
              </button>
            )}
            <button
              onClick={() => handleOpenModal()}
              disabled={!serverStatus?.all_ready || !backendUrl}
              className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-950 transition-all duration-200 transform ${
                (serverStatus?.all_ready && backendUrl)
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 hover:scale-105' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              <PlusIcon />
              新建监控
            </button>
          </div>
        </div>

        {monitors.length === 0 ? (
          <div className="text-center py-16 px-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-500 dark:text-gray-400">尚未配置监控</h2>
            <p className="mt-2 text-gray-400 dark:text-gray-500">点击“新建监控”开始使用。</p>
          </div>
        ) : (
          <MonitorTable
            monitors={monitors}
            syncingMonitors={syncingMonitors}
            onEdit={handleOpenModal}
            onDelete={handleDeleteMonitor}
            onToggle={handleToggleMonitor}
          />
        )}
      </main>

      {isBackendUrlModalOpen && (
        <BackendUrlModal
          currentUrl={backendUrl}
          onSave={handleSaveBackendUrl}
          onClose={handleCloseBackendUrlModal}
          isRequired={!backendUrl}
        />
      )}
      
      {isModalOpen && (
        <MonitorFormModal
          monitor={editingMonitor}
          onSave={handleSaveMonitor}
          onClose={handleCloseModal}
        />
      )}
      
      {isManualOpen && (
        <UserManualModal onClose={handleCloseManual} />
      )}
    </div>
  );
};

export default App;