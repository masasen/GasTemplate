# GAS文書アシスタント

Google Apps Script（GAS）を活用した業務自動化のためのウェブアプリケーション。事務職向けに見積書・注文書・請求書などの帳票類の自動化を支援し、ノーコードっぽい親しみやすいUIで提供します。

## 主な機能

### 📋 文書テンプレート管理
- **基本見積書**: シンプルな見積書テンプレート
- **詳細注文書**: 項目詳細付きの注文書テンプレート  
- **月次請求書**: 月次請求書テンプレート
- **カスタムテンプレート**: 独自のテンプレート作成機能

### 🔧 GASコード自動生成
- フォーム入力データからGoogle Apps Scriptコードを自動生成
- スプレッドシート操作コード付き
- コピー&ペーストで即座に利用可能

### 📊 リアルタイムプレビュー
- 入力内容をリアルタイムで文書プレビュー
- PDF形式でのエクスポート機能
- 会社情報・顧客情報・明細項目の管理

### 📁 文書履歴管理
- 生成された文書の履歴保存
- 過去の文書の再利用とダウンロード
- PostgreSQLデータベースでの永続化

## 技術スタック

### フロントエンド
- **React.js** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Wouter** (ルーティング)
- **React Query** (データフェッチング)
- **React Hook Form** (フォーム管理)

### バックエンド
- **Node.js** + **Express**
- **Drizzle ORM**
- **PostgreSQL** (Neon Database)
- **TypeScript**

### 開発環境
- **Vite** (ビルドツール)
- **Replit** (開発・ホスティング)

## インストール・セットアップ

### 前提条件
- Node.js 18以上
- PostgreSQLデータベース

### 環境変数
```bash
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your_host
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=your_database
```

### インストール
```bash
# 依存関係をインストール
npm install

# データベースセットアップ
npm run db:push

# 開発サーバー起動
npm run dev
```

## プロジェクト構造

```
├── client/src/
│   ├── components/          # UI コンポーネント
│   ├── pages/              # ページコンポーネント
│   ├── lib/                # ユーティリティ
│   └── hooks/              # カスタムフック
├── server/
│   ├── routes.ts           # API ルート
│   ├── storage.ts          # データアクセス層
│   └── db.ts              # データベース接続
├── shared/
│   └── schema.ts           # データベーススキーマ
└── package.json
```

## API エンドポイント

### テンプレート管理
- `GET /api/templates` - 全テンプレート取得
- `GET /api/templates/:id` - 特定テンプレート取得
- `POST /api/templates` - 新規テンプレート作成

### 文書生成
- `POST /api/generate` - GASコード生成
- `GET /api/generated` - 生成履歴取得
- `GET /api/generated/:id` - 特定文書取得

## 使用方法

1. **テンプレート選択**: ホームページから目的のテンプレートを選択
2. **情報入力**: 会社情報・顧客情報・明細項目を入力
3. **プレビュー確認**: リアルタイムで生成される文書を確認
4. **GASコード生成**: 「GASコードを生成」ボタンでコード自動作成
5. **コード利用**: 生成されたコードをGoogle Apps Scriptにコピー&ペースト

## ライセンスｖ３

MIT License

## 開発者

事務職向け業務自動化ツールとして開発されました。
```