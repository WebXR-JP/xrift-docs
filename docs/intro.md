---
sidebar_position: 1
slug: /
---

# XRift とは

XRift は、WebXR を使った没入型 3D ワールドを簡単に構築するためのプラットフォームです。

## 開発できるもの

### ワールド

XRift では、独自の 3D ワールドを作成できます。React Three Fiber をベースにしたコンポーネントライブラリを使って、VR/AR 対応のインタラクティブな空間を構築できます。

- [ワールド開発を始める](/getting-started/installation)
- [World Components](/world-components/components/)

### アイテム

ワールド内に配置できる再利用可能な 3D コンポーネントを作成できます。アップロードしたアイテムはインベントリから各ワールドで使用できます。

- [最初のアイテムを作成する](/item/create-first-item)

## ツール

### xrift-cli

コマンドラインツール。プロジェクトの作成、XRift プラットフォームへのアップロードなどを行います。

- [CLI ドキュメント](/cli/overview)
- [GitHub](https://github.com/WebXR-JP/xrift-cli)

### @xrift/sdk

XRift プラットフォーム向けのユニバーサル SDK。Node.js とブラウザの両環境でワールド・アイテムの API 操作とファイルアップロードを提供します。

- [SDK ドキュメント](/sdk/overview)
- [GitHub](https://github.com/WebXR-JP/xrift-sdk)

### xrift-world-components

WebXR ワールドを構築するための React コンポーネントライブラリ。

- [コンポーネント一覧](/world-components/components/)
- [GitHub](https://github.com/WebXR-JP/xrift-world-components)

## クイックスタート

```bash
# XRift CLI をインストール
npm install -g @xrift/cli

# 新しいワールドを作成
xrift create world my-world

# プロジェクトに移動して開発サーバーを起動
cd my-world
npm run dev
```

詳細は [Getting Started](/getting-started/installation) を参照してください。
