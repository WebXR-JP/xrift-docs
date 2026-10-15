---
sidebar_position: 3
---

# AI エージェントでワールドを作る

Claude Code や Cursor などの AI コーディングエージェントで XRift のワールド・アイテムを開発する場合は、[xrift-skills](https://github.com/WebXR-JP/xrift-skills) を導入してください。XRift 固有の API やルールをエージェントに教える [Agent Skills](https://github.com/vercel-labs/skills) で、導入するとエージェントが `@xrift/world-components` や `@xrift/sdk` を正しく使えるようになります。

## インストール

プロジェクトのディレクトリで次のコマンドを実行します。

```bash
npx skills add WebXR-JP/xrift-skills
```

対応エージェント: Claude Code, Cursor, Copilot, Codex など 40 以上。

:::tip
`xrift create world` で作成したプロジェクト（[xrift-world-template](https://github.com/WebXR-JP/xrift-world-template)）には、ワールド制作用のスキル `xrift-world` があらかじめ同梱されています。
:::

## 含まれるスキル

### xrift-world

XRift プラットフォーム用 WebXR ワールド制作ガイド。

- 最重要ルール、プロジェクト概要、設定、コマンド、トラブルシューティング
- `@xrift/world-components` のフック・コンポーネント・定数の全仕様
- GLB モデル、テクスチャ、Skybox、インタラクションなどのコードテンプレート
- `User`、`PlayerMovement`、`VRTrackingData` などの型定義

### xrift-sdk

`@xrift/sdk` でワールド・アイテムをプログラムからアップロードするためのガイド。

- `XriftClient` の初期化、アップロードの流れ、エラー処理
- `XriftClient`、`WorldsApi`、`ItemsApi`、エラークラス、ユーティリティの全仕様
- Node.js・ブラウザ環境それぞれのコード例
- SDK の全インターフェースの型定義

## 更新

インストール済みのスキルを最新版に更新するには、次のコマンドを実行します。

```bash
npx skills update
```

`@xrift/world-components` や `@xrift/sdk` のバージョンを上げたときは、スキルも合わせて更新してください。

## 参考リンク

- [xrift-skills (GitHub)](https://github.com/WebXR-JP/xrift-skills)
- [Agent Skills](https://github.com/vercel-labs/skills)
