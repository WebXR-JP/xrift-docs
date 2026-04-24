---
sidebar_position: 2
---

# xrift.json 設定

プロジェクトルートの `xrift.json` でアイテムの設定を行います。ワールドと同じファイルを使用しますが、`item` キー配下に設定します。

## 設定例

```json
{
  "item": {
    "distDir": "./dist",
    "title": "My Item",
    "description": "サンプルアイテムです",
    "thumbnailPath": "thumbnail.png",
    "buildCommand": "npm run build",
    "ignore": [
      "**/.DS_Store",
      "**/Thumbs.db",
      "**/*.map"
    ],
    "permissions": {
      "allowedDomains": ["api.example.com"],
      "allowedCodeRules": ["no-storage-access"]
    }
  }
}
```

## 設定項目

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `distDir` | string | アップロードするビルド成果物のディレクトリ |
| `title` | string | アイテムのタイトル（未設定の場合、アップロード時に入力） |
| `description` | string | アイテムの説明（未設定の場合、アップロード時に入力） |
| `thumbnailPath` | string | サムネイル画像のパス（`distDir` からの相対パス） |
| `buildCommand` | string | アップロード前に実行するビルドコマンド |
| `ignore` | string[] | アップロードから除外するファイルの glob パターン |
| `permissions` | object | アイテムが必要とする権限設定 |

:::info ワールド設定との違い
アイテムの設定はワールドと共通の項目を使いますが、`physics` / `camera` / `outputBufferType` は**ワールド専用**の設定です。アイテムではこれらは使用しません。
:::

## 各項目の詳細

### distDir

アップロード対象のディレクトリを指定します。Module Federation の `remoteEntry.js` を含むビルド出力ディレクトリです。

```json
{
  "item": {
    "distDir": "./dist"
  }
}
```

### title / description

アイテムのタイトルと説明を設定します。これらはオプショナルですが、設定しておくと `xrift upload item` 実行時のプロンプトをスキップできます。

```json
{
  "item": {
    "title": "My Awesome Item",
    "description": "インタラクティブな 3D アイテムです"
  }
}
```

### thumbnailPath

アイテムのサムネイル画像を指定します。`distDir` からの相対パスで指定します。

```json
{
  "item": {
    "distDir": "./dist",
    "thumbnailPath": "thumbnail.png"
  }
}
```

この場合、`dist/thumbnail.png` がサムネイルとして使用されます。

**推奨サイズ**: 512x512 ピクセル

### buildCommand

`xrift upload item` 実行時に、アップロード前に自動実行されるコマンドです。

```json
{
  "item": {
    "buildCommand": "npm run build"
  }
}
```

これを設定しておくと、手動でビルドする必要がなくなります。

### ignore

アップロードから除外するファイルを glob パターンで指定します。

```json
{
  "item": {
    "ignore": [
      "**/.DS_Store",
      "**/Thumbs.db",
      "**/*.map"
    ]
  }
}
```

### permissions

アイテムが必要とする権限を宣言します。ここで宣言された権限は、アイテムの審査時に考慮され、アイテムをワールド内で使用する際にも適用されます。

| 設定 | 型 | 説明 |
|------|-----|------|
| `allowedDomains` | string[] | アイテムが通信する外部ドメインのリスト |
| `allowedCodeRules` | string[] | 緩和が必要なコードセキュリティルールのリスト |

#### 基本設定

```json
{
  "item": {
    "permissions": {
      "allowedDomains": ["api.example.com", "cdn.example.com"],
      "allowedCodeRules": ["no-storage-access", "no-network-without-permission"]
    }
  }
}
```

#### allowedDomains

アイテムのコードが通信する外部ドメインを指定します。`@xrift/code-security` のコード解析により、許可されていないドメインへの通信は検出・ブロックされます。

#### allowedCodeRules

`@xrift/code-security` で定義されているコードセキュリティルールの緩和を宣言します。デフォルトでは安全でない操作（eval、外部通信、ストレージアクセスなど）はブロックされますが、アイテムの機能上必要な場合にここで緩和を宣言します。

##### 動的コード実行

| ルール | 説明 |
|--------|------|
| `no-eval` | `eval()` による文字列のコード実行を許可 |
| `no-new-function` | `Function` コンストラクタによるコード動的生成を許可 |
| `no-string-timeout` | `setTimeout`/`setInterval` への文字列引数を許可 |
| `no-javascript-blob` | JavaScript Blob を使ったスクリプト動的生成を許可 |

##### 難読化

| ルール | 説明 |
|--------|------|
| `no-obfuscation` | 難読化されたコードパターンを許可 |

##### ネットワーク通信

| ルール | 説明 |
|--------|------|
| `no-network-without-permission` | fetch や WebSocket 等のネットワーク通信を許可 |
| `no-unauthorized-domain` | `allowedDomains` に含まれないドメインへの接続を許可 |
| `no-rtc-connection` | WebRTC ピア接続を許可 |
| `no-external-import` | 外部 URL からの JavaScript モジュール読み込みを許可 |

##### ストレージ・データ

| ルール | 説明 |
|--------|------|
| `no-storage-access` | localStorage / sessionStorage へのアクセスを許可 |
| `no-cookie-access` | Cookie の読み書きを許可 |
| `no-indexeddb-access` | IndexedDB へのアクセスを許可 |
| `no-storage-event` | 他タブのストレージ変更イベントの監視を許可 |

##### DOM 操作

| ルール | 説明 |
|--------|------|
| `no-dangerous-dom` | innerHTML やスクリプト要素の挿入を許可 |

##### ブラウザ API

| ルール | 説明 |
|--------|------|
| `no-navigator-access` | 位置情報・カメラ・マイク・クリップボード等へのアクセスを許可 |

##### グローバル汚染

| ルール | 説明 |
|--------|------|
| `no-sensitive-api-override` | fetch 等のセキュリティ上重要な API の書き換えを許可 |
| `no-global-override` | window / document 等のグローバルオブジェクトの書き換えを許可 |
| `no-prototype-pollution` | 組み込みオブジェクトのプロトタイプ変更を許可 |
