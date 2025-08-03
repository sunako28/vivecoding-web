# Notion API スクリプト

このフォルダにはNotion APIを使用してコンテンツを取得するスクリプトが含まれています。

## セットアップ

1. 依存関係をインストール：
```bash
cd scripts
npm install
```

2. 環境変数を設定：
```bash
export NOTION_API_KEY="your_notion_api_key_here"
```

または `.env` ファイルを作成：
```
NOTION_API_KEY=your_notion_api_key_here
```

## スクリプト

### notion-reader.js
- 全てのNotionページを一覧表示
- 最初のページの内容を表示

### read-miibo-page.js
- 特定のmiiboページの詳細内容を取得
- 構造化されたデータとして出力

## 使用方法

```bash
# 全ページ一覧
node notion-reader.js

# miiboページ詳細
node read-miibo-page.js
```

## セキュリティ

- APIキーは環境変数で管理
- `.env`ファイルは`.gitignore`で除外
- 本番環境では適切な権限設定を行ってください