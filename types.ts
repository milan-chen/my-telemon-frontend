export interface TelegramBotConfig {
  botToken: string;
  chatId: string;
}

export interface MonitorConfig {
  id: string;
  channel: string;
  keywords: string[];
  apiId: string;
  apiHash: string;
  isEnabled: boolean;
  telegramBotConfig: TelegramBotConfig;
  backendUrl: string;
  useRegex: boolean;
}