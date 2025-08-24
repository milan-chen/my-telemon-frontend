# Telemon Frontend

一个用于配置和管理 Telegram 频道监控服务的现代化 Web 界面。通过直观的用户界面，您可以轻松设置目标频道和关键词进行监控。所有敏感信息（API 凭证、Bot 配置）都由服务器端统一管理，确保系统安全性。

## ✨ 特性

- 🎯 **频道监控配置** - 支持多个 Telegram 频道同时监控
- 🔍 **关键词过滤** - 支持普通关键词和正则表达式模式匹配
- 🤖 **智能通知** - 通过服务器端配置的 Telegram Bot 实时推送匹配消息
- 🔒 **安全架构** - 敏感信息由服务器端统一管理，前端只处理业务逻辑
- 🎨 **现代界面** - 基于 React 19 构建的响应式用户界面
- 🌙 **深色模式** - 支持明暗主题切换
- ⚡ **实时同步** - 与后端服务实时同步监控状态
- 🔧 **服务器状态检查** - 自动检查和显示后端配置状态

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

打开浏览器访问 `http://localhost:3000`

**首次使用**: 应用会自动弹出后端服务地址配置窗口，请输入您的后端服务地址（例如：`http://127.0.0.1:8080`）。

## 📁 项目结构

```
my-telemon-frontend/
├── components/              # React 组件
│   ├── icons/              # 图标组件
│   ├── Header.tsx          # 页面头部
│   ├── MonitorCard.tsx     # 监控卡片
│   ├── MonitorFormModal.tsx # 监控配置表单
│   ├── UserManualModal.tsx # 用户手册
│   ├── ServerStatusBanner.tsx # 服务器状态检查
│   └── WorkflowDiagram.tsx # 工作流程图
├── hooks/                  # 自定义 Hooks
│   └── useLocalStorage.ts  # 本地存储 Hook
├── App.tsx                 # 主应用组件
├── types.ts               # TypeScript 类型定义
├── index.tsx              # 应用入口
├── vite.config.ts         # Vite 配置
├── vite-env.d.ts          # 环境变量类型声明
└── package.json           # 项目配置
```

## 🔧 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果

## 🔌 后端服务

本项目需要配合后端服务使用。后端服务提供 Telegram 频道监控的核心功能，包括 API 凭证管理、频道消息获取、关键词匹配和通知推送等。

### 后端服务仓库

👉 **后端服务代码**: [my-telemon-backend](https://github.com/milan-chen/my-telemon-backend)

**重要**: 请先部署并启动后端服务，并在服务器端完成以下配置：
- Telegram API 凭证（API ID、API Hash）
- Telegram Bot Token
- 通知目标（Chat ID）

### API 接口

后端服务提供以下 API 接口：

- `GET /config/check` - 检查服务器配置状态
- `GET /status` - 获取当前活跃监控列表
- `POST /monitor/start` - 启动监控
- `POST /monitor/stop` - 停止监控

## 📝 使用说明

### 后端服务地址配置

1. **首次使用**：应用会自动弹出配置窗口，提示您输入后端服务地址
2. **测试连接**：可以在配置窗口中测试与后端的连接状态
3. **后续修改**：点击页面右上角的设置按钮可随时修改后端地址
4. **地址格式**：请输入完整的服务地址，例如：`http://127.0.0.1:8080`

### 服务器配置检查

1. **首次使用时**，应用会自动检查服务器配置状态
2. 确保显示 **"服务器配置就绪"** 后再创建监控任务
3. 如果配置不完整，请参考后端服务文档完成配置

### 创建和管理监控

1. **创建监控配置**
   - 点击「新建监控」按钮（仅在服务器配置就绪时可用）
   - 填写目标频道标识符（支持多种格式）
   - 设置关键词过滤（可选）
   - 选择是否使用正则表达式匹配

2. **管理监控任务**
   - 启用/禁用监控
   - 编辑监控配置
   - 删除不需要的监控

3. **查看监控状态**
   - 实时查看监控运行状态
   - 同步状态指示器
   - 服务器配置状态提示

### 支持的频道格式

系统支持多种频道标识符格式，会自动转换：

- `@channel_username` (推荐格式)
- `https://t.me/channel_username` (完整URL)
- `t.me/channel_username` (简化URL)
- `channel_username` (纯用户名)

## 🔐 安全性

- **增强的安全架构**: 所有敏感信息（API凭证、Bot Token）都由服务器端统一管理
- **前端隔离**: 前端只处理业务逻辑，不接触敏感数据
- **本地存储**: 监控配置保存在浏览器本地，便于管理
- **安全通信**: 前端与后端通过标准 HTTP API 安全通信

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 📄 许可证

本项目基于 MIT 许可证开源。