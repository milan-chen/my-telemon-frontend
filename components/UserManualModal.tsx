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
            欢迎使用 Telemon！本应用是一个功能强大的前端控制台，用于配置和管理后端的 Telegram 监控服务。所有敏感信息（API凭证、Bot配置）均由服务器端统一管理，确保安全性。
          </p>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">核心概念</h3>
            <p className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 p-4 rounded-lg">
                本应用分为两部分：您正在使用的 **前端控制台** 和一个需要您自己部署的 **Python 后端服务**。前端负责监控配置管理，而后端则执行实际的监控任务和通知发送。所有敏感信息（API凭证、Bot Token）都在后端统一配置，前端只需提供业务逻辑参数。
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
              要使监控生效，您必须部署配套的 Python 后端服务，并在服务器端完成 Telegram API 和 Bot 配置。请访问以下 GitHub 仓库，并严格按照其 <strong>README.md</strong> 文件中的指南进行部署和配置。
            </p>
            <div className="my-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <a href="https://github.com/milan-chen/my-telemon-backend" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono text-sm break-all">
                https://github.com/milan-chen/my-telemon-backend
              </a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              后端仓库的 README 文件提供了详细的安装、配置和启动说明，包括 Telegram API 凭证、Bot Token 和通知目标的配置方法。
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">前端使用指南</h3>
             <ol className="list-decimal list-inside space-y-4">
              <li><strong>检查服务器状态:</strong> 首次打开应用时，会自动检查服务器配置状态。确保显示"服务器配置就绪"后再创建监控。</li>
              <li><strong>新建监控:</strong> 点击主界面的"新建监控"按钮（仅在服务器配置就绪时可用）。</li>
              <li>
                <strong>填写监控配置:</strong>
                <p className="mt-2 mb-4 ml-6 text-gray-600 dark:text-gray-400">
                  在弹出的表单中，您只需要填写业务逻辑相关的配置信息。
                </p>
                <ul className="list-disc list-inside ml-6 mt-2 space-y-3 text-gray-600 dark:text-gray-400">
                  <li><strong>目标频道:</strong> 输入您想监控的 Telegram 频道标识符，支持多种格式：
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-sm">
                      <li><code>@channel_username</code> (推荐格式)</li>
                      <li><code>https://t.me/channel_username</code> (完整URL)</li>
                      <li><code>t.me/channel_username</code> (简化URL)</li>
                      <li><code>channel_username</code> (纯用户名)</li>
                    </ul>
                  </li>
                  <li><strong>关键词 (可选):</strong> 输入您希望匹配的关键词，每输入一个后按 Enter 键添加。如果留空，则会监控频道的所有消息。</li>
                  <li><strong>正则表达式:</strong> 开启此选项可以使用正则表达式进行更复杂的关键词匹配。</li>
                </ul>
              </li>
               <li><strong>保存与管理:</strong> 点击"保存"以启动监控。在主界面，您可以使用卡片上的开关来实时地启动或暂停监控任务。</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">安全说明</h3>
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
              <p className="font-semibold mb-2">🔒 增强的安全性</p>
              <p className="text-sm">
                所有敏感信息（Telegram API 凭证、Bot Token、通知目标）现在都由服务器端统一管理，前端不再需要处理这些敏感数据。这大大提高了系统的安全性，降低了凭证泄露的风险。
              </p>
            </div>
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