# デプロイメントガイド

## 本番環境へのデプロイ手順

### 1. 環境変数の設定
```bash
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your_database_host
PGPORT=5432
PGUSER=your_database_user
PGPASSWORD=your_database_password
PGDATABASE=your_database_name
NODE_ENV=production
```

### 2. データベースセットアップ
```bash
npm run db:push
```

### 3. 本番ビルド
```bash
npm run build
npm start
```

### 4. Replit Deploymentsでのデプロイ
1. Replitプロジェクトで「Deploy」ボタンをクリック
2. 「Static Deployment」または「Autoscale Deployment」を選択
3. 環境変数を設定
4. デプロイ実行

### 5. その他のプラットフォーム
- **Vercel**: `vercel.json` 設定ファイルが必要
- **Netlify**: `netlify.toml` 設定ファイルが必要
- **Railway**: 自動デプロイ対応
- **Render**: 自動デプロイ対応

## 重要なファイル
- `package.json` - 依存関係とスクリプト
- `drizzle.config.ts` - データベース設定
- `server/index.ts` - サーバーエントリーポイント
- `client/src/` - フロントエンドソース