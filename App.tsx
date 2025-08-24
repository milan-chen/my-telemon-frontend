import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MonitorConfig, ServerConfigStatus } from './types';
import Header from './components/Header';
import MonitorCard from './components/MonitorCard';
import MonitorFormModal from './components/MonitorFormModal';
import UserManualModal from './components/UserManualModal';
import ServerStatusBanner from './components/ServerStatusBanner';
import BackendUrlModal from './components/BackendUrlModal';
import { PlusIcon } from './components/icons/PlusIcon';

const App: React.FC = () => {
  const [monitors, setMonitors] = useLocalStorage<MonitorConfig[]>('telemon-configs', []);
  const [backendUrl, setBackendUrl] = useLocalStorage<string>('telemon-backend-url', '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<MonitorConfig | null>(null);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isBackendUrlModalOpen, setIsBackendUrlModalOpen] = useState(!backendUrl);
  const [syncingMonitors, setSyncingMonitors] = useState<Set<string>>(new Set());
  const [serverStatus, setServerStatus] = useState<ServerConfigStatus | null>(null);

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

  const apiRequest = async (endpoint: string, method: string, body?: any) => {
    if (!backendUrl) {
      throw new Error('后端服务地址未配置');
    }
    
    const url = `${backendUrl}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: '请求失败，请检查后端服务日志' }));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const getFriendlyErrorMessage = (error: unknown): string => {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return '网络请求失败 (Failed to fetch)。\n\n请检查以下几点：\n1. 确保您的 Python 后端服务正在运行。\n2. 确认后端服务地址配置正确。\n3. 检查浏览器开发者控制台 (F12) 获取更多信息。';
    }
    if (error instanceof Error) {
      return error.message;
    }
    return '未知错误';
  };
  
  const handleSaveMonitor = useCallback(async (monitor: MonitorConfig) => {
    // 检查服务器配置状态
    if (!serverStatus?.all_ready) {
      alert('服务器配置不完整，请先完成服务器端配置后再创建监控。');
      return;
    }

    const isEditing = monitors.some(m => m.id === monitor.id);
    setSyncingMonitors(prev => new Set(prev).add(monitor.id));
    try {
      // 构造符合新 API 的请求体
      const requestBody = {
        id: monitor.id,
        channel: monitor.channel,
        keywords: monitor.keywords,
        useRegex: monitor.useRegex
      };

      // For a new or updated monitor, tell backend to start if it's enabled
      if (monitor.isEnabled) {
        await apiRequest('/monitor/start', 'POST', requestBody);
      } else if (isEditing) {
        // If an existing monitor is being saved as disabled, tell backend to stop
        await apiRequest('/monitor/stop', 'POST', { id: monitor.id });
      }
      
      setMonitors(prev => {
        const existingIndex = prev.findIndex(m => m.id === monitor.id);
        if (existingIndex > -1) {
          const updatedMonitors = [...prev];
          updatedMonitors[existingIndex] = monitor;
          return updatedMonitors;
        }
        return [...prev, monitor];
      });
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
  }, [monitors, setMonitors, handleCloseModal, serverStatus]);

  const handleDeleteMonitor = useCallback(async (id: string) => {
    const monitor = monitors.find(m => m.id === id);
    if (!monitor) return;
    
    setSyncingMonitors(prev => new Set(prev).add(id));
    try {
      // Always try to stop backend service on delete
      await apiRequest('/monitor/stop', 'POST', { id });
      setMonitors(prev => prev.filter(m => m.id !== id));
    } catch (error) {
       // We still remove from frontend even if backend fails, maybe backend was already down
      console.warn(`后端停止请求可能失败 (这在后端服务已关闭时是正常的): ${error instanceof Error ? error.message : '未知错误'}`);
      setMonitors(prev => prev.filter(m => m.id !== id));
    } finally {
      setSyncingMonitors(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [monitors, setMonitors]);

  const handleToggleMonitor = useCallback(async (id: string) => {
    const monitor = monitors.find(m => m.id === id);
    if (!monitor) return;

    // 检查服务器配置状态
    if (!monitor.isEnabled && !serverStatus?.all_ready) {
      alert('服务器配置不完整，无法启动监控。请先完成服务器端配置。');
      return;
    }

    setSyncingMonitors(prev => new Set(prev).add(id));
    const isEnabling = !monitor.isEnabled;

    try {
      if (isEnabling) {
        // 构造符合新 API 的请求体
        const requestBody = {
          id: monitor.id,
          channel: monitor.channel,
          keywords: monitor.keywords,
          useRegex: monitor.useRegex
        };
        await apiRequest('/monitor/start', 'POST', requestBody);
      } else {
        await apiRequest('/monitor/stop', 'POST', { id });
      }
      
      setMonitors(prev =>
        prev.map(m =>
          m.id === id ? { ...m, isEnabled: !m.isEnabled } : m
        )
      );
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
  }, [monitors, setMonitors, serverStatus]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <Header onHelpClick={handleOpenManual} onSettingsClick={handleOpenBackendUrlModal} />
      <main className="container mx-auto p-4 md:p-8">
        {/* 服务器状态检查横幅 */}
        <ServerStatusBanner backendUrl={backendUrl} onStatusChange={setServerStatus} />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">监控仪表盘</h1>
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

        {monitors.length === 0 ? (
          <div className="text-center py-16 px-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-500 dark:text-gray-400">尚未配置监控</h2>
            <p className="mt-2 text-gray-400 dark:text-gray-500">点击“新建监控”开始使用。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {monitors.map(monitor => (
              <MonitorCard
                key={monitor.id}
                monitor={monitor}
                isSyncing={syncingMonitors.has(monitor.id)}
                onEdit={() => handleOpenModal(monitor)}
                onDelete={() => handleDeleteMonitor(monitor.id)}
                onToggle={() => handleToggleMonitor(monitor.id)}
              />
            ))}
          </div>
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