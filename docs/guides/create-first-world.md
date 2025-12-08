---
sidebar_position: 1
---

# 最初のワールドを作成する

このチュートリアルでは、XRift を使って簡単な WebXR ワールドを作成します。

## 前提条件

- Node.js 18.0.0 以上
- XRift CLI がインストール済み

## Step 1: プロジェクトの作成

新しいワールドプロジェクトを作成します：

```bash
xrift create my-first-world
cd my-first-world
```

## Step 2: 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

## Step 3: シーンの編集

`src/App.tsx` を開いて、シーンをカスタマイズしましょう。

### 3.1 オブジェクトの追加

シンプルなキューブを追加します：

```tsx
import { XRiftCanvas, Environment, Ground } from '@xrift/world-components';

function App() {
  return (
    <XRiftCanvas>
      <Environment preset="sunset" />
      <Ground />

      {/* キューブを追加 */}
      <mesh position={[0, 0.5, -2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </XRiftCanvas>
  );
}

export default App;
```

### 3.2 アニメーションの追加

キューブを回転させてみましょう：

```tsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

function RotatingCube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, -2]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
```

### 3.3 インタラクションの追加

掴めるオブジェクトを追加します：

```tsx
import { Grabbable } from '@xrift/world-components';

function GrabbableCube() {
  return (
    <Grabbable>
      <mesh position={[1, 0.5, -2]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    </Grabbable>
  );
}
```

## Step 4: VR で確認

VR ヘッドセットを接続している場合、画面右下の「Enter VR」ボタンをクリックして VR モードに入ります。

## Step 5: ビルドとデプロイ

プロダクションビルドを作成します：

```bash
npm run build
```

XRift プラットフォームにアップロードする場合：

```bash
xrift upload world
```

## 次のステップ

- [World Components](/world-components/overview) で利用可能なコンポーネントを確認
- [CLI コマンド](/cli/commands) で利用可能なコマンドを確認
