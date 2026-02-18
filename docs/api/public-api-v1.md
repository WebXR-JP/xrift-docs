---
sidebar_position: 1
---

# Public API v1

外部開発者が API キーを使って XRift のデータにアクセスするための Public API リファレンスです。

## 認証

2 種類の認証方式をサポートしています。

| 認証方式 | ヘッダー | 用途 |
|---|---|---|
| API キー | `Authorization: Bearer xrift_sk_xxx` | サードパーティ開発者向け（スコープ + レート制限あり） |
| CLI トークン | `Authorization: Bearer xrf_xxx` | CLI / 内部ツール向け（全権限、レート制限なし） |

### リクエスト例

```bash
curl -H "Authorization: Bearer xrift_sk_xxx" \
  https://api.xrift.net/api/public/v1/worlds
```

## エンドポイント一覧

**ベース URL**: `https://api.xrift.net/api/public/v1`

| メソッド | パス | スコープ | 説明 |
|---|---|---|---|
| GET | `/worlds` | `read:worlds` | ワールド一覧（ページネーション付き） |
| GET | `/worlds/search?q=xxx` | `read:worlds` | ワールド検索 |
| GET | `/worlds/:id` | `read:worlds` | ワールド詳細 |
| GET | `/users/:id` | `read:users` | ユーザー公開プロフィール |
| GET | `/instances` | `read:instances` | インスタンス一覧（ページネーション付き） |
| GET | `/instances/:id` | `read:instances` | インスタンス詳細 |

## クエリパラメータ

一覧系エンドポイントでは以下のクエリパラメータが使用できます。

| パラメータ | 型 | デフォルト | 説明 |
|---|---|---|---|
| `limit` | number | 20 | 取得件数（最大 50） |
| `offset` | number | 0 | オフセット |
| `worldId` | string | - | インスタンス一覧のワールドフィルター |

### リクエスト例

```bash
# ワールド一覧を10件取得
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/worlds?limit=10&offset=0"

# ワールド検索
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/worlds/search?q=tokyo"

# 特定ワールドのインスタンス一覧
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/instances?worldId=xxx"
```

## レスポンス形式

### 一覧

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### 詳細

```json
{
  "data": {
    "id": "xxx",
    ...
  }
}
```

### エラー

```json
{
  "error": "エラーメッセージ"
}
```

## HTTP ステータスコード

| コード | 意味 |
|---|---|
| 200 | 成功 |
| 400 | リクエスト不正 |
| 401 | 認証失敗 |
| 403 | スコープ不足 |
| 404 | リソース未発見 |
| 429 | レート制限超過 |

## レート制限

- 1 時間あたり **1,000 リクエスト**（デフォルト）
- API キー認証のみ適用（CLI トークンは対象外）

レスポンスヘッダーで現在の使用状況を確認できます。

| ヘッダー | 説明 |
|---|---|
| `X-RateLimit-Limit` | 上限 |
| `X-RateLimit-Remaining` | 残り回数 |
| `X-RateLimit-Reset` | リセット時刻（Unix timestamp） |

:::caution
レート制限を超過すると `429 Too Many Requests` が返されます。`X-RateLimit-Reset` ヘッダーの時刻まで待ってからリトライしてください。
:::
