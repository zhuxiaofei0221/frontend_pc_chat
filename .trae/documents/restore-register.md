# 恢复注册功能

## 概述

恢复登录页的「去注册」功能。之前删除的注册相关代码需要从 vben-admin 官方仓库恢复。

## 当前状态

- `apps/web-ele/src/views/_core/authentication/login.vue`：`show-register` 设置为 `false`，注册入口被隐藏
- `apps/web-ele/src/router/routes/core.ts`：`Register` 路由已删除
- `packages/effects/common-ui/src/ui/authentication/index.ts`：`AuthenticationRegister` 导出已删除
- `packages/effects/common-ui/src/ui/authentication/register.vue`：文件已删除
- `apps/web-ele/src/views/_core/authentication/register.vue`：文件已删除

## 修改计划

### 修改 1：恢复 common-ui 注册组件

#### 文件 1.1：创建 `packages/effects/common-ui/src/ui/authentication/register.vue`

从官方仓库恢复 `AuthenticationRegister` 组件，包含注册表单渲染、表单提交、跳转登录页等功能。

### 修改 2：恢复 authentication 导出

#### 文件 2.1：`packages/effects/common-ui/src/ui/authentication/index.ts`

添加 `AuthenticationRegister` 导出：
```typescript
export { default as AuthenticationLogin } from './login.vue';
export { default as AuthenticationLoginExpiredModal } from './login-expired-modal.vue';
export { default as AuthenticationRegister } from './register.vue';
export type { AuthenticationProps } from './types';
```

### 修改 3：恢复 web-ele 注册页面

#### 文件 3.1：创建 `apps/web-ele/src/views/_core/authentication/register.vue`

从官方仓库恢复 web-ele 的注册页面（包含用户名、密码、确认密码、同意协议等表单字段）。

### 修改 4：恢复注册路由

#### 文件 4.1：`apps/web-ele/src/router/routes/core.ts`

在 `Authentication` 路由的 `children` 中添加 `Register` 路由：
```typescript
{
  name: 'Register',
  path: 'register',
  component: () => import('#/views/_core/authentication/register.vue'),
  meta: {
    title: $t('page.auth.register'),
  },
},
```

### 修改 5：登录页启用注册入口

#### 文件 5.1：`apps/web-ele/src/views/_core/authentication/login.vue`

将 `:show-register="false"` 改为 `:show-register="true"`（或直接删除该 prop，默认值即为 `true`）。

---

## 涉及修改的文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `packages/effects/common-ui/src/ui/authentication/register.vue` | 创建 | 恢复 AuthenticationRegister 组件 |
| `packages/effects/common-ui/src/ui/authentication/index.ts` | 修改 | 添加 AuthenticationRegister 导出 |
| `apps/web-ele/src/views/_core/authentication/register.vue` | 创建 | 恢复注册页面 |
| `apps/web-ele/src/router/routes/core.ts` | 修改 | 添加 Register 路由 |
| `apps/web-ele/src/views/_core/authentication/login.vue` | 修改 | 启用 show-register |

## 验证步骤

1. 运行 `pnpm dev:ele` 启动开发服务器
2. 打开登录页，验证底部显示「去注册」链接
3. 点击「去注册」，验证跳转到注册页面
4. 在注册页面验证表单字段显示正常
5. 验证无编译错误