---
sidebar_position: 2
---

# クイックスタート

XRift CLI を使ってワールドプロジェクトを作成し、開発サーバーを起動するまでの手順です。

## 新しいプロジェクトの作成

```bash
xrift create my-world
```

対話形式でプロジェクト名などを設定します。`-y` オプションで対話をスキップできます。

## プロジェクト構成

作成されたプロジェクトには、すでにサンプルワールドが含まれています：

```
my-world/
├── src/
│   ├── World.tsx        # メインのワールドコンポーネント
│   └── components/      # サンプルコンポーネント
├── public/              # アセット（モデル、テクスチャなど）
├── package.json
└── vite.config.ts
```

## 開発サーバーの起動

```bash
cd my-world
npm run dev
```

ブラウザで `http://localhost:5173` を開くと、サンプルワールドが表示されます。

## 次のステップ

- [最初のワールドを作成する](/guides/create-first-world) でカスタマイズ方法を学ぶ
- [World Components](/world-components/overview) でコンポーネントの使い方を学ぶ
- [CLI コマンドリファレンス](/cli/commands) で利用可能なコマンドを確認
