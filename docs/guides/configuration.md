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
    ],
    "camera": {
      "near": 0.1,
      "far": 1000
    },
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
| `title` | string | ワールドのタイトル（未設定の場合、アップロード時に入力） |
| `description` | string | ワールドの説明（未設定の場合、アップロード時に入力） |
| `thumbnailPath` | string | サムネイル画像のパス（`distDir` からの相対パス） |
| `buildCommand` | string | アップロード前に実行するビルドコマンド |
| `ignore` | string[] | アップロードから除外するファイルの glob パターン |
| `physics` | object | ワールドの物理設定 |
| `camera` | object | ワールドのカメラクリッピング設定 |
| `permissions` | object | ワールドが必要とする権限設定 |

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

### camera

ワールドのカメラクリッピング距離をカスタマイズできます。

| 設定 | 型 | 説明 |
|------|-----|------|
| `near` | number | ニアクリップ距離（カメラに近すぎるオブジェクトを非表示にする距離） |
| `far` | number | ファークリップ距離（カメラから遠すぎるオブジェクトを非表示にする距離） |

#### 基本設定

```json
{
  "world": {
    "camera": {
      "near": 0.1,
      "far": 1000
    }
  }
}
```

#### 広大なワールド（遠くまで描画）

```json
{
  "world": {
    "camera": {
      "far": 5000
    }
  }
}
```

#### 精密なワールド（近距離の描画精度を上げる）

```json
{
  "world": {
    "camera": {
      "near": 0.01
    }
  }
}
```

### permissions

ワールドが必要とする権限を宣言します。ここで宣言された権限は、ユーザーがインスタンスに入室する際に承認画面として表示されます。

| 設定 | 型 | 説明 |
|------|-----|------|
| `allowedDomains` | string[] | ワールドが通信する外部ドメインのリスト |
| `allowedCodeRules` | string[] | 緩和が必要なコードセキュリティルールのリスト |

#### 基本設定

```json
{
  "world": {
    "permissions": {
      "allowedDomains": ["api.example.com", "cdn.example.com"],
      "allowedCodeRules": ["no-storage-access", "no-network-without-permission"]
    }
  }
}
```

#### allowedDomains

ワールドのコードが通信する外部ドメインを指定します。`@xrift/code-security` のコード解析により、許可されていないドメインへの通信は検出・ブロックされます。

#### allowedCodeRules

`@xrift/code-security` で定義されているコードセキュリティルールの緩和を宣言します。デフォルトでは安全でない操作（eval、外部通信、ストレージアクセスなど）はブロックされますが、ワールドの機能上必要な場合にここで緩和を宣言します。

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
