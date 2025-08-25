import React from 'react';
import { ChannelIcon } from './icons/ChannelIcon';

interface ChannelAvatarProps {
  channelTitle?: string;
  channel: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ChannelAvatar: React.FC<ChannelAvatarProps> = ({ 
  channelTitle, 
  channel, 
  size = 'md',
  className = '' 
}) => {
  // 获取首字母
  const getInitial = () => {
    if (channelTitle) {
      // 优先使用channelTitle的首字母
      const firstChar = channelTitle.trim().charAt(0).toUpperCase();
      // 如果是中文字符或英文字母，返回首字符；否则使用默认图标
      if (/[\u4e00-\u9fa5a-zA-Z]/.test(firstChar)) {
        return firstChar;
      }
    }
    
    // 如果没有channelTitle或首字符无效，尝试从channel中获取
    if (channel) {
      // 移除@符号和常见前缀
      const cleanChannel = channel.replace(/^[@#]/, '').trim();
      const firstChar = cleanChannel.charAt(0).toUpperCase();
      if (/[a-zA-Z]/.test(firstChar)) {
        return firstChar;
      }
    }
    
    return null; // 返回null表示使用默认图标
  };

  // 生成背景颜色（基于字符串哈希）
  const getBackgroundColor = () => {
    const text = channelTitle || channel || '';
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // 使用预定义的颜色组合，确保对比度和美观性
    const colors = [
      'bg-indigo-500',
      'bg-purple-500', 
      'bg-pink-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-teal-500',
      'bg-blue-500',
      'bg-cyan-500'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  // 尺寸配置
  const sizeClasses = {
    sm: {
      container: 'w-6 h-6',
      text: 'text-xs',
      icon: 'w-3 h-3'
    },
    md: {
      container: 'w-8 h-8',
      text: 'text-sm',
      icon: 'w-4 h-4'
    },
    lg: {
      container: 'w-10 h-10',
      text: 'text-base',
      icon: 'w-5 h-5'
    }
  };

  const sizeConfig = sizeClasses[size];
  const initial = getInitial();

  if (initial) {
    // 显示首字母头像
    return (
      <div 
        className={`${sizeConfig.container} ${getBackgroundColor()} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
        title={channelTitle || channel}
      >
        <span className={sizeConfig.text}>
          {initial}
        </span>
      </div>
    );
  } else {
    // 回退到默认图标
    return (
      <div 
        className={`${sizeConfig.container} bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center ${className}`}
        title={channelTitle || channel}
      >
        <ChannelIcon className={`${sizeConfig.icon} text-indigo-600 dark:text-indigo-400`} />
      </div>
    );
  }
};