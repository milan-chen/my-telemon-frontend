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

// 活跃监控状态接口 - 兼容性保留
export interface ActiveMonitorsStatus {
  active_monitors: string[];
}

// /status 接口响应类型
export interface StatusResponse {
  active_monitors: string[];
  monitors: MonitorStatus[];
}

// 监控状态枚举
export type MonitorStatusType = 'running' | 'stopped' | 'starting' | 'error';

// 监控状态信息
export interface MonitorStatus {
  id: string;
  channel: string;
  keywords: string[];
  useRegex: boolean;
  status: MonitorStatusType;
}

// API响应基础类型
export interface ApiResponse {
  message?: string;
  detail?: string;
}

// 监控操作API响应
export interface MonitorOperationResponse extends ApiResponse {
  message: string;
}