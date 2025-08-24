/// <reference types="vite/client" />

// 扩展 ImportMetaEnv 接口以支持环境变量类型检查
interface ImportMetaEnv {
  // 可以在这里添加其他环境变量类型定义
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}