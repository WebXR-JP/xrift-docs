---
sidebar_position: 1
---

# SDK 概要

`@xrift/sdk` は、XRift プラットフォーム向けのユニバーサル SDK です。ワールドやアイテムの API 操作とファイルアップロードを、Node.js とブラウザの両環境で提供します。

## 特徴

- **ユニバーサル**: Node.js とブラウザの両方で動作
- **外部依存ゼロ**: fetch API ベースで追加パッケージ不要
- **TypeScript**: 完全な型定義付き
- **ESM + CJS**: デュアルビルド対応
- **統合アップロード**: ハッシュ計算・署名付き URL 取得・アップロード・完了通知を一括処理

## インストール

```bash
npm install @xrift/sdk
```

## 基本的な使い方

### クライアントの初期化

```typescript
import { XriftClient } from '@xrift/sdk';

const client = new XriftClient({
  token: 'your-api-token',
});
```

### ワールドのアップロード

```typescript
import { readFile } from 'node:fs/promises';
import { XriftClient, getMimeType } from '@xrift/sdk';

const client = new XriftClient({ token: 'your-api-token' });

// ファイルを読み込み
const data = new Uint8Array(await readFile('scene.glb'));

const result = await client.worlds.upload(
  [
    {
      remotePath: 'scene.glb',
      data,
      size: data.byteLength,
      contentType: getMimeType('scene.glb'),
    },
  ],
  {
    name: 'My World',
    description: 'A sample world',
  },
);

console.log(`World uploaded: ${result.worldId}`);
```

### アイテムのアップロード

```typescript
const result = await client.items.upload(
  [
    {
      remotePath: 'model.glb',
      data,
      size: data.byteLength,
      contentType: getMimeType('model.glb'),
    },
  ],
  {
    name: 'My Item',
  },
);

console.log(`Item uploaded: ${result.itemId}`);
```

### ブラウザでの使用

```typescript
// File API からデータを取得
const fileInput = document.querySelector<HTMLInputElement>('#file');
const file = fileInput.files[0];
const data = new Uint8Array(await file.arrayBuffer());

const result = await client.worlds.upload(
  [
    {
      remotePath: file.name,
      data,
      size: data.byteLength,
      contentType: file.type || getMimeType(file.name),
    },
  ],
  {
    name: 'Browser Upload World',
  },
);
```

### 進捗の追跡

```typescript
const result = await client.worlds.upload(files, {
  name: 'My World',
  onProgress: (progress) => {
    console.log(`${progress.completed}/${progress.total}: ${progress.currentFile}`);
  },
});
```

## CLI との違い

| | xrift-cli | @xrift/sdk |
|---|---|---|
| 用途 | ローカル開発・デプロイ | アプリケーション組み込み |
| 入力 | ローカルファイルパス | バイナリデータ (ArrayBuffer / Uint8Array) |
| 環境 | Node.js のみ | Node.js + ブラウザ |
| 認証 | `xrift login` で取得 | トークンを直接指定 |

## 次のステップ

- [API リファレンス](/sdk/api-reference) - 全 API の詳細仕様
- [Public API v1](/public-api/v1) - REST API 仕様
