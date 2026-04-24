---
sidebar_position: 2
---

# 最初のアイテムを作成する

このチュートリアルでは、XRift CLI を使ってアイテムプロジェクトを作成し、カスタマイズしてアップロードする方法を説明します。

## 前提条件

- Node.js 18.0.0 以上
- XRift CLI がインストール済み

## Step 1: プロジェクトの作成

新しいアイテムプロジェクトを作成します：

```bash
xrift create item my-first-item
cd my-first-item
```

対話形式でプロジェクト名やアイテムのタイトル・説明を設定できます。`-y` オプションでスキップも可能です。

デフォルトでは [WebXR-JP/xrift-item-template](https://github.com/WebXR-JP/xrift-item-template) が使用されます。`-t <repository>` で別のテンプレートも指定できます。

## Step 2: 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開くと、アイテムがローカル環境でプレビューできます。開発サーバーは `src/dev.tsx` をエントリポイントとして、`Canvas` と `Physics`、`OrbitControls` でアイテムを確認できる環境を用意しています。

## Step 3: テンプレートの内容を確認

作成されたプロジェクトには、すでに動作するサンプルアイテムが含まれています：

```
my-first-item/
├── src/
│   ├── Item.tsx          # アイテム本体のコンポーネント
│   ├── index.tsx         # Module Federation のエクスポートエントリ
│   └── dev.tsx           # 開発サーバー用エントリ（本番ビルドには含まれない）
├── xrift.json            # アイテム設定
├── vite.config.ts        # ビルド & Module Federation 設定
└── package.json
```

### テンプレートに含まれるもの

- **回転するクリスタル** - `useFrame` でアニメーションするサンプル
- **物理演算付きの台座** - `RigidBody`（fixed）でコライダーを持つ台座
- **ポイントライト** - クリスタルの発光表現

## Step 4: アイテムをカスタマイズ

`src/Item.tsx` を編集してアイテムをカスタマイズします。アイテムは `Item` コンポーネントをデフォルトエクスポートし、ワールド側から `position` と `scale` を受け取ります。

```tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Mesh } from 'three';

export interface ItemProps {
  position?: [number, number, number];
  scale?: number;
}

export const Item: React.FC<ItemProps> = ({ position = [0, 0, 0], scale = 1 }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <group position={position} scale={scale}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh ref={meshRef} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>
    </group>
  );
};
```

:::tip
`ItemProps` の形（`position` と `scale` を受け取る）は維持してください。XRift プラットフォーム側がアイテムを配置するときに、この Props 経由でトランスフォームを渡します。
:::

### 物理演算を追加する

アイテムはワールドと同じく [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) を使用できます：

```tsx
import { RigidBody } from '@react-three/rapier';

{/* 動かない静的オブジェクト */}
<RigidBody type="fixed" colliders="cuboid">
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="gray" />
  </mesh>
</RigidBody>

{/* 重力や衝突の影響を受けるオブジェクト */}
<RigidBody type="dynamic">
  <mesh>
    <sphereGeometry args={[0.5]} />
    <meshStandardMaterial color="red" />
  </mesh>
</RigidBody>
```

### Three.js アドオンを使う

`DRACOLoader` や `GLTFLoader` など Three.js のアドオンモジュールを使用する場合は、`three/addons/*` からインポートしてください：

```tsx
// OK: shared チャンクとして分離される
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
```

これにより、アドオンモジュールがアイテムバンドルにインライン化されることを防ぎます。インライン化されると `@xrift/code-security` がコード内の `new Worker()` を critical 違反として検出してしまう問題が発生します。詳しくは [Shared Dependencies](/guides/shared-dependencies) を参照してください。

## Step 5: セキュリティチェック

アップロード前にコードのセキュリティチェックを実行できます：

```bash
xrift check item
```

ビルドと合わせて実行する場合：

```bash
xrift check item --build
```

## Step 6: ビルドとアップロード

プロダクションビルドを作成：

```bash
npm run build
```

XRift プラットフォームにアップロード：

```bash
xrift upload item
```

初回アップロード時にタイトル（必須）と説明（任意）のプロンプトが表示されます。`xrift.json` の `item.title` を設定していれば、プロンプトはスキップされます。

アップロード後、コードの審査が自動的に行われます（通常数分で完了します）。審査に通過するとアイテムが公開され、インベントリから使用できるようになります。

## 次のステップ

- [xrift.json 設定（アイテム）](/item/configuration) で設定項目の詳細を確認
- [CLI コマンド](/cli/commands) で利用可能なコマンドを確認
- [Shared Dependencies](/guides/shared-dependencies) で共有依存関係の扱いを確認
