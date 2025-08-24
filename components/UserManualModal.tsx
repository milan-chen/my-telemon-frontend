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
            欢迎使用 My Telemon Frontend！这是一个基于 React 19 构建的现代化 Telegram 频道监控前端控制台。本应用采用安全的分离式架构设计，通过直观的 Web 界面帮助您轻松配置和管理多个频道的实时监控任务。所有敏感信息（API凭证、Bot配置）均由后端服务统一管理，前端专注于提供优秀的用户体验和业务逻辑。支持多种监控状态、智能操作控制和响应式界面设计。
          </p>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">核心概念</h3>
            <p className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 p-4 rounded-lg">
                本应用分为两部分：您正在使用的 **前端控制台** 和一个需要您自己部署的 **Python 后端服务**。前端负责监控配置管理和用户界面交互，而后端则执行实际的监控任务和通知发送。采用这种分离式架构设计，所有敏感信息（API凭证、Bot Token）都在后端统一配置和管理，大大提升了系统的安全性，降低了凭证泄露的风险。
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
              <li><strong>配置后端服务地址:</strong> 首次打开应用时，会自动弹出后端服务地址配置窗口。输入您的后端服务地址（如：<code>http://127.0.0.1:8080</code>），配置信息将安全保存在本地。</li>
              <li><strong>检查服务器状态:</strong> 配置后端地址后，应用会自动检查服务器配置状态。确保显示"服务器配置就绪"后再创建监控任务。</li>
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
                  <li><strong>关键词过滤 (可选):</strong> 输入您希望匹配的关键词，每输入一个后按 Enter 键添加。如果留空，则会监控频道的所有消息。</li>
                  <li><strong>正则表达式:</strong> 开启此选项可以使用正则表达式进行更复杂的关键词匹配。</li>
                </ul>
              </li>
               <li>
                <strong>监控状态管理:</strong> 保存配置后，可在主界面查看监控状态，系统支持以下状态：
                <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                  <li><strong>🟢 运行中 (running):</strong> 监控活跃，正在实时检测消息，可执行停止操作</li>
                  <li><strong>⚪ 已停止 (stopped):</strong> 监控暂停，不会检测消息，可执行恢复操作</li>
                  <li><strong>🔵 启动中 (starting):</strong> 状态转换中，请等待操作完成</li>
                  <li><strong>🔴 错误状态 (error):</strong> 出现异常，可尝试重新启动或检查配置</li>
                </ul>
                <p className="mt-2 ml-6 text-sm text-gray-600 dark:text-gray-400">
                  系统根据当前状态动态显示可用操作按钮，删除操作需要二次确认防止误操作。
                </p>
              </li>
              <li><strong>响应式界面:</strong> 桌面端显示表格视图，移动端自动切换为卡片视图，操作更加便捷。</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">安全说明</h3>
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
              <p className="font-semibold mb-2">🔒 分离式安全架构</p>
              <p className="text-sm">
                采用前后端分离的安全架构设计：所有敏感信息（Telegram API 凭证、Bot Token、通知目标）完全由后端服务统一管理，前端只处理业务逻辑和用户界面交互。这种设计大大提高了系统的安全性，有效降低了凭证泄露的风险，同时确保了数据的一致性和可靠性。
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