# Telemon Frontend

一个用于配置和管理 Telegram 频道监控服务的现代化 Web 界面。通过直观的用户界面，您可以轻松设置目标频道、关键词、API 凭证和 Telegram Bot 通知。所有配置都保存在您的浏览器本地。

## ✨ 特性

- 🎯 **频道监控配置** - 支持多个 Telegram 频道同时监控
- 🔍 **关键词过滤** - 支持普通关键词和正则表达式模式匹配
- 🤖 **智能通知** - 通过 Telegram Bot 实时推送匹配消息
- 💾 **本地存储** - 所有配置保存在浏览器本地，无需担心隐私泄露
- 🎨 **现代界面** - 基于 React 19 构建的响应式用户界面
- 🌙 **深色模式** - 支持明暗主题切换
- ⚡ **实时同步** - 与后端服务实时同步监控状态

## 🛠️ 技术栈

- **前端框架**: React 19.1.1
- **构建工具**: Vite 6.2.0
- **语言**: TypeScript 5.8.2
- **样式**: Tailwind CSS (内联样式)
- **状态管理**: React Hooks + 自定义 LocalStorage Hook

## 📋 系统要求

- Node.js (建议 18.0+)
- npm 或 yarn
- 现代浏览器 (支持 ES Module)

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd my-telemon-frontend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问 `http://localhost:5173`

## 📁 项目结构

```
my-telemon-frontend/
├── components/              # React 组件
│   ├── icons/              # 图标组件
│   ├── Header.tsx          # 页面头部
│   ├── MonitorCard.tsx     # 监控卡片
│   ├── MonitorFormModal.tsx # 监控配置表单
│   ├── UserManualModal.tsx # 用户手册
│   └── WorkflowDiagram.tsx # 工作流程图
├── hooks/                  # 自定义 Hooks
│   └── useLocalStorage.ts  # 本地存储 Hook
├── App.tsx                 # 主应用组件
├── types.ts               # TypeScript 类型定义
├── index.tsx              # 应用入口
├── vite.config.ts         # Vite 配置
└── package.json           # 项目配置
```

## 🔧 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果

## 🔌 后端服务

本项目需要配合后端服务使用。后端服务提供 Telegram 频道监控的核心功能，包括频道消息获取、关键词匹配和通知推送等。

### 后端服务仓库

👉 **后端服务代码**: [my-telemon-backend](https://github.com/milan-chen/my-telemon-backend)

请先部署并启动后端服务，然后在前端配置监控时填写正确的后端服务地址 (例如: `http://127.0.0.1:8080`)。

### API 接口

- `POST /monitor/start` - 启动监控
- `POST /monitor/stop` - 停止监控

## 📝 使用说明

1. **创建监控配置**
   - 点击「新建监控」按钮
   - 填写 Telegram 频道信息和 API 凭证
   - 设置关键词和通知机器人
   - 配置后端服务地址

2. **管理监控任务**
   - 启用/禁用监控
   - 编辑监控配置
   - 删除不需要的监控

3. **查看监控状态**
   - 实时查看监控运行状态
   - 同步状态指示器

## 🔐 隐私与安全

- 所有敏感配置信息仅存储在您的浏览器本地
- API 密钥和 Bot Token 不会上传到任何服务器
- 建议定期备份您的配置数据

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 📄 许可证

本项目基于 MIT 许可证开源。
