---
sidebar_position: 1
---

# 最初のワールドを作成する

このチュートリアルでは、XRift CLI を使ってワールドプロジェクトを作成し、カスタマイズする方法を説明します。

## 前提条件

- Node.js 18.0.0 以上
- XRift CLI がインストール済み

## Step 1: プロジェクトの作成

新しいワールドプロジェクトを作成します：

```bash
xrift create my-first-world
cd my-first-world
```

対話形式でプロジェクト名などを設定できます。`-y` オプションでスキップも可能です。

## Step 2: 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開くと、サンプルワールドが表示されます。

## Step 3: テンプレートの内容を確認

作成されたプロジェクトには、すでに動作するサンプルワールドが含まれています：

```
my-first-world/
├── src/
│   ├── World.tsx          # メインのワールドコンポーネント
│   └── components/        # サンプルコンポーネント
├── public/                # アセット（モデル、テクスチャ、スカイボックスなど）
├── package.json
└── vite.config.ts
```

### テンプレートに含まれるもの

- **地面と壁** - 物理演算が有効な床と境界
- **スカイボックス** - 360度パノラマ背景
- **ライティング** - 環境光とシャドウ付き指向性ライト
- **インタラクティブボタン** - クリック可能なオブジェクトのサンプル
- **3Dモデル（Duck）** - 物理演算付きのサンプルモデル
- **回転オブジェクト** - アニメーションのサンプル
- **Mirror** - 反射面のサンプル
- **VideoScreen** - 動画再生のサンプル

## Step 4: ワールドをカスタマイズ

`src/World.tsx` を編集してワールドをカスタマイズします。

### オブジェクトを追加する

```tsx
{/* 新しいキューブを追加 */}
<mesh position={[3, 0.5, 0]}>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="orange" />
</mesh>
```

### インタラクションを追加する

`Interactable` コンポーネントでクリック可能なオブジェクトを作成できます：

```tsx
import { Interactable } from '@xrift/world-components';

<Interactable id="my-button" onInteract={() => console.log('クリック！')}>
  <mesh position={[0, 1, -2]}>
    <sphereGeometry args={[0.5]} />
    <meshStandardMaterial color="hotpink" />
  </mesh>
</Interactable>
```

### 状態を同期する

`useInstanceState` を使うと、全ユーザー間で状態を同期できます：

```tsx
import { useInstanceState, Interactable } from '@xrift/world-components';

function SyncedLight() {
  const [isOn, setIsOn] = useInstanceState('light', false);

  return (
    <Interactable id="light-switch" onInteract={() => setIsOn(!isOn)}>
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial
          color={isOn ? 'yellow' : 'gray'}
          emissive={isOn ? 'yellow' : 'black'}
        />
      </mesh>
    </Interactable>
  );
}
```

## Step 5: アセットを追加する

3Dモデルやテクスチャは `public/` ディレクトリに配置します：

```
public/
├── models/
│   └── my-model.glb
├── textures/
│   └── wood.jpg
└── skybox/
    └── sky.jpg
```

`public/` に配置したファイルは、`useXRift` から取得した `baseUrl` を使ってアクセスします：

```tsx
import { useXRift } from '@xrift/world-components';
import { useGLTF } from '@react-three/drei';

function MyModel() {
  const { baseUrl } = useXRift();
  const { scene } = useGLTF(`${baseUrl}/models/my-model.glb`);
  return <primitive object={scene} />;
}
```

## Step 6: ビルドとデプロイ

プロダクションビルドを作成：

```bash
npm run build
```

XRift プラットフォームにアップロード：

```bash
xrift upload world
```

## 次のステップ

- [World Components](/world-components/components/) でコンポーネントの詳細を確認
- [CLI コマンド](/cli/commands) で利用可能なコマンドを確認
