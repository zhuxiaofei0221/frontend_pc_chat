# Vben Admin (web-ele) 精简修改计划

## 概述

基于 Vben Admin monorepo 中的 `web-ele` 应用进行以下4项修改：
1. 登录页只保留账号密码登录
2. 只保留分析页，其余页面删除
3. 顶部右侧去除搜索和时区功能
4. 用户头像下拉只保留锁定屏幕和退出登录

## 当前状态分析

### 项目结构
- 目标应用：`apps/web-ele/`
- 依赖的共享包：`packages/effects/layouts/`、`packages/effects/common-ui/`、`packages/@core/preferences/`

### 当前登录页
- `apps/web-ele/src/views/_core/authentication/login.vue`：使用 `AuthenticationLogin` 组件，表单包含账号选择、用户名、密码、滑块验证码
- `AuthenticationLogin` 组件（`packages/effects/common-ui/src/ui/authentication/login.vue`）通过 props 控制：`showCodeLogin`、`showQrcodeLogin`、`showForgetPassword`、`showRegister`、`showThirdPartyLogin`、`showRememberMe`
- 路由 `apps/web-ele/src/router/routes/core.ts` 中注册了 5 种登录方式：Login、CodeLogin、QrCodeLogin、ForgetPassword、Register

### 当前路由
- `dashboard.ts`：Analytics（分析页）、Workspace（工作台）
- `demos.ts`：ElementPlus 演示、Form 演示
- `vben.ts`：VbenProject 系列（文档、GitHub、各框架预览）、VbenAbout、Profile

### 当前头部
- 头部组件位于 `packages/effects/layouts/src/basic/header/header.vue`
- 搜索和时区通过 preferences 控制：`preferences.widget.globalSearch`、`preferences.widget.timezone`
- 默认配置中两者均为 `true`

### 当前用户下拉
- `apps/web-ele/src/layouts/basic.vue` 中 `menus` 数组包含：Profile、Document、GitHub、QA
- `UserDropdown` 组件（`packages/effects/layouts/src/widgets/user-dropdown/user-dropdown.vue`）内置：Lock Screen（受 `preferences.widget.lockScreen` 控制）、Settings（受 `preferencesButtonPosition` 控制）、Logout（始终显示）

---

## 修改计划

### 修改 1：登录页只保留账号密码登录

#### 文件 1.1：`apps/web-ele/src/views/_core/authentication/login.vue`

**修改内容**：在 `AuthenticationLogin` 组件上添加 props 禁用所有其他登录方式。

```vue
<AuthenticationLogin
  :form-schema="formSchema"
  :loading="authStore.loginLoading"
  :show-code-login="false"
  :show-forget-password="false"
  :show-qrcode-login="false"
  :show-register="false"
  :show-third-party-login="false"
  @submit="authStore.authLogin"
/>
```

同时简化表单 schema，移除 `selectAccount` 下拉选择字段（保持简洁的账号密码登录），只保留：用户名、密码、滑块验证码。

#### 文件 1.2：`apps/web-ele/src/router/routes/core.ts`

**修改内容**：从 `Authentication` 路由的 `children` 中删除 `CodeLogin`、`QrCodeLogin`、`ForgetPassword`、`Register` 四条路由，只保留 `Login`。

---

### 修改 2：只保留分析页，其余页面删除

#### 文件 2.1：`apps/web-ele/src/router/routes/modules/dashboard.ts`

**修改内容**：删除 `Workspace` 子路由，只保留 `Analytics`。

#### 文件 2.2：删除 `apps/web-ele/src/router/routes/modules/demos.ts`

**修改内容**：直接删除整个文件。路由系统通过 `import.meta.glob` 自动加载，删除文件即可移除路由。

#### 文件 2.3：删除 `apps/web-ele/src/router/routes/modules/vben.ts`

**修改内容**：直接删除整个文件。移除所有 Vben 项目相关路由、About 页面路由和 Profile 路由（Profile 已不需要，因为用户下拉只保留锁定屏幕和退出登录）。

---

### 修改 3：顶部右侧去除搜索和时区功能

#### 文件 3.1：`apps/web-ele/src/preferences.ts`

**修改内容**：在 `defineOverridesPreferences` 中覆盖 widget 配置，禁用全局搜索和时区。

```typescript
export const overridesPreferences = defineOverridesPreferences({
  app: {
    name: import.meta.env.VITE_APP_TITLE,
  },
  widget: {
    globalSearch: false,
    timezone: false,
  },
});
```

---

### 修改 4：用户头像下拉只保留锁定屏幕和退出登录

#### 文件 4.1：`apps/web-ele/src/layouts/basic.vue`

**修改内容**：
1. 删除 `menus` 计算属性（或设为空数组）
2. 删除 `VBEN_DOC_URL`、`VBEN_GITHUB_URL`、`BookOpenText`、`CircleHelp`、`SvgGithubIcon` 的导入（不再需要）
3. `UserDropdown` 组件 `:menus="[]"`（或直接删除 `:menus` prop）
4. 在 `overridesPreferences` 中设置 `preferencesButtonPosition: 'header'` 来隐藏用户下拉中的设置入口

**注意**：`UserDropdown` 组件内置的「锁定屏幕」（受 `preferences.widget.lockScreen` 控制，默认 true）和「退出登录」始终显示，因此只需移除自定义 menus 和设置入口即可。

#### 文件 4.2：`apps/web-ele/src/preferences.ts`

**修改内容**：设置 `preferencesButtonPosition` 为 `'header'`（从下拉菜单中移除设置入口）。

```typescript
export const overridesPreferences = defineOverridesPreferences({
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    preferencesButtonPosition: 'header',
  },
  widget: {
    globalSearch: false,
    timezone: false,
  },
});
```

---

## 涉及修改的文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `apps/web-ele/src/views/_core/authentication/login.vue` | 修改 | 禁用其他登录方式，简化表单 |
| `apps/web-ele/src/router/routes/core.ts` | 修改 | 删除非登录路由 |
| `apps/web-ele/src/router/routes/modules/dashboard.ts` | 修改 | 只保留 Analytics |
| `apps/web-ele/src/router/routes/modules/demos.ts` | 删除 | 移除演示页路由 |
| `apps/web-ele/src/router/routes/modules/vben.ts` | 删除 | 移除 Vben/About/Profile 路由 |
| `apps/web-ele/src/preferences.ts` | 修改 | 禁用搜索、时区，设置偏好按钮位置 |
| `apps/web-ele/src/layouts/basic.vue` | 修改 | 简化用户下拉菜单 |

---

## 关键假设与决策

1. **目标应用**：用户确认修改 `web-ele`（Element Plus 版本）
2. **通知功能保留**：用户未要求移除通知，保留不变
3. **主题切换保留**：用户未要求移除主题切换，保留不变
4. **语言切换保留**：用户未要求移除，但可通过 preferences 进一步禁用
5. **滑块验证码保留**：属于账号密码登录的一部分，保留
6. **路由文件删除方式**：直接删除文件，因为 `import.meta.glob` 自动发现模块，无需修改 index.ts

## 验证步骤

1. 运行 `pnpm dev:ele` 启动开发服务器
2. 验证登录页只显示账号密码登录，无其他登录方式入口
3. 登录后验证只显示分析页（Analytics），无其他菜单项
4. 验证顶部右侧无搜索框和时区按钮
5. 点击头像验证下拉菜单只有锁定屏幕和退出登录
6. 验证退出登录功能正常