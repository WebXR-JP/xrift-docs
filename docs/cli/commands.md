---
sidebar_position: 2
---

# コマンドリファレンス

xrift-cli で利用可能なコマンドの一覧です。

## 認証コマンド

### xrift login

ブラウザベースの認証を行います。

```bash
xrift login
```

ブラウザが開き、XRift アカウントでログインできます。

### xrift logout

現在のセッションからサインアウトします。

```bash
xrift logout
```

### xrift whoami

現在ログインしているユーザー情報を表示します。

```bash
xrift whoami
```

## プロジェクト管理

### xrift create

新しいワールドプロジェクトを作成します。

```bash
xrift create [name] [options]
```

### オプション

| オプション | 説明 |
|-----------|------|
| `--here` | 現在のディレクトリにプロジェクトを作成 |
| `--template <name>` | 使用するテンプレートを指定 |
| `--skip-install` | 依存関係のインストールをスキップ |
| `-y, --no-interactive` | 対話モードをスキップ（デフォルト値を使用） |

### 例

```bash
# 対話形式でプロジェクトを作成
xrift create my-world

# 対話なしでプロジェクトを作成
xrift create my-world -y

# 現在のディレクトリに作成
xrift create --here
```

## デプロイ

### xrift upload world

ワールドを XRift プラットフォームにアップロードします。

```bash
xrift upload world
```

アップロード前に、`xrift.json` で定義されたビルドスクリプトが自動的に実行されます。新規ワールドの場合は、タイトルや説明などのメタデータの入力を求められます。

## ユーティリティ

### --version, -v

インストールされているバージョンを表示します。

```bash
xrift --version
xrift -v
```

### --help, -h

ヘルプ情報を表示します。

```bash
xrift --help
xrift -h
```

### --verbose

詳細なデバッグ出力を表示します。

```bash
xrift --verbose <command>
```

## 開発時のコマンド

開発サーバーの起動やビルドは、プロジェクトの npm スクリプトを使用します。

```bash
# 開発サーバーを起動
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```
