# Vben Admin (web-ele) 第二轮精简修改计划

## 概述

在上一轮修改基础上，继续进行3项修改：
1. 去除顶部右侧通知功能及相关代码
2. 分析页改为一级菜单，删除 Dashboard 父级概览
3. 删除 packages 目录下不必要的代码

## 当前状态

### 通知功能
- `basic.vue` 中仍有完整的通知相关代码：数据数组、处理函数、模板 slot
- 头部组件通过 `preferences.widget.notification`（默认 true）控制通知显示
- `packages/effects/layouts/src/widgets/notification/` 目录包含通知组件

### 分析页路由
- 当前结构：`Dashboard（父级） > Analytics（子级）`，路径 `/analytics`
- 需要改为：`Analytics` 直接作为一级菜单，路径 `/analytics`

### packages 目录
- web-ele 实际依赖的 packages：`@vben/access`、`@vben/common-ui`、`@vben/constants`、`@vben/hooks`、`@vben/icons`、`@vben/layouts`、`@vben/locales`、`@vben/plugins`、`@vben/preferences`、`@vben/request`、`@vben/stores`、`@vben/styles`、`@vben/types`、`@vben/utils`
- 这些 packages 中存在大量 web-ele 不再需要的代码

---

## 修改计划

### 修改 1：去除通知功能及相关代码

#### 文件 1.1：`apps/web-ele/src/layouts/basic.vue`

**修改内容**：移除所有通知相关代码。

删除：
- `NotificationItem` 类型导入
- `Notification` 组件导入
- 整个 `notifications` 数据数组（约50行）
- `showDot` 计算属性
- `handleNoticeClear`、`markRead`、`remove`、`handleMakeAll`、`viewAll`、`handleClick`、`navigateTo` 函数
- `useRouter` 导入和 `router` 变量（仅用于通知的 navigateTo）
- 模板中 `<template #notification>` 整个 slot

#### 文件 1.2：`apps/web-ele/src/preferences.ts`

**修改内容**：在 widget 配置中禁用通知。

```typescript
widget: {
  globalSearch: false,
  notification: false,
  timezone: false,
},
```

---

### 修改 2：分析页改为一级菜单

#### 文件 2.1：`apps/web-ele/src/router/routes/modules/dashboard.ts`

**修改内容**：移除 Dashboard 父级包装，将 Analytics 提升为一级路由。

修改后的路由结构：
```typescript
const routes: RouteRecordRaw[] = [
  {
    name: 'Analytics',
    path: '/analytics',
    component: () => import('#/views/dashboard/analytics/index.vue'),
    meta: {
      affixTab: true,
      icon: 'lucide:area-chart',
      title: $t('page.dashboard.analytics'),
    },
  },
];
```

**注意**：`defaultHomePath` 已是 `/analytics`，无需修改。

---

### 修改 3：删除 packages 目录下不必要的代码

此部分对 packages 目录进行清理，删除 web-ele 不再需要的代码并更新 barrel 导出文件。

#### 3.1：清理 layouts widgets 目录

**删除目录**：
- `packages/effects/layouts/src/widgets/notification/`（通知已禁用）
- `packages/effects/layouts/src/widgets/global-search/`（搜索已禁用）
- `packages/effects/layouts/src/widgets/timezone/`（时区已禁用）

**修改文件**：`packages/effects/layouts/src/widgets/index.ts`
- 删除 `export * from './check-updates';`
- 删除 `export * from './global-search';`
- 删除 `export * from './notification';`
- 删除 `export * from './timezone';`

#### 3.2：清理 common-ui authentication 组件

**删除文件**（`packages/effects/common-ui/src/ui/authentication/`）：
- `code-login.vue`
- `qrcode-login.vue`
- `forget-password.vue`
- `register.vue`
- `third-party-login.vue`
- `dingding-login.vue`

**保留文件**：
- `login.vue`（账号密码登录）
- `login-expired-modal.vue`（登录过期弹窗）
- `auth-title.vue`（登录标题）
- `types.ts`（类型定义）
- `index.ts`（需更新导出）

