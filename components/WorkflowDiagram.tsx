import React from 'react';
import { BrowserIcon } from './icons/BrowserIcon';
import { ServerIcon } from './icons/ServerIcon';
import { TelegramIcon } from './icons/TelegramIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';


const DiagramColumn: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="flex flex-col items-center text-center w-full lg:w-1/3 p-2">
        <div className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-3">{icon}</div>
        <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">{title}</h4>
        <div className="space-y-4 w-full">
            {children}
        </div>
    </div>
);

const Step: React.FC<{ number: string; children: React.ReactNode }> = ({ number, children }) => (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left w-full shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full font-bold mr-4">{number}</div>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{children}</p>
        </div>
    </div>
);

const Arrow: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`self-center text-gray-400 dark:text-gray-500 my-4 lg:my-0 lg:mx-4 ${className}`}>
        <ArrowRightIcon />
    </div>
);


export const WorkflowDiagram: React.FC = () => {
    return (
        <div className="my-6 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex flex-col lg:flex-row justify-around items-stretch">
                <DiagramColumn title="前端 (您的浏览器)" icon={<BrowserIcon className="w-full h-full" />}>
                    <Step number="1">
                        在 Telemon 界面上填写后端地址、频道、API 凭证、Bot 信息等。
                    </Step>
                    <Step number="2">
                        点击“保存”或启用开关，将配置通过 HTTP 请求发送给您的后端服务。
                    </Step>
                </DiagramColumn>

                <Arrow className="transform rotate-90 lg:rotate-0" />

                <DiagramColumn title="后端 (您的服务器)" icon={<ServerIcon className="w-full h-full" />}>
                    <Step number="3">
                        接收前端配置，使用 Telethon 库和您的 API 凭证登录 Telegram 账号。
                    </Step>
                    <Step number="4">
                        成功登录后，加入并实时监听目标频道中的新消息。
                    </Step>
                    <Step number="5">
                        当新消息出现时，检查其内容是否匹配您设置的关键词。
                    </Step>
                </DiagramColumn>
                
                <Arrow className="transform rotate-90 lg:rotate-0" />

                <DiagramColumn title="Telegram" icon={<TelegramIcon className="w-full h-full" />}>
                    <Step number="6">
                       如果关键词匹配成功，后端调用 Telegram Bot API 发送通知。
                    </Step>
                     <Step number="7">
                       您的 Bot 将消息推送到指定 Chat ID，您在客户端收到实时提醒。
                    </Step>
                </DiagramColumn>
            </div>
        </div>
    );
};
