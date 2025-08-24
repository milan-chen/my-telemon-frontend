import React, { useState, useCallback } from 'react';
import { MonitorConfig } from '../types';
import KeywordInput from './KeywordInput';
import { CloseIcon } from './icons/CloseIcon';
import { ChannelIcon } from './icons/ChannelIcon';

interface MonitorFormModalProps {
  monitor: MonitorConfig | null;
  onSave: (monitor: MonitorConfig) => void;
  onClose: () => void;
}

const MonitorFormModal: React.FC<MonitorFormModalProps> = ({ monitor, onSave, onClose }) => {
  const [formData, setFormData] = useState<MonitorConfig>(() => {
    const baseConfig: Omit<MonitorConfig, 'id'> = {
        channel: '',
        keywords: [],
        isEnabled: true,
        useRegex: false,
    };

    if (monitor) {
        return {
            ...baseConfig,
            ...monitor,
            useRegex: monitor.useRegex || false,
        };
    }
    return {
        ...baseConfig,
        id: crypto.randomUUID(),
    };
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleKeywordsChange = useCallback((newKeywords: string[]) => {
    setFormData(prev => ({ ...prev, keywords: newKeywords }));
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderInput = (id: string, label: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode, placeholder = '', required = true) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-95 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {monitor ? '编辑监控' : '创建新监控'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors">
            <CloseIcon />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* 监控配置部分 */}
          <section>
            <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">监控配置</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              配置您要监控的 Telegram 频道和关键词。所有敏感信息（API 凭证、Bot 通知）已由服务器端统一管理。
            </p>
            
            <div className="space-y-4">
              {renderInput('channel', '目标频道', 'text', formData.channel, handleChange, <ChannelIcon />, '@频道名称 或 频道链接')}
              
              <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">关键词 (可选)</label>
                    <div className="flex items-center">
                        <label htmlFor="useRegex" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">使用正则表达式</label>
                        <label htmlFor="useRegex" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="useRegex"
                                    className="sr-only"
                                    checked={formData.useRegex}
                                    onChange={(e) => setFormData(prev => ({ ...prev, useRegex: e.target.checked }))}
                                />
                                <div className={`block w-12 h-6 rounded-full transition-colors ${formData.useRegex ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.useRegex ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                </div>
                <KeywordInput value={formData.keywords} onChange={handleKeywordsChange} />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  留空表示监控频道的所有消息。设置关键词可以过滤只关注特定内容的消息。
                </p>
              </div>
            </div>
          </section>
        </form>
        
        <div className="flex justify-end items-center gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
            取消
          </button>
          <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
            保存
          </button>
        </div>
      </div>
      <style>{`.animate-scale-in { animation: scaleIn 0.2s ease-out forwards; } @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
};

export default MonitorFormModal;