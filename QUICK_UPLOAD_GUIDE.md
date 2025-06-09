# GitHubクイックアップロードガイド

## 1分でGitHubに保存する手順

### 手順1: GitHubで新しいリポジトリ作成
1. GitHub.comにアクセス
2. 「New repository」をクリック
3. Repository name: `gas-document-assistant`
4. 「Create repository」をクリック

### 手順2: ファイルアップロード
1. 新しく作成したリポジトリページで「uploading an existing file」をクリック
2. 以下のファイル/フォルダをドラッグ&ドロップ：

**必須ファイル:**
- README.md
- package.json
- client/ (フォルダ全体)
- server/ (フォルダ全体)  
- shared/ (フォルダ全体)
- .env.example
- LICENSE
- components.json
- tailwind.config.ts
- vite.config.ts
- drizzle.config.ts

**コミットメッセージ:** 
```
Initial commit: GAS文書アシスタント完成版

- PostgreSQL対応の業務自動化ツール
- React + TypeScript フロントエンド
- Express + Drizzle ORM バックエンド
- GASコード自動生成機能
- 文書テンプレート管理
- 履歴機能付き
```

### 完了
これでプロジェクトがGitHubに保存され、他の開発者がクローンして利用できます。