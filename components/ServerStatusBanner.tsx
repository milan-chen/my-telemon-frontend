import React, { useState, useEffect } from 'react';
import { ServerConfigStatus } from '../types';
import { ServerIcon } from './icons/ServerIcon';

interface ServerStatusBannerProps {
  backendUrl?: string;
  onStatusChange?: (status: ServerConfigStatus | null) => void;
}

const ServerStatusBanner: React.FC<ServerStatusBannerProps> = ({ backendUrl, onStatusChange }) => {
  const [status, setStatus] = useState<ServerConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkServerStatus = async () => {
    if (!backendUrl) {
      setError('后端服务地址未配置，请先配置后端服务地址。');
      setStatus(null);
      onStatusChange?.(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${backendUrl}/config/check`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const statusData: ServerConfigStatus = await response.json();
      setStatus(statusData);
      onStatusChange?.(statusData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`无法连接到后端服务: ${errorMessage}`);
      setStatus(null);
      onStatusChange?.(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-blue-800 dark:text-blue-200">正在检查服务器配置状态...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ServerIcon className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-red-800 dark:text-red-200 font-medium">服务器连接失败</h3>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={checkServerStatus}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!status?.all_ready) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ServerIcon className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-yellow-800 dark:text-yellow-200 font-medium">服务器配置不完整</h3>
              <div className="text-yellow-600 dark:text-yellow-400 text-sm mt-1 space-y-1">
                <div>Telegram API: {status?.telegram_config_valid ? '✅ ' + status.telegram_message : '❌ 未配置'}</div>
                <div>Bot 通知: {status?.bot_config_valid ? '✅ ' + status.bot_message : '❌ 未配置'}</div>
                <p className="mt-2">请在服务器端完成配置后重新检查。</p>
              </div>
            </div>
          </div>
          <button
            onClick={checkServerStatus}
            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
          >
            重新检查
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ServerIcon className="h-5 w-5 text-green-600 mr-3" />
          <div>
            <h3 className="text-green-800 dark:text-green-200 font-medium">服务器配置就绪</h3>
            <div className="text-green-600 dark:text-green-400 text-sm mt-1 space-y-1">
              <div>✅ {status.telegram_message}</div>
              <div>✅ {status.bot_message}</div>
            </div>
          </div>
        </div>
        <button
          onClick={checkServerStatus}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          重新检查
        </button>
      </div>
    </div>
  );
};

export default ServerStatusBanner;