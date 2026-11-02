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
      "allowedCodeRules": ["no-network-without-permission"]
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
      "allowedCodeRules": ["no-navigator-access", "no-network-without-permission"]
    }
  }
}
```

#### allowedDomains

アイテムのコードが通信する外部ドメインを指定します。`@xrift/code-security` のコード解析により、許可されていないドメインへの通信は検出・ブロックされます。

#### allowedCodeRules

`@xrift/code-security` のコード検査で止められるルールのうち、アイテムの機能に必要なものを宣言して緩和します。緩和できるのは次の「緩和できるルール」だけです。

##### 緩和できるルール

| ルール | 緩和される内容 |
|--------|------|
| `no-new-function` | `Function` コンストラクタによるコードの動的生成 |
| `no-string-timeout` | `setTimeout` / `setInterval` への文字列引数 |
| `no-javascript-blob` | JavaScript の Blob を使ったスクリプトの動的生成 |
| `no-obfuscation` | 難読化されたコードパターン |
| `no-network-without-permission` | 接続先をコードから読み取れない fetch や WebSocket 等の通信（接続先が文字列で書かれている通信は `allowedDomains` で照合されます） |
| `no-rtc-connection` | WebRTC（`RTCPeerConnection`）による接続（[下記](#webrtc-を使う)） |
| `no-dangerous-dom` | innerHTML やスクリプト要素の挿入 |
| `no-navigator-access` | 位置情報・カメラ・マイク・クリップボード等へのアクセス |
| `no-global-override` | window / document 等のグローバルオブジェクトの書き換え |

##### 緩和できないルール

次のルールは `allowedCodeRules` に書いても緩和されず、違反があるとアップロードが通りません。

| ルール | 禁止される内容 |
|--------|------|
| `no-eval` | `eval()` による文字列のコード実行 |
| `no-external-import` | 外部 URL からの JavaScript モジュール読み込み |
| `no-storage-access` | localStorage / sessionStorage へのアクセス |
| `no-cookie-access` | Cookie の読み書き |
| `no-indexeddb-access` | IndexedDB へのアクセス |
| `no-storage-event` | 他タブのストレージ変更イベントの監視 |
| `no-sensitive-api-override` | fetch 等のセキュリティ上重要な API の書き換え |
| `no-prototype-pollution` | 組み込みオブジェクトのプロトタイプ変更 |

`allowedDomains` に無い接続先への通信（`no-unauthorized-domain`）も、ルールの緩和では許可できません。接続先を `allowedDomains` に足してください。

##### WebRTC を使う

`RTCPeerConnection` を使うには `no-rtc-connection` の宣言が要ります。WebRTC では接続相手に IP アドレスが伝わるため、インスタンスでアイテムを動かす前の確認ダイアログで「WebRTC 接続」として同意を取ります。

```json
{
  "item": {
    "permissions": {
      "allowedDomains": ["stun.l.google.com"],
      "allowedCodeRules": ["no-rtc-connection"]
    }
  }
}
```

- `iceServers` に書いた STUN / TURN サーバーのホストは `allowedDomains` と照合されます。ライブラリが既定で使う STUN / TURN サーバーも同じなので、そのホストも書いてください
- `iceServers` を変数や API の応答から渡すと接続先を確かめられないため、`no-network-without-permission` の宣言も要ります
