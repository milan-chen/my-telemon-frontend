import { MonitorConfig, ServerConfigStatus, StatusResponse, MonitorOperationResponse } from '../types';

/**
 * API服务类，统一管理所有后端API调用
 */
export class ApiService {
  private baseUrl: string = '';

  /**
   * 设置后端服务地址
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * 通用API请求方法
   */
  private async request<T>(endpoint: string, method: string, body?: any): Promise<T> {
    if (!this.baseUrl) {
      throw new Error('后端服务地址未配置');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        detail: '请求失败，请检查后端服务日志' 
      }));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 获取服务器配置状态
   */
  async checkServerConfig(): Promise<ServerConfigStatus> {
    return this.request<ServerConfigStatus>('/config/check', 'GET');
  }

  /**
   * 获取当前活跃监控状态
   */
  async getStatus(): Promise<StatusResponse> {
    return this.request<StatusResponse>('/status', 'GET');
  }

  /**
   * 启动监控
   */
  async startMonitor(monitor: Pick<MonitorConfig, 'id' | 'channel' | 'keywords' | 'useRegex'>): Promise<MonitorOperationResponse> {
    return this.request<MonitorOperationResponse>('/monitor/start', 'POST', monitor);
  }

  /**
   * 停止监控
   */
  async stopMonitor(id: string): Promise<MonitorOperationResponse> {
    return this.request<MonitorOperationResponse>('/monitor/stop', 'POST', { id });
  }

  /**
   * 恢复监控
   */
  async resumeMonitor(id: string): Promise<MonitorOperationResponse> {
    return this.request<MonitorOperationResponse>('/monitor/resume', 'POST', { id });
  }

  /**
   * 删除监控
   */
  async deleteMonitor(id: string): Promise<MonitorOperationResponse> {
    return this.request<MonitorOperationResponse>('/monitor/delete', 'POST', { id });
  }
}

// 创建全局API服务实例
export const apiService = new ApiService();

/**
 * 获取友好的错误消息
 */
export const getFriendlyErrorMessage = (error: unknown): string => {
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return '网络请求失败 (Failed to fetch)。\n\n请检查以下几点：\n1. 确保您的 Python 后端服务正在运行。\n2. 确认后端服务地址配置正确。\n3. 检查浏览器开发者控制台 (F12) 获取更多信息。';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return '未知错误';
};