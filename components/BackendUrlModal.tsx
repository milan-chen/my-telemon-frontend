import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { ServerIcon } from './icons/ServerIcon';

interface BackendUrlModalProps {
  currentUrl?: string;
  onSave: (url: string) => void;
  onClose?: () => void;
  isRequired?: boolean; // 是否为必填（首次配置时）
}

const BackendUrlModal: React.FC<BackendUrlModalProps> = ({ 
  currentUrl = '', 
  onSave, 
  onClose, 
  isRequired = false 
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleCheckConnection = async () => {
    if (!url.trim()) {
      setCheckResult({ success: false, message: '请先输入后端服务地址' });
      return;
    }

    setIsChecking(true);
    setCheckResult(null);
    
    try {
      const testUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      const response = await fetch(`${testUrl}/config/check`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        setCheckResult({ success: true, message: '连接成功！后端服务运行正常。' });
      } else {
        setCheckResult({ success: false, message: `连接失败：HTTP ${response.status}` });
      }
    } catch (error) {
      setCheckResult({ 
        success: false, 
        message: error instanceof Error ? `连接失败：${error.message}` : '连接失败：未知错误' 
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = () => {
    if (!url.trim()) {
      setCheckResult({ success: false, message: '后端服务地址不能为空' });
      return;
    }
    
    const cleanUrl = url.trim().endsWith('/') ? url.trim().slice(0, -1) : url.trim();
    onSave(cleanUrl);
  };

  const handleClose = () => {
    if (isRequired && !currentUrl) {
      // 首次配置时，必须填写才能关闭
      setCheckResult({ success: false, message: '首次使用必须配置后端服务地址' });
      return;
    }
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md flex flex-col transform transition-all duration-300 ease-in-out scale-95 animate-scale-in"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isRequired ? '配置后端服务' : '修改后端服务地址'}
          </h2>
          {!isRequired && (
            <button onClick={handleClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors">
              <CloseIcon />
            </button>
          )}
        </div>
        
        <div className="p-6 space-y-4">
          {isRequired && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
              欢迎使用 Telemon！请先配置您的后端服务地址，以便与监控服务进行通信。
            </div>
          )}
          
          <div>
            <label htmlFor="backend-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              后端服务地址
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ServerIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="url"
                id="backend-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://127.0.0.1:8080"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              请输入完整的服务地址，例如：http://127.0.0.1:8080
            </p>
          </div>

          {checkResult && (
            <div className={`p-3 rounded-lg text-sm ${
              checkResult.success 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              {checkResult.message}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCheckConnection}
            disabled={isChecking}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {isChecking ? '检查中...' : '测试连接'}
          </button>
          
          <div className="flex gap-3">
            {!isRequired && (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
      <style>{`.animate-scale-in { animation: scaleIn 0.2s ease-out forwards; } @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
};

export default BackendUrlModal;