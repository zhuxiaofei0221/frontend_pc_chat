# Frontend PC Chat

基于 Vue Vben Admin 5.x 的 AI 聊天应用前端项目。

## 项目架构

### 整体结构

项目采用 Monorepo 架构，包含应用层、核心包层和内部工具层：

```
frontend_pc_chat/
├── apps/                    # 应用层
│   └── web-ele/             # 主应用
├── packages/@core/          # 核心包层
└── internal/                # 内部工具层
```

### 应用层 (apps/web-ele)

主应用目录结构：

```
apps/web-ele/src/
├── adapter/                 # 组件适配器（Element Plus 适配）
├── api/                     # API 请求层
│   ├── core/                # 核心 API（auth、chat、menu、user）
│   └── request.ts           # 请求客户端配置
├── layouts/                 # 布局组件（auth、basic）
├── locales/                 # 国际化配置
├── router/                  # 路由配置
│   ├── routes/              # 路由定义
│   ├── access.ts            # 权限控制
│   └── guard.ts             # 路由守卫
├── store/                   # 状态管理（auth）
├── views/                   # 页面视图
│   ├── _core/               # 核心页面（登录、注册、错误页）
│   ├── chat/                # 聊天页面
│   └── dashboard/           # 仪表盘页面
├── app.vue                  # 根组件
├── bootstrap.ts             # 应用引导
├── main.ts                  # 入口文件
└── preferences.ts           # 偏好设置
```

### 核心包层 (packages/@core)

提供可复用的核心能力：

| 包名 | 作用 |
|------|------|
| `base/design` | 设计系统（CSS、设计令牌、BEM） |
| `base/icons` | 图标组件（Lucide） |
| `base/shared` | 共享工具（缓存、颜色、常量、工具函数） |
| `base/typings` | 类型定义 |
| `composables` | 组合式函数（useIsMobile、useNamespace 等） |
| `preferences` | 偏好设置管理 |
| `ui-kit/form-ui` | 表单 UI 组件 |
| `ui-kit/layout-ui` | 布局 UI 组件 |
| `ui-kit/menu-ui` | 菜单 UI 组件 |
| `ui-kit/popup-ui` | 弹窗 UI 组件（Alert、Drawer、Modal） |
| `ui-kit/shadcn-ui` | shadcn-vue 组件库 |

### 内部工具层 (internal/)

开发工具配置：

- `lint-configs/` - ESLint、Stylelint、Commitlint 配置
- `node-utils/` - Node.js 工具函数
- `tailwind-config/` - Tailwind CSS 配置
- `tsconfig/` - TypeScript 配置
- `vite-config/` - Vite 配置插件

## 核心功能

### 聊天系统

核心聊天功能由四个子组件组成：

| 组件 | 作用 |
|------|------|
| `chat-conversation.vue` | 会话列表侧边栏，管理会话的创建、切换和删除 |
| `chat-editor.vue` | 消息输入编辑器，支持文本输入和发送 |
| `chat-render.vue` | 消息列表渲染，支持 Markdown 渲染和滚动 |
| `chat-welcome.vue` | 欢迎页面，无会话时展示 |

主要特性：
- 支持 SSE 流式消息响应，实现打字机效果
- 消息列表渲染（Markdown 支持）
- 会话管理（创建、删除、切换）

### 用户认证
- 登录/注册页面
- JWT Token 管理
- 权限路由守卫

### 仪表盘
- 数据可视化分析
- 访问趋势统计

### 基础设施
- **国际化**: 中英文支持
- **主题**: 多主题颜色配置
- **响应式**: 移动端适配
- **状态管理**: Pinia
- **路由**: Vue Router（支持 Hash/History）

## 技术栈

| 技术 | 版本 |
|------|------|
| Vue | 3.x |
| Vite | 6.x |
| TypeScript | 5.x |
| Element Plus | 最新 |
| Pinia | 最新 |
| Vue Router | 4.x |
| Tailwind CSS | 4.x |

## 数据流

```
用户操作 → View 组件 → API 层 → 后端服务
                          ↓
                     状态管理 (Pinia)
                          ↓
                     视图更新
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `VITE_APP_TITLE` | 应用标题 |
| `VITE_APP_NAMESPACE` | 应用命名空间，用于缓存和 store 的前缀隔离 |
| `VITE_APP_STORE_SECURE_KEY` | store 持久化加密密钥 |
| `VITE_GLOB_API_URL` | API 接口地址 |
| `VITE_ROUTER_HISTORY` | 路由模式（hash/history） |

## 启动方式

```bash
# 安装依赖
pnpm install

# 开发模式（从根目录）
pnpm dev:ele

# 生产构建
pnpm build:ele

# 类型检查
pnpm check:type

# 代码格式化
pnpm format
```

## 许可证

MIT
