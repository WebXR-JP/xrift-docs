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

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `distDir` | string | アップロードするビルド成果物のディレクトリ |
| `title` | string | ワールドのタイトル（未設定の場合、アップロード時に入力） |
| `description` | string | ワールドの説明（未設定の場合、アップロード時に入力） |
| `thumbnailPath` | string | サムネイル画像のパス（`distDir` からの相対パス） |
| `buildCommand` | string | アップロード前に実行するビルドコマンド |
| `ignore` | string[] | アップロードから除外するファイルの glob パターン |
| `physics` | object | ワールドの物理設定 |

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

**推奨サイズ**: 1280x720 ピクセル

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

### physics

ワールドの物理動作をカスタマイズできます。

| 設定 | 型 | デフォルト | 説明 |
|------|-----|---------|------|
| `gravity` | number | 9.81 | 重力の強さ（正の値、地球=9.81、月=1.62） |
| `allowInfiniteJump` | boolean | true | 無限ジャンプを許可するか |

#### 基本設定

```json
{
  "world": {
    "physics": {
      "gravity": 9.81,
      "allowInfiniteJump": true
    }
  }
}
```

#### アスレチックワールド（無限ジャンプ禁止）

```json
{
  "world": {
    "physics": {
      "allowInfiniteJump": false
    }
  }
}
```

#### 低重力ワールド（月の重力）

```json
{
  "world": {
    "physics": {
      "gravity": 1.62
    }
  }
}
```

#### 高重力ワールド（木星の重力）

```json
{
  "world": {
    "physics": {
      "gravity": 24.79
    }
  }
}
```
