---
sidebar_position: 3
---

# AI エージェントでワールドを作る

[xrift-skills](https://github.com/WebXR-JP/xrift-skills) は、AI コーディングエージェントで XRift のワールドやアイテムを制作するための [Agent Skills](https://github.com/vercel-labs/skills) です。`@xrift/world-components` の API リファレンスやコードテンプレート、型定義などをエージェントに読み込ませることで、XRift 固有のルールに沿ったコードを生成できるようになります。

対応エージェント: Claude Code, Cursor, GitHub Copilot, Codex など（40 以上）

## インストール

プロジェクトのルートで次のコマンドを実行します。

```bash
npx skills add WebXR-JP/xrift-skills
```

プロジェクト内にスキルのファイルが配置され、対応エージェントが自動的に参照するようになります。

:::tip テンプレートから始める場合
`xrift create world` で作成したプロジェクト（[xrift-world-template](https://github.com/WebXR-JP/xrift-world-template)）には `xrift-world` スキルが同梱されています。追加のインストールなしで、そのまま AI エージェントに作業を依頼できます。
:::

## 更新

インストール済みのスキルを最新版に更新するには、次のコマンドを実行します。

```bash
npx skills update
```

## 含まれるスキル

### xrift-world

XRift プラットフォーム用 WebXR ワールド制作ガイド。

- **SKILL.md** - 最重要ルール、プロジェクト概要、設定、コマンド、トラブルシューティング
- **references/api-reference.md** - `@xrift/world-components` のフック・コンポーネント・定数の全仕様
- **references/code-templates.md** - GLB モデル、テクスチャ、Skybox、インタラクション等のコードテンプレート
- **references/type-definitions.md** - User, PlayerMovement, VRTrackingData 等の型定義

### xrift-sdk

[`@xrift/sdk`](/sdk/overview) でワールド・アイテムをプログラムからアップロードするためのガイド。

- **SKILL.md** - 最重要ルール、XriftClient の初期化、アップロードの流れ、エラー処理
- **references/api-reference.md** - XriftClient, WorldsApi, ItemsApi, エラークラス, ユーティリティの全仕様
- **references/code-templates.md** - Node.js・ブラウザ環境それぞれのコード例
- **references/type-definitions.md** - SDK の全インターフェースの型定義

## 使い方の例

スキルをインストールしたプロジェクトで、エージェントに次のように依頼します。

```
public/models/tree.glb を読み込んで、プレイヤーの正面 5m の位置に配置して
```

エージェントがスキル内のコードテンプレートや API リファレンスを参照し、`@xrift/world-components` の作法に沿ったコードを生成します。

## 参考リンク

- [xrift-skills (GitHub)](https://github.com/WebXR-JP/xrift-skills)
- [Agent Skills Directory](https://skills.sh)
- [最初のワールドを作成する](/guides/create-first-world)
