# Frontend PC Chat

Vue Vben Admin 5.x ベースのAIチャットアプリケーションフロントエンドプロジェクトです。

## プロジェクトアーキテクチャ

### 全体構成

プロジェクトはMonorepoアーキテクチャを採用し、アプリケーション層、コアパッケージ層、内部ツール層の3層構造で構成されています。

```
frontend_pc_chat/
├── apps/                    # アプリケーション層
│   └── web-ele/             # メインアプリケーション
├── packages/@core/          # コアパッケージ層
└── internal/                # 内部ツール層
```

### アプリケーション層 (apps/web-ele)

メインアプリケーションのディレクトリ構造：

```
apps/web-ele/src/
├── adapter/                 # コンポーネントアダプタ（Element Plus アダプト）
├── api/                     # APIリクエスト層
│   ├── core/                # コアAPI（auth、chat、menu、user）
│   └── request.ts           # リクエストクライアント設定
├── layouts/                 # レイアウトコンポーネント（auth、basic）
├── locales/                 # 国際化設定
├── router/                  # ルーター設定
│   ├── routes/              # ルート定義
│   ├── access.ts            # アクセス制御
│   └── guard.ts             # ルーターガード
├── store/                   # ステート管理（auth）
├── views/                   # ページビュー
│   ├── _core/               # コアページ（ログイン、登録、エラーページ）
│   ├── chat/                # チャットページ
│   └── dashboard/           # ダッシュボードページ
├── app.vue                  # ルートコンポーネント
├── bootstrap.ts             # アプリケーションブートストラップ
├── main.ts                  # エントリーファイル
└── preferences.ts           # 設定
```

### コアパッケージ層 (packages/@core)

再利用可能なコア機能を提供します：

| パッケージ名 | 役割 |
|------|------|
| `base/design` | デザインシステム（CSS、デザイントークン、BEM） |
| `base/icons` | アイコンコンポーネント（Lucide） |
| `base/shared` | 共有ツール（キャッシュ、カラー、定数、ユーティリティ関数） |
| `base/typings` | 型定義 |
| `composables` | コンポーザブル関数（useIsMobile、useNamespace など） |
| `preferences` | 設定管理 |
| `ui-kit/form-ui` | フォームUIコンポーネント |
| `ui-kit/layout-ui` | レイアウトUIコンポーネント |
| `ui-kit/menu-ui` | メニューUIコンポーネント |
| `ui-kit/popup-ui` | ポップアップUIコンポーネント（Alert、Drawer、Modal） |
| `ui-kit/shadcn-ui` | shadcn-vue コンポーネントライブラリ |

### 内部ツール層 (internal/)

開発ツール設定：

- `lint-configs/` - ESLint、Stylelint、Commitlint 設定
- `node-utils/` - Node.js ユーティリティ関数
- `tailwind-config/` - Tailwind CSS 設定
- `tsconfig/` - TypeScript 設定
- `vite-config/` - Vite 設定プラグイン

## コア機能

### チャットシステム

コアチャット機能は4つのサブコンポーネントで構成されています：

| コンポーネント | 役割 |
|------|------|
| `chat-conversation.vue` | 会話リストサイドバー、会話の作成・切り替え・削除を管理 |
| `chat-editor.vue` | メッセージ入力エディタ、テキスト入力と送信をサポート |
| `chat-render.vue` | メッセージリストレンダリング、Markdownレンダリングとスクロールをサポート |
| `chat-welcome.vue` | ウェルカムページ、会話がない場合に表示 |

主な機能：
- SSEストリーミングメッセージ応答をサポート、タイプライター効果を実現
- メッセージリストレンダリング（Markdownサポート）
- 会話管理（作成、削除、切り替え）

### ユーザー認証
- ログイン/登録ページ
- JWT Token管理
- アクセス制御ルーターガード

### ダッシュボード
- データ可視化分析
- アクセストレンド統計

### インフラストラクチャ
- **国際化**: 中英語対応
- **テーマ**: 複数のテーマカラー設定
- **レスポンシブ**: モバイル端末対応
- **ステート管理**: Pinia
- **ルーター**: Vue Router（Hash/Historyモード対応）

## 技術スタック

| 技術 | バージョン |
|------|------|
| Vue | 3.x |
| Vite | 6.x |
| TypeScript | 5.x |
| Element Plus | 最新 |
| Pinia | 最新 |
| Vue Router | 4.x |
| Tailwind CSS | 4.x |

## データフロー

```
ユーザー操作 → Viewコンポーネント → API層 → バックエンドサービス
                          ↓
                     ステート管理 (Pinia)
                          ↓
                     ビュー更新
```

## 環境変数

| 変数 | 説明 |
|------|------|
| `VITE_APP_TITLE` | アプリケーションタイトル |
| `VITE_APP_NAMESPACE` | アプリケーションネームスペース、キャッシュとstoreのプレフィックス分離に使用 |
| `VITE_APP_STORE_SECURE_KEY` | store永続化の暗号化キー |
| `VITE_GLOB_API_URL` | APIエンドポイントアドレス |
| `VITE_ROUTER_HISTORY` | ルーターモード（hash/history） |

## 起動方法

```bash
# 依存関係のインストール
pnpm install

# 開発モード（ルートディレクトリから）
pnpm dev:ele

# 本番ビルド
pnpm build:ele

# タイプチェック
pnpm check:type

# コードフォーマット
pnpm format
```

## ライセンス

MIT