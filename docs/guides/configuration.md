---
sidebar_position: 2
---

# xrift.json 設定

プロジェクトルートの `xrift.json` でワールドの設定を行います。

## 設定例

```json
{
  "world": {
    "distDir": "./dist",
    "title": "My World",
    "description": "サンプルワールドです",
    "thumbnailPath": "thumbnail.png",
    "buildCommand": "npm run build",
    "ignore": [
      "**/.DS_Store",
      "**/Thumbs.db",
      "**/*.map"
    ]
  }
}
```

## 設定項目

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|:----:|------|
| `distDir` | string | ○ | アップロードするビルド成果物のディレクトリ |
| `title` | string | | ワールドのタイトル（未設定の場合、アップロード時に入力） |
| `description` | string | | ワールドの説明（未設定の場合、アップロード時に入力） |
| `thumbnailPath` | string | | サムネイル画像のパス（`distDir` からの相対パス） |
| `buildCommand` | string | | アップロード前に実行するビルドコマンド |
| `ignore` | string[] | | アップロードから除外するファイルの glob パターン |

## 各項目の詳細

### distDir

アップロード対象のディレクトリを指定します。

```json
{
  "world": {
    "distDir": "./dist"
  }
}
```

### title / description

ワールドのタイトルと説明を設定します。これらはオプショナルですが、設定しておくと `xrift upload world` 実行時のプロンプトでデフォルト値として使用されます。

```json
{
  "world": {
    "title": "My Awesome World",
    "description": "インタラクティブな3Dワールドです"
  }
}
```

### thumbnailPath

ワールドのサムネイル画像を指定します。`distDir` からの相対パスで指定します。

```json
{
  "world": {
    "distDir": "./dist",
    "thumbnailPath": "thumbnail.png"
  }
}
```

この場合、`dist/thumbnail.png` がサムネイルとして使用されます。

### buildCommand

`xrift upload world` 実行時に、アップロード前に自動実行されるコマンドです。

```json
{
  "world": {
    "buildCommand": "npm run build"
  }
}
```

これを設定しておくと、手動でビルドする必要がなくなります。

### ignore

アップロードから除外するファイルを glob パターンで指定します。

```json
{
  "world": {
    "ignore": [
      "**/.DS_Store",
      "**/Thumbs.db",
      "**/*.map"
    ]
  }
}
```
