import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { WorkflowDiagram } from './WorkflowDiagram';

interface UserManualModalProps {
  onClose: () => void;
}

const UserManualModal: React.FC<UserManualModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-95 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            用户手册
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors">
            <CloseIcon />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-6 text-gray-700 dark:text-gray-300">
          <p>
            欢迎使用 Telemon！本应用是一个功能强大的前端控制台，用于配置和管理后端的 Telegram 监控服务。所有配置信息均保存在您的浏览器本地。
          </p>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">核心概念</h3>
            <p className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 p-4 rounded-lg">
                本应用分为两部分：您正在使用的 **前端控制台** 和一个需要您自己部署的 **Python 后端服务**。前端负责配置管理，而后端则执行实际的监控和通知任务。
             </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">工作流程：从配置到通知</h3>
             <p className="mb-4">
              下图清晰地展示了从您在前端界面进行配置，到最终在 Telegram 中收到通知的完整数据流和各部分职责。
            </p>
            <WorkflowDiagram />
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">后端部署 (关键步骤)</h3>
            <p className="mb-2">
              要使监控生效，您必须部署配套的 Python 后端服务。请访问以下 GitHub 仓库，并严格按照其 <strong>README.md</strong> 文件中的指南进行部署和运行。
            </p>
            <div className="my-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <a href="https://github.com/milan-chen/my-telemon-backend" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono text-sm break-all">
                https://github.com/milan-chen/my-telemon-backend
              </a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              仓库的 README 文件提供了详细的安装、配置和启动说明，包括首次登录时需要在终端进行交互以生成 <code>.session</code> 文件的关键步骤。
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">前端配置</h3>
             <ol className="list-decimal list-inside space-y-4">
              <li><strong>新建监控:</strong> 点击主界面的“新建监控”按钮。</li>
              <li>
                <strong>填写配置:</strong>
                <p className="mt-2 mb-4 ml-6 text-gray-600 dark:text-gray-400">
                  在弹出的表单中，您需要填写监控所需的各项信息。
                </p>
                <ul className="list-disc list-inside ml-6 mt-2 space-y-3 text-gray-600 dark:text-gray-400">
                  <li><strong>后端服务地址:</strong> 填入您部署的后端服务地址 (例如 <code>http://127.0.0.1:8080</code>)。</li>
                  <li><strong>目标频道:</strong> 输入您想监控的公开频道的 <code>@username</code> 或私有频道的邀请链接。</li>
                  <li><strong>关键词:</strong> 输入您希望匹配的关键词，每输入一个后按 Enter 键添加。如果留空，则会匹配所有消息。</li>
                  <li><strong>API 凭证:</strong> 填写您的 Telegram API ID 和 API Hash。您可以登录 <a href="https://my.telegram.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">my.telegram.org</a> 在 "API development tools" 页面获取。</li>
                  <li>
                    <strong>Telegram Bot 通知:</strong>
                    <p className="my-2">为了接收通知，您需要创建一个自己的 Telegram Bot 并获取两项信息：<strong>Bot Token</strong> 和 <strong>Chat ID</strong>。请按照以下步骤操作，然后将获取到的信息填入表单：</p>
                    <div className="p-4 my-2 space-y-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">1. 创建机器人并获取 Bot Token</div>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                          <li>在 Telegram 中搜索 <code>@BotFather</code>，它是官方的机器人之父。</li>
                          <li>开始对话，发送 <code>/newbot</code> 命令。</li>
                          <li>按照提示，为您的机器人设置一个名称 (Name) 和一个唯一的用户名 (Username)。用户名必须以 'bot' 结尾。</li>
                          <li>创建成功后，BotFather 会立即返回一长串字符，这就是您的 <strong>Bot Token</strong>。</li>
                        </ul>
                        <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-md text-xs">
                          <strong>注意:</strong> Bot Token 像密码一样敏感，请勿泄露给他人。
                        </div>

                        <div className="font-semibold text-gray-800 dark:text-gray-200 mt-4">2. 获取您的 Chat ID</div>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                          <li>通过搜索，找到您刚刚创建的机器人，并给它发送一条任意消息 (例如 "你好" 或点击 "Start")。<strong>这是必须的步骤</strong>，否则机器人无法主动联系您。</li>
                          <li>在 Telegram 中搜索 <code>@userinfobot</code> 并开始对话。</li>
                          <li>它会立刻返回您的信息，其中 "Id:" 后面的一串数字就是您的 <strong>Chat ID</strong>。</li>
                        </ul>
                    </div>
                  </li>
                </ul>
              </li>
               <li><strong>保存与管理:</strong> 点击“保存”以启动监控。在主界面，您可以使用卡片上的开关来实时地启动或暂停后端的监控任务。</li>
            </ol>
          </section>
        </div>
        
        <div className="flex justify-end items-center gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
            关闭
          </button>
        </div>
      </div>
      <style>{`.animate-scale-in { animation: scaleIn 0.2s ease-out forwards; } @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
};

export default UserManualModal;
