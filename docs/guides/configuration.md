---
sidebar_position: 2
---

# xrift.json 設定

プロジェクトルートの `xrift.json` でワールドの設定を行います。

## 設定例

```json
{
  "distDir": "dist",
  "buildCommand": "npm run build",
  "title": "My World",
  "description": "サンプルワールドです",
  "thumbnailPath": "thumbnail.png",
  "ignore": [
    "**/*.map",
    ".DS_Store",
    "Thumbs.db"
  ]
}
```

## 設定項目

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|:----:|------|
| `distDir` | string | ○ | アップロードするビルド成果物のディレクトリ |
| `buildCommand` | string | | アップロード前に実行するビルドコマンド |
| `title` | string | | ワールドのタイトル |
| `description` | string | | ワールドの説明 |
| `thumbnailPath` | string | | サムネイル画像のパス（`distDir` からの相対パス） |
| `ignore` | string[] | | アップロードから除外するファイルの glob パターン |

## 各項目の詳細

### distDir

アップロード対象のディレクトリを指定します。通常は `dist` です。

```json
{
  "distDir": "dist"
}
```

### buildCommand

`xrift upload world` 実行時に、アップロード前に自動実行されるコマンドです。

```json
{
  "buildCommand": "npm run build"
}
```

これを設定しておくと、手動でビルドする必要がなくなります。

### title / description

ワールドのタイトルと説明を設定します。

```json
{
  "title": "My Awesome World",
  "description": "インタラクティブな3Dワールドです"
}
```

### thumbnailPath

ワールドのサムネイル画像を指定します。`distDir` からの相対パスで指定します。

```json
{
  "distDir": "dist",
  "thumbnailPath": "thumbnail.png"
}
```

この場合、`dist/thumbnail.png` がサムネイルとして使用されます。

### ignore

アップロードから除外するファイルを glob パターンで指定します。

```json
{
  "ignore": [
    "**/*.map",
    "**/*.d.ts",
    ".DS_Store",
    "Thumbs.db"
  ]
}
```
