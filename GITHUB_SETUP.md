# GitHubセットアップガイド

## 手動でGitHubに保存する手順

### 1. GitHubで新しいリポジトリを作成
- GitHub.comにログイン
- 「New repository」をクリック
- リポジトリ名: `gas-document-assistant` (推奨)
- Public/Privateを選択
- 「Create repository」をクリック

### 2. プロジェクトファイルの準備
以下のファイルが保存準備完了:
```
README.md           - プロジェクト説明書
LICENSE            - MITライセンス
.env.example       - 環境変数設定例
DEPLOYMENT.md      - デプロイ手順
.gitignore         - Git除外設定
package.json       - 依存関係
client/            - フロントエンドソース
server/            - バックエンドソース
shared/            - 共通スキーマ
```

### 3. アップロード方法

#### 方法A: GitHubの「Upload files」機能
1. 新しく作成したリポジトリページで「Upload files」をクリック
2. プロジェクトフォルダを選択してドラッグ&ドロップ
3. コミットメッセージ: 「Initial commit: GAS文書アシスタント完成版」
4. 「Commit changes」をクリック

#### 方法B: Git CLIコマンド（ローカル環境）
```bash
git clone https://github.com/yourusername/gas-document-assistant.git
# プロジェクトファイルをコピー
git add .
git commit -m "Initial commit: GAS文書アシスタント完成版"
git push origin main
```

### 4. 重要な注意事項
- 環境変数（DATABASE_URL等）は含めない
- node_modules/は除外済み
- .env.exampleを参考に本番環境で設定

### 5. クローン後のセットアップ
```bash
git clone https://github.com/yourusername/gas-document-assistant.git
cd gas-document-assistant
npm install
cp .env.example .env
# .envファイルにデータベース接続情報を設定
npm run db:push
npm run dev
```