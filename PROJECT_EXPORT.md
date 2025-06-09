# プロジェクトエクスポートガイド

## GitHubへの手動保存方法

### 1. 既存リポジトリを削除して再作成
GitHub上で `GasTemplate` リポジトリを削除し、新しく作成：
- リポジトリ名: `gas-document-assistant`
- 説明: `Google Apps Script業務自動化ウェブアプリケーション`

### 2. Zipファイル作成による手動アップロード
以下のコマンドでプロジェクトをパッケージ化：

```bash
# Replitコンソールで実行
zip -r gas-document-assistant.zip . -x "node_modules/*" ".git/*" "dist/*" "*.log"
```

### 3. 必要なファイル一覧
```
README.md               # プロジェクト説明
LICENSE                 # MITライセンス
.env.example           # 環境変数テンプレート
DEPLOYMENT.md          # デプロイ手順
package.json           # 依存関係
client/                # フロントエンド
server/                # バックエンド
shared/                # 共通スキーマ
components.json        # shadcn設定
tailwind.config.ts     # Tailwind設定
vite.config.ts         # Vite設定
drizzle.config.ts      # Drizzle設定
```

### 4. アップロード手順
1. GitHub新リポジトリページで「Upload files」クリック
2. zipファイルをドラッグ&ドロップ
3. コミットメッセージ: "Initial commit: GAS文書アシスタント完成版"
4. "Commit changes"をクリック

### 5. クローン後のセットアップ
```bash
git clone https://github.com/masasen/gas-document-assistant.git
cd gas-document-assistant
npm install
cp .env.example .env
# データベース情報を.envに設定
npm run db:push
npm run dev
```