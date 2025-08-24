import React from 'react';
import { MonitorConfig } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

interface MonitorCardProps {
  monitor: MonitorConfig;
  isSyncing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

const MonitorCard: React.FC<MonitorCardProps> = ({ monitor, isSyncing, onEdit, onDelete, onToggle }) => {
  const getStatusText = () => {
    if (isSyncing) return '同步中...';
    return monitor.isEnabled ? '监控中' : '已暂停';
  };

  const getStatusColor = () => {
    if (isSyncing) return 'bg-yellow-500';
    return monitor.isEnabled ? 'bg-green-500' : 'bg-gray-500';
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 ${isSyncing ? 'opacity-75' : ''}`}>
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate" title={monitor.channel}>
              {monitor.channel}
            </h2>
            <div className="flex items-center mt-1">
              <span className={`w-3 h-3 rounded-full ${getStatusColor()} ${isSyncing ? 'animate-pulse' : ''}`}></span>
              <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {getStatusText()}
              </p>
            </div>
          </div>
          <div className="flex items-center ml-4">
            <label htmlFor={`toggle-${monitor.id}`} className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id={`toggle-${monitor.id}`}
                  className="sr-only disabled:opacity-50"
                  checked={monitor.isEnabled}
                  onChange={onToggle}
                  disabled={isSyncing}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${monitor.isEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${monitor.isEnabled ? 'translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">关键词</h3>
            {monitor.useRegex && (
              <span className="px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 dark:text-purple-200 dark:bg-purple-900/70 rounded-full">
                RegEx
              </span>
            )}
          </div>
          {monitor.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {monitor.keywords.slice(0, 5).map(keyword => (
                <span key={keyword} className="px-2.5 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
                  {keyword}
                </span>
              ))}
              {monitor.keywords.length > 5 && (
                 <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                  +{monitor.keywords.length - 5} 更多
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">未指定关键词。</p>
          )}
        </div>

        <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">配置状态</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">所有敏感信息由服务器端统一管理</p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end items-center gap-3">
        <button
          onClick={onEdit}
          disabled={isSyncing}
          className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors duration-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="编辑监控"
        >
          <PencilIcon />
        </button>
        <button
          onClick={onDelete}
          disabled={isSyncing}
          className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="删除监控"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default MonitorCard;