---
sidebar_position: 1
---

# CLI 概要

xrift-cli は、XRift ワールドプロジェクトを管理するためのコマンドラインツールです。

## 機能

- 新しいワールドプロジェクトの作成
- XRift プラットフォームへのワールドのアップロード
- ユーザー認証の管理

## インストール

```bash
npm install -g @xrift/cli
```

## 基本的な使い方

```bash
# ヘルプを表示
xrift --help

# バージョンを表示
xrift --version

# ログイン（ブラウザ認証）
xrift login

# 現在のユーザーを確認
xrift whoami

# 新しいプロジェクトを作成
xrift create <project-name>

# ワールドをアップロード
xrift upload world
```

詳細は [コマンドリファレンス](/cli/commands) を参照してください。

## リポジトリ

- [GitHub: xrift-cli](https://github.com/WebXR-JP/xrift-cli)
