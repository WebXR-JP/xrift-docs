---
sidebar_position: 2
---

# API リファレンス

`@xrift/sdk` の全 API リファレンスです。

## XriftClient

SDK のエントリーポイント。ワールド API とアイテム API をまとめて提供します。

```typescript
import { XriftClient } from '@xrift/sdk';

const client = new XriftClient({
  token: 'your-api-token',
  baseUrl: 'https://api.xrift.net', // オプション
  timeout: 30000,                    // オプション (ms)
});
```

### コンストラクタ

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `token` | `string` | はい | - | API 認証トークン |
| `baseUrl` | `string` | いいえ | `https://api.xrift.net` | API ベース URL |
| `timeout` | `number` | いいえ | `30000` | リクエストタイムアウト (ms) |

### プロパティ

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `worlds` | `WorldsApi` | ワールド操作 API |
| `items` | `ItemsApi` | アイテム操作 API |

---

## WorldsApi

ワールドの作成・アップロードを行う API です。`client.worlds` からアクセスします。

### `upload(files, options)`

ワールドアップロードの統合メソッド。作成→ハッシュ計算→URL 取得→アップロード→完了通知を一括で実行します。

```typescript
const result = await client.worlds.upload(files, options);
```

**パラメータ:**

| 名前 | 型 | 説明 |
|------|-----|------|
| `files` | `UploadFile[]` | アップロードするファイルの配列 |
| `options` | `WorldUploadOptions` | アップロードオプション |

**WorldUploadOptions:**

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `worldId` | `string` | いいえ | 既存ワールドの ID（省略時は新規作成） |
| `name` | `string` | はい | ワールド名 |
| `description` | `string` | いいえ | 説明 |
| `thumbnailPath` | `string` | いいえ | サムネイルのパス |
| `physics` | `PhysicsConfig` | いいえ | 物理設定 |
| `camera` | `CameraConfig` | いいえ | カメラ設定 |
| `permissions` | `WorldPermissions` | いいえ | 権限設定 |
| `outputBufferType` | `OutputBufferType` | いいえ | 出力バッファ型 |
| `onProgress` | `(progress: UploadProgress) => void` | いいえ | 進捗コールバック |

**戻り値: `WorldUploadResult`**

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `worldId` | `string` | ワールド ID |
| `versionId` | `string` | バージョン ID |
| `versionNumber` | `number` | バージョン番号 |
| `contentHash` | `string` | コンテンツハッシュ |
| `files` | `UploadFile[]` | アップロードしたファイル |

---

## ItemsApi

アイテムの作成・アップロードを行う API です。`client.items` からアクセスします。

### `upload(files, options)`

アイテムアップロードの統合メソッド。

```typescript
const result = await client.items.upload(files, options);
```

**ItemUploadOptions:**

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `itemId` | `string` | いいえ | 既存アイテムの ID（省略時は新規作成） |
| `name` | `string` | はい | アイテム名 |
| `description` | `string` | いいえ | 説明 |
| `thumbnailPath` | `string` | いいえ | サムネイルのパス |
| `permissions` | `ItemPermissions` | いいえ | 権限設定 |
| `onProgress` | `(progress: UploadProgress) => void` | いいえ | 進捗コールバック |

**戻り値: `ItemUploadResult`**

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `itemId` | `string` | アイテム ID |
| `versionId` | `string` | バージョン ID |
| `versionNumber` | `number` | バージョン番号 |
| `contentHash` | `string` | コンテンツハッシュ |
| `files` | `UploadFile[]` | アップロードしたファイル |

---

## エラークラス

SDK は以下のエラー階層を提供します。

```
XriftSdkError (基底クラス)
├── XriftApiError (API エラー)
│   └── XriftAuthError (認証エラー: 401)
└── XriftNetworkError (ネットワークエラー)
```

### XriftApiError

API がエラーレスポンスを返した場合にスローされます。

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `message` | `string` | エラーメッセージ |
| `statusCode` | `number` | HTTP ステータスコード |
| `responseBody` | `unknown` | レスポンスボディ |

### XriftAuthError

認証に失敗した場合（HTTP 401）にスローされます。`XriftApiError` を継承しています。

### XriftNetworkError

ネットワーク接続エラーの場合にスローされます。

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `message` | `string` | エラーメッセージ |
| `cause` | `Error` | 原因となったエラー |

### エラーハンドリング例

```typescript
import {
  XriftAuthError,
  XriftApiError,
  XriftNetworkError,
} from '@xrift/sdk';

try {
  await client.worlds.upload(files, options);
} catch (error) {
  if (error instanceof XriftAuthError) {
    console.error('認証エラー: トークンを確認してください');
  } else if (error instanceof XriftApiError) {
    console.error(`API エラー (${error.statusCode}): ${error.message}`);
  } else if (error instanceof XriftNetworkError) {
    console.error('ネットワークエラー:', error.message);
  }
}
```

---

## ユーティリティ

### `calculateContentHash(files, configValues?)`

ファイルと設定値から SHA-256 ベースのコンテンツハッシュ（先頭 12 文字）を計算します。Node.js では `node:crypto`、ブラウザでは Web Crypto API を自動的に使い分けます。

```typescript
import { calculateContentHash } from '@xrift/sdk';

const hash = await calculateContentHash(
  [{ remotePath: 'scene.glb', data: fileData }],
  { physics: { gravity: -9.8 } },
);
```

### `getMimeType(filePath)`

ファイルパスの拡張子から MIME タイプを判定します。

```typescript
import { getMimeType } from '@xrift/sdk';

getMimeType('scene.glb');    // 'model/gltf-binary'
getMimeType('texture.png');  // 'image/png'
getMimeType('unknown.xyz');  // 'application/octet-stream'
```

対応する拡張子: `.glb`, `.gltf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.json`, `.js`, `.mjs`, `.html`, `.css`, `.txt`, `.bin`, `.wasm`, `.svg`, `.mp3`, `.ogg`, `.wav`, `.mp4`, `.webm`, `.ktx2`, `.basis`, `.hdr`, `.exr`

---

## 型定義

### 共通型

| 型名 | 説明 |
|------|------|
| `FileData` | `ArrayBuffer \| Uint8Array` — ファイルのバイナリデータ |
| `UploadFile` | アップロードファイル（remotePath, size, contentType, data） |
| `UploadProgress` | 進捗情報（completed, total, currentFile） |
| `PhysicsConfig` | 物理設定（gravity, allowInfiniteJump） |
| `CameraConfig` | カメラ設定（near, far） |
| `OutputBufferType` | `'UnsignedByteType' \| 'HalfFloatType' \| 'FloatType'` |
| `SignedUrlResponse` | 署名付き URL レスポンス |

### ワールド型

| 型名 | 説明 |
|------|------|
| `WorldPermissions` | 権限設定（allowedDomains, allowedCodeRules） |
| `WorldUploadOptions` | アップロードオプション |
| `WorldUploadResult` | アップロード結果 |

### アイテム型

| 型名 | 説明 |
|------|------|
| `ItemPermissions` | 権限設定（allowedDomains, allowedCodeRules） |
| `ItemUploadOptions` | アップロードオプション |
| `ItemUploadResult` | アップロード結果 |
