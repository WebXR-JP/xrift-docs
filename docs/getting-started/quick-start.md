---
sidebar_position: 2
---

# クイックスタート

このガイドでは、XRift を使って最初の WebXR ワールドを作成します。

## 新しいプロジェクトの作成

以下のコマンドで新しいワールドプロジェクトを作成します：

```bash
xrift create my-world
```

対話形式でプロジェクトの設定を行います。

## プロジェクト構成

作成されたプロジェクトは以下のような構成になっています：

```
my-world/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── components/
├── public/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 開発サーバーの起動

プロジェクトディレクトリに移動し、開発サーバーを起動します：

```bash
cd my-world
npm run dev
```

ブラウザで `http://localhost:5173` を開くと、作成したワールドが表示されます。

## 次のステップ

- [最初のワールドを作成する](/guides/create-first-world) チュートリアルに挑戦
- [World Components](/world-components/overview) でコンポーネントの使い方を学ぶ
- [CLI コマンドリファレンス](/cli/commands) で利用可能なコマンドを確認
