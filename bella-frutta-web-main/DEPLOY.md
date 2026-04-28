# デプロイ手順

## 前提条件

- Netlifyアカウント
- Google Cloud プロジェクト（Google Sheets API有効化済み）
- Google スプレッドシート（menuシート、calendarシート）

## 1. Google Sheets セットアップ

### Google Cloud 設定

1. https://console.cloud.google.com/ でプロジェクト作成
2. 「APIとサービス」→「ライブラリ」→ **Google Sheets API** を有効化
3. 「認証情報」→「サービスアカウント」を作成
4. サービスアカウントのJSON秘密鍵をダウンロード

### スプレッドシート設定

1. Google スプレッドシートを新規作成
2. シート名を `menu` に変更
3. 1行目にヘッダーを入力:

```
id | category | name_ja | name_en | price | description_ja | description_en | image_url | active
```

4. 2行目以降にメニューデータを入力（active列はTRUE/FALSE）
5. サービスアカウントのメールを「閲覧者」として共有

`calendar` シートも同様に作成:

```
month | fruit_ja | fruit_en | origin_ja | origin_en | note_ja | note_en
```

## 2. Netlify デプロイ

### 環境変数の設定

Netlify管理画面 → Site settings → Environment variables:

```
GOOGLE_SHEETS_SPREADSHEET_ID = スプレッドシートID
GOOGLE_SERVICE_ACCOUNT_EMAIL = サービスアカウントのメール
GOOGLE_PRIVATE_KEY = JSONの private_key の値（\nをそのまま含む文字列）
```

### Build Hook の設定（スプレッドシートからデプロイトリガー）

1. Netlify管理画面 → Build & deploy → Build hooks → 「Add build hook」
2. 名前: `Google Sheets Update`、ブランチ: `main`
3. 生成されたURLをコピー

### スプレッドシートにビルドトリガーを設定

スプレッドシートの「拡張機能」→「Apps Script」で以下を貼り付け:

```javascript
const NETLIFY_HOOK_URL = 'https://api.netlify.com/build_hooks/XXXX'; // ← 取得したURLに置き換え

function triggerNetlifyBuild() {
  UrlFetchApp.fetch(NETLIFY_HOOK_URL, { method: 'post' });
  SpreadsheetApp.getUi().alert('ビルドをトリガーしました。5〜10分後にサイトに反映されます。');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Bella Frutta')
    .addItem('サイトを更新する', 'triggerNetlifyBuild')
    .addToUi();
}
```

### より速い更新方法: ISR Revalidation API

Netlify Build Hook（フルビルド）の代わりに、ISR Revalidation APIを使うと5〜10分ではなく数秒でメニューが更新されます。

Apps ScriptのURLを以下に変更:
```
const REVALIDATE_URL = 'https://your-site.netlify.app/api/revalidate?secret=YOUR_SECRET';

function triggerRevalidate() {
  UrlFetchApp.fetch(REVALIDATE_URL, { method: 'post' });
  SpreadsheetApp.getUi().alert('メニューを更新しました（数秒で反映）');
}
```

## 3. 本番公開前チェックリスト

- [ ] 全リンク有効（Instagram・LINE・Googleマップ）
- [ ] 法人フォームURLを `web/src/lib/site-links.ts` の `corporateForm` に追加
- [ ] 営業時間・住所を `web/src/lib/site-links.ts` の `STORE_INFO` に正確な情報を入力
- [ ] スマホ表示確認
- [ ] 日英切り替え確認
- [ ] メニューがGoogle Sheetsの内容と一致
- [ ] ダミーコンテンツを実際の内容に差し替え（農家・店長紹介）