**修改文件**：`packages/effects/common-ui/src/ui/authentication/index.ts`
```typescript
export { default as AuthenticationLoginExpiredModal } from './login-expired-modal.vue';
export { default as AuthenticationLogin } from './login.vue';
export type { AuthenticationProps } from './types';
```

#### 3.3：删除 common-ui 中不再使用的 UI 目录

**删除目录**：
- `packages/effects/common-ui/src/ui/about/`
- `packages/effects/common-ui/src/ui/profile/`
- `packages/effects/common-ui/src/ui/dashboard/workbench/`

**修改文件**：`packages/effects/common-ui/src/ui/index.ts`
```typescript
export * from './authentication';
export * from './dashboard';
export * from './fallback';
```

**修改文件**：`packages/effects/common-ui/src/ui/dashboard/index.ts`
```typescript
export * from './analysis';
export type * from './typing';
```

#### 3.4：清理 plugins 中不再使用的插件

**删除目录**：
- `packages/effects/plugins/src/tiptap/`
- `packages/effects/plugins/src/motion/`
- `packages/effects/plugins/src/vxe-table/`

**注意**：`plugins/src/index.ts` 只导出 `plugins-context` 和 `types`，不直接导出各插件，因此不需修改 barrel 文件。但需要确认各插件目录的删除不会影响构建。

---

## 涉及修改的文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `apps/web-ele/src/layouts/basic.vue` | 修改 | 移除通知相关所有代码 |
| `apps/web-ele/src/preferences.ts` | 修改 | 添加 `notification: false` |
| `apps/web-ele/src/router/routes/modules/dashboard.ts` | 修改 | Analytics 提升为一级路由 |
| `packages/effects/layouts/src/widgets/index.ts` | 修改 | 移除已删除 widget 的导出 |
| `packages/effects/common-ui/src/ui/authentication/index.ts` | 修改 | 移除未使用的登录组件导出 |
| `packages/effects/common-ui/src/ui/index.ts` | 修改 | 移除 about/profile 导出 |
| `packages/effects/common-ui/src/ui/dashboard/index.ts` | 修改 | 移除 workbench 导出 |
| `packages/effects/layouts/src/widgets/notification/` | 删除 | 整个目录 |
| `packages/effects/layouts/src/widgets/global-search/` | 删除 | 整个目录 |
| `packages/effects/layouts/src/widgets/timezone/` | 删除 | 整个目录 |
| `packages/effects/common-ui/src/ui/authentication/` 6个文件 | 删除 | code-login, qrcode-login, forget-password, register, third-party-login, dingding-login |
| `packages/effects/common-ui/src/ui/about/` | 删除 | 整个目录 |
| `packages/effects/common-ui/src/ui/profile/` | 删除 | 整个目录 |
| `packages/effects/common-ui/src/ui/dashboard/workbench/` | 删除 | 整个目录 |
| `packages/effects/plugins/src/tiptap/` | 删除 | 整个目录 |
| `packages/effects/plugins/src/motion/` | 删除 | 整个目录 |
| `packages/effects/plugins/src/vxe-table/` | 删除 | 整个目录 |

---

## 关键假设与决策

1. **共享 packages 修改**：packages 是 workspace 共享包，但当前只有 web-ele 在使用，修改不会影响其他应用
2. **components 目录保留**：`packages/effects/common-ui/src/components/` 中的组件（如 captcha、col-page 等）虽然部分未使用，但保留以避免深度依赖分析遗漏
3. **echarts 插件保留**：分析页图表依赖 echarts 插件
4. **fallback 目录保留**：404/403/500 等错误页面仍需使用
5. **check-updates widget 保留**：虽然从 index.ts 移除导出，但文件本身保留，`basic/layout.vue` 中仍有引用

## 验证步骤

1. 运行 `pnpm dev:ele` 启动开发服务器
2. 验证顶部右侧无通知铃铛图标
3. 验证左侧菜单分析页为一级菜单，无 Dashboard 父级
4. 验证登录、分析页、锁定屏幕、退出登录功能正常
5. 验证无编译错误