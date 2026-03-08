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

新しいプロジェクトを作成します。サブコマンドなしで実行すると、対話型で作成するプロジェクトの種類を選択できます。

```bash
xrift create                          # 対話型で種類を選択
xrift create world [name] [options]   # ワールドプロジェクトを作成
```

### オプション（`xrift create world`）

| オプション | 説明 |
|-----------|------|
| `--here` | 現在のディレクトリにプロジェクトを作成 |
| `--template <name>` | 使用するテンプレートを指定 |
| `--skip-install` | 依存関係のインストールをスキップ |
| `-y, --no-interactive` | 対話モードをスキップ（デフォルト値を使用） |

### 例

```bash
# 対話形式で種類を選択してプロジェクトを作成
xrift create

# ワールドプロジェクトを対話形式で作成
xrift create world my-world

# 対話なしでプロジェクトを作成
xrift create world my-world -y

# 現在のディレクトリに作成
xrift create world --here
```

## デプロイ

### xrift upload world

ワールドを XRift プラットフォームにアップロードします。

```bash
xrift upload world
```

アップロード前に、`xrift.json` で定義されたビルドスクリプトが自動的に実行されます。新規ワールドの場合は、タイトルや説明などのメタデータの入力を求められます。

アップロード後、コードの審査が自動的に行われます（通常数分で完了します）。審査に通過するとワールドが公開されます。審査に落ちた場合、ワールドは公開されず、最後に審査を通過したバージョンが公開された状態のままとなります。

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
