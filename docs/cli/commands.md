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
xrift create item [name] [options]    # アイテムプロジェクトを作成
```

### オプション（`xrift create world` / `xrift create item` 共通）

| オプション | 説明 |
|-----------|------|
| `--here` | 現在のディレクトリにプロジェクトを作成 |
| `-t, --template <repository>` | 使用するテンプレートリポジトリを指定 |
| `--skip-install` | 依存関係のインストールをスキップ |
| `-y, --no-interactive` | 対話モードをスキップ（デフォルト値を使用） |

デフォルトのテンプレートはそれぞれ以下です。

| コマンド | デフォルトテンプレート |
|---------|-------------------|
| `xrift create world` | `WebXR-JP/xrift-test-world` |
| `xrift create item` | `WebXR-JP/xrift-item-template` |

### 例

```bash
# 対話形式で種類を選択してプロジェクトを作成
xrift create

# ワールドプロジェクトを対話形式で作成
xrift create world my-world

# アイテムプロジェクトを対話形式で作成
xrift create item my-item

# 対話なしでプロジェクトを作成
xrift create world my-world -y

# 現在のディレクトリに作成
xrift create item --here
```

## デプロイ

### xrift upload

`xrift.json` の内容からプロジェクト種別を自動判定してアップロードします。サブコマンドで明示的に指定することも可能です。

```bash
xrift upload                # xrift.json から種別を自動判定
xrift upload world          # ワールドをアップロード
xrift upload item           # アイテムをアップロード
```

### オプション

| オプション | 説明 |
|-----------|------|
| `--skip-check` | アップロード前のセキュリティチェックをスキップ |

### xrift upload world

ワールドを XRift プラットフォームにアップロードします。

```bash
xrift upload world
```

アップロード前に、`xrift.json` で定義されたビルドスクリプトが自動的に実行されます。新規ワールドの場合は、タイトルや説明などのメタデータの入力を求められます。

アップロード後、コードの審査が自動的に行われます（通常数分で完了します）。審査に通過するとワールドが公開されます。審査に落ちた場合、ワールドは公開されず、最後に審査を通過したバージョンが公開された状態のままとなります。

### xrift upload item

アイテムを XRift プラットフォームにアップロードします。

```bash
xrift upload item
```

アップロード前に、`xrift.json` で定義された `item.buildCommand` が自動的に実行されます。新規アイテムの場合は、タイトル（必須）と説明（任意）の入力を求められます。

アップロード後、コードの審査が自動的に行われます。審査に通過するとアイテムが公開され、インベントリから各ワールドで使用できるようになります。

## セキュリティチェック

### xrift check

ビルド成果物に対してコードセキュリティチェックを実行します。`xrift.json` の内容からプロジェクト種別を自動判定します。

```bash
xrift check                 # xrift.json から種別を自動判定
xrift check world           # ワールドのビルド成果物をチェック
xrift check item            # アイテムのビルド成果物をチェック
```

### オプション

| オプション | 説明 |
|-----------|------|
| `--build` | チェック前にビルドコマンドを実行 |
| `--ignore-warnings` | 警告（REVIEW）を無視し、REJECT のみで失敗扱いにする |
| `--json` | 結果を JSON 形式で出力 |

### 例

```bash
# ビルドと合わせてチェックを実行
xrift check --build

# CI で使いやすい JSON 出力
xrift check item --json

# 警告は通して、重大な違反のみで失敗させる
xrift check world --ignore-warnings
```

チェック結果は APPROVE / REVIEW / REJECT の 3 段階で分類され、REJECT があると終了コード 1 で終了します。

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
