---
sidebar_position: 3
---

# 設定

xrift-cli の設定ファイルについて説明します。

## xrift.json

プロジェクトルートに `xrift.json` を配置することで、CLI の動作をカスタマイズできます。

```json
{
  "build": "npm run build",
  "outDir": "dist"
}
```

## 設定オプション

### build

- 型: `string`

`xrift upload world` 実行時に、アップロード前に実行されるビルドコマンドを指定します。

### outDir

- 型: `string`
- デフォルト: `dist`

ビルド成果物の出力ディレクトリを指定します。このディレクトリの内容がアップロードされます。

## 開発サーバー設定

開発サーバーの設定は、Vite の設定ファイル（`vite.config.ts`）で行います。

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    host: true,
  },
});
```

## 環境変数

`.env` ファイルで環境変数を設定できます。

```bash
# .env
VITE_API_URL=https://api.example.com
```

`VITE_` プレフィックスが付いた環境変数は、クライアントコードで使用できます。

```typescript
console.log(import.meta.env.VITE_API_URL);
```
