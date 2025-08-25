import React from 'react';
import { MonitorConfig, MonitorStatusType } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { QuestionMarkIcon } from './icons/QuestionMarkIcon';
import { ChannelAvatar } from './ChannelAvatar';

// 扩展MonitorConfig以包含status信息
interface MonitorWithStatus extends MonitorConfig {
  status: MonitorStatusType;
}

interface MonitorTableProps {
  monitors: MonitorWithStatus[];
  syncingMonitors: Set<string>;
  onEdit: (monitor: MonitorConfig) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;

}

const MonitorTable: React.FC<MonitorTableProps> = ({ 
  monitors, 
  syncingMonitors, 
  onEdit, 
  onDelete, 
  onToggle
}) => {
  const getStatusText = (monitor: MonitorWithStatus, isSyncing: boolean) => {
    if (isSyncing) return '同步中...';
    
    switch (monitor.status) {
      case 'running':
        return '监控中';
      case 'stopped':
        return '已停止';
      case 'starting':
        return '启动中';
      case 'error':
        return '错误状态';
      default:
        return '未知状态';
    }
  };

  const getStatusColor = (monitor: MonitorWithStatus, isSyncing: boolean) => {
    if (isSyncing) return 'bg-yellow-500';
    
    switch (monitor.status) {
      case 'running':
        return 'bg-green-500';
      case 'stopped':
        return 'bg-gray-500';
      case 'starting':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };



  const formatKeywords = (keywords: string[], useRegex: boolean) => {
    if (keywords.length === 0) {
      return <span className="text-gray-400 dark:text-gray-500 text-sm">未指定关键词</span>;
    }

    const displayKeywords = keywords.slice(0, 3);
    const remainingCount = keywords.length - 3;

    return (
      <div className="flex flex-wrap gap-1">
        {displayKeywords.map((keyword, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 rounded-full"
          >
            {keyword}
          </span>
        ))}
        {useRegex && (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 rounded-full">
            RegEx
          </span>
        )}
        {remainingCount > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* 桌面端表格视图 */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  频道
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  关键词
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  启用状态
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {monitors.map((monitor) => {
                const isSyncing = syncingMonitors.has(monitor.id);
                return (
                  <tr 
                    key={monitor.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
                      isSyncing ? 'opacity-75' : ''
                    }`}
                  >
                    {/* 频道列 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ChannelAvatar 
                          channelTitle={monitor.channelTitle}
                          channel={monitor.channel}
                          size="md"
                        />
                        <div className="ml-3 flex items-center gap-2">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white" title={monitor.channelTitle || monitor.channel}>
                            {monitor.channelTitle || monitor.channel}
                          </div>
                          {monitor.channelTitle && (
                            <div className="group relative">
                              <QuestionMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-help" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                频道ID: {monitor.channel}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 状态列 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(monitor, isSyncing)} ${
                          isSyncing ? 'animate-pulse' : ''
                        }`}></span>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                          {getStatusText(monitor, isSyncing)}
                        </span>
                      </div>
                    </td>

                    {/* 关键词列 */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {formatKeywords(monitor.keywords, monitor.useRegex)}
                      </div>
                    </td>

                    {/* 启用状态列 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label htmlFor={`toggle-${monitor.id}`} className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            id={`toggle-${monitor.id}`}
                            className="sr-only"
                            checked={monitor.isEnabled}
                            onChange={() => onToggle(monitor.id)}
                            disabled={isSyncing}
                          />
                          <div className={`block w-11 h-6 rounded-full transition-colors duration-200 ${
                            monitor.isEnabled 
                              ? 'bg-indigo-600' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          } ${isSyncing ? 'opacity-50' : ''}`}></div>
                          <div className={`dot absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ${
                            monitor.isEnabled ? 'translate-x-5' : ''
                          }`}></div>
                        </div>
                      </label>
                    </td>

                    {/* 操作列 */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* 编辑按钮 */}
                        <button
                          onClick={() => onEdit(monitor)}
                          disabled={isSyncing}
                          className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="编辑监控"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        
                        {/* 删除按钮 */}
                        <button
                          onClick={() => onDelete(monitor.id)}
                          disabled={isSyncing}
                          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="删除监控"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 移动端卡片视图 */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {monitors.map((monitor) => {
            const isSyncing = syncingMonitors.has(monitor.id);
            return (
              <div 
                key={monitor.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
                  isSyncing ? 'opacity-75' : ''
                }`}
              >
                {/* 移动端顶部行：频道名称和状态切换 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center flex-1 min-w-0">
                    <ChannelAvatar 
                      channelTitle={monitor.channelTitle}
                      channel={monitor.channel}
                      size="md"
                    />
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate flex-1" title={monitor.channelTitle || monitor.channel}>
                          {monitor.channelTitle || monitor.channel}
                        </h3>
                        {monitor.channelTitle && (
                          <div className="group relative flex-shrink-0">
                            <QuestionMarkIcon className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-help" />
                            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                              频道ID: {monitor.channel}
                              <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(monitor, isSyncing)} ${
                          isSyncing ? 'animate-pulse' : ''
                        }`}></span>
                        <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">
                          {getStatusText(monitor, isSyncing)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <label htmlFor={`toggle-mobile-${monitor.id}`} className="flex items-center cursor-pointer ml-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`toggle-mobile-${monitor.id}`}
                        className="sr-only"
                        checked={monitor.isEnabled}
                        onChange={() => onToggle(monitor.id)}
                        disabled={isSyncing}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors duration-200 ${
                        monitor.isEnabled 
                          ? 'bg-indigo-600' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      } ${isSyncing ? 'opacity-50' : ''}`}></div>
                      <div className={`dot absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ${
                        monitor.isEnabled ? 'translate-x-4' : ''
                      }`}></div>
                    </div>
                  </label>
                </div>

                {/* 移动端关键词部分 */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">关键词</div>
                  {formatKeywords(monitor.keywords, monitor.useRegex)}
                </div>

                {/* 移动端操作按钮 */}
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  {/* 编辑按钮 */}
                  <button
                    onClick={() => onEdit(monitor)}
                    disabled={isSyncing}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PencilIcon className="w-3 h-3" />
                    编辑
                  </button>
                  
                  {/* 删除按钮 */}
                  <button
                    onClick={() => onDelete(monitor.id)}
                    disabled={isSyncing}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="w-3 h-3" />
                    删除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonitorTable;