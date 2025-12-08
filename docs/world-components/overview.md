---
sidebar_position: 1
---

# World Components 概要

xrift-world-components は、WebXR ワールドを構築するための React コンポーネントライブラリです。

## 特徴

- React Three Fiber ベース
- WebXR 対応（VR/AR）
- 宣言的な 3D シーン構築
- TypeScript 完全サポート

## インストール

```bash
npm install @xrift/world-components
```

## 基本的な使い方

```tsx
import { XRiftCanvas, Environment, Ground } from '@xrift/world-components';

function App() {
  return (
    <XRiftCanvas>
      <Environment preset="sunset" />
      <Ground />
    </XRiftCanvas>
  );
}
```

## コンポーネントカテゴリ

### コアコンポーネント

- `XRiftCanvas` - XRift アプリケーションのルートコンポーネント
- `XRController` - VR コントローラー

### 環境コンポーネント

- `Environment` - 環境マップとライティング
- `Sky` - スカイボックス
- `Ground` - 地面

### インタラクションコンポーネント

- `Grabbable` - 掴めるオブジェクト
- `Teleport` - テレポート移動

詳細は [Components](/world-components/components/) を参照してください。

## リポジトリ

- [GitHub: xrift-world-components](https://github.com/WebXR-JP/xrift-world-components)
