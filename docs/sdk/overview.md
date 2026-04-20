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

プロジェクトに `xrift.json` を配置し、`uploadWorldFromDirectory` を呼ぶだけでアップロードできます。

```typescript
import { uploadWorldFromDirectory } from '@xrift/sdk/node';

const result = await uploadWorldFromDirectory('./my-project', {
  token: 'your-api-token',
  onProgress: (progress) => {
    console.log(`${progress.completed}/${progress.total}: ${progress.currentFile}`);
  },
});

console.log(`World uploaded: ${result.worldId} v${result.versionNumber}`);
```

xrift.json の読み込み、distDir 内のファイル収集、ignore パターンの適用、ハッシュ計算、アップロードまですべて自動で行われます。

より細かい制御が必要な場合は、[API リファレンス](/sdk/api-reference) の `XriftClient` を使った低レベル API を参照してください。

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
