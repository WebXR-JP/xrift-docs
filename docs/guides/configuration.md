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
    "outputBufferType": "UnsignedByteType",
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
| `title` | string | ワールドのタイトル（未設定の場合、アップロード時に入力） |
| `description` | string | ワールドの説明（未設定の場合、アップロード時に入力） |
| `thumbnailPath` | string | サムネイル画像のパス（`distDir` からの相対パス） |
| `buildCommand` | string | アップロード前に実行するビルドコマンド |
| `ignore` | string[] | アップロードから除外するファイルの glob パターン |
| `physics` | object | ワールドの物理設定 |
| `camera` | object | ワールドのカメラクリッピング設定 |
| `outputBufferType` | string | WebGLRenderer の出力バッファタイプ |
| `items` | string[] | ワールドに最初から置くアイテム（`<Item itemId>`）の id の一覧 |
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
| `allowFly` | boolean | true | 浮遊モード（フライモード）を許可するか |
| `respawnThreshold` | number | -10 | この高さ（Y 座標）を下回るとスポーン地点へ戻す |

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

#### 浮遊モードを禁止する

アスレチックや迷路など、飛んで越えられると困るワールドで使います。

```json
{
  "world": {
    "physics": {
      "allowFly": false
    }
  }
}
```

#### リスポーンする高さを変える

床が -10 より低い位置にあるワールドや、下へ落ちていく演出のあるワールドでは、リスポーンする高さを下げます。

```json
{
  "world": {
    "physics": {
      "respawnThreshold": -100
    }
  }
}
```

:::warning
`respawnThreshold` はスポーン地点より低くしてください。スポーン地点より高いと、戻った瞬間にまた下回るため、リスポーンが繰り返されて動けなくなります。
:::

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

### outputBufferType

WebGLRenderer の出力バッファタイプを指定します。ポストプロセッシングや HDR レンダリングの精度に影響します。

| 値 | 説明 |
|-----|------|
| `UnsignedByteType` | 8bit 整数（デフォルト。通常のレンダリングに適する） |
| `HalfFloatType` | 16bit 浮動小数点（HDR やポストプロセッシングに適する） |
| `FloatType` | 32bit 浮動小数点（最高精度。GPU 負荷が高い） |

```json
{
  "world": {
    "outputBufferType": "HalfFloatType"
  }
}
```

### items

ワールドに最初から置くアイテム（`<Item itemId>`）の id を宣言します。ここに書いた id だけが本番で読まれます（入室時の先読みと、訪問者側での配信 URL の解決がこの一覧から行われます）。

```json
{
  "world": {
    "items": [
      "2a69ded4-d913-4359-8c1f-eac83a982b0c",
      "a454d074-7f1c-416a-b181-19a63b79f432"
    ]
  }
}
```

- 宣言できるのは **自分が作ったアイテムか、ライブラリに入れたアイテム** だけです（マーケットで入手してください）。それ以外を書くとアップロードが失敗します
- 50 個までです
- 作者が新しい版を出すと、ワールドに置いたアイテムも自動で新しくなります
- `xrift upload` はビルド成果物の `<Item itemId>` を拾って宣言と突き合わせ、宣言に無い id があればアップロード前に止めます。`<Item>` で使っていない id が拾われた誤検知のときだけ `xrift upload --skip-item-scan` で飛ばせます
- ローカル開発（`xriftDev()`）でも宣言に無い id は本番と同じ「宣言されていない」の仮の箱になります。追記してリロードすれば効きます

アイテムの置き方は [world-components の `Item`](../world-components/components/index.md#item) を参照してください。

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
      "allowedCodeRules": ["no-navigator-access", "no-network-without-permission"]
    }
  }
}
```

#### allowedDomains

ワールドのコードが通信する外部ドメインを指定します。`@xrift/code-security` のコード解析により、許可されていないドメインへの通信は検出・ブロックされます。

#### allowedCodeRules

`@xrift/code-security` のコード検査で止められるルールのうち、ワールドの機能に必要なものを宣言して緩和します。宣言したルールは入室時の承認画面に表示され、訪問者が同意して入室します。緩和できるのは次の「緩和できるルール」だけです。

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

データを保存したいときは [`useWorldStorage`](../world-components/components/index.md#useworldstorage) を使ってください。

`allowedDomains` に無い接続先への通信（`no-unauthorized-domain`）も、ルールの緩和では許可できません。接続先を `allowedDomains` に足してください。

##### WebRTC を使う

`RTCPeerConnection` を使うには `no-rtc-connection` の宣言が要ります。WebRTC では接続相手に IP アドレスが伝わるため、入室時の承認画面で「WebRTC 接続」として訪問者の同意を取ります。

```json
{
  "world": {
    "permissions": {
      "allowedDomains": ["stun.l.google.com"],
      "allowedCodeRules": ["no-rtc-connection"]
    }
  }
}
```

- `iceServers` に書いた STUN / TURN サーバーのホストは `allowedDomains` と照合されます。ライブラリが既定で使う STUN / TURN サーバーも同じなので、そのホストも書いてください
- `iceServers` を変数や API の応答から渡すと接続先を確かめられないため、`no-network-without-permission` の宣言も要ります
