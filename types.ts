// 监控配置接口 - 简化版本，敏感信息由服务器端统一管理
export interface MonitorConfig {
  id: string;
  channel: string;
  keywords: string[];
  useRegex: boolean;
  isEnabled: boolean;
}

// 服务器配置状态接口
export interface ServerConfigStatus {
  telegram_config_valid: boolean;
  bot_config_valid: boolean;
  all_ready: boolean;
  telegram_message: string;
  bot_message: string;
}

// 活跃监控状态接口
export interface ActiveMonitorsStatus {
  active_monitors: string[];
}