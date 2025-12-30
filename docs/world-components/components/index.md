---
sidebar_position: 1
---

# API リファレンス

xrift-world-components で提供されるコンポーネントとフックの一覧です。

## コンポーネント

### Interactable

クリック/インタラクト可能なオブジェクトを作成します。

```tsx
import { Interactable } from '@xrift/world-components';

<Interactable id="my-button" onInteract={() => console.log('clicked!')}>
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="hotpink" />
  </mesh>
</Interactable>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | 一意の識別子（必須） |
| `onInteract` | `() => void` | - | インタラクト時のコールバック |
| `children` | `ReactNode` | - | インタラクト対象のオブジェクト |

---

### Mirror

リアルタイム反射面を作成します。

```tsx
import { Mirror } from '@xrift/world-components';

<Mirror position={[0, 1, -5]} />
```

---

### VideoScreen

同期された動画再生を行うスクリーンを作成します。

```tsx
import { VideoScreen } from '@xrift/world-components';

<VideoScreen src="/videos/intro.mp4" position={[0, 2, -3]} />
```

---

### ScreenShareDisplay

画面共有の映像を3D空間内にスクリーンとして表示します。`ScreenShareContext` から映像と状態を取得します。

```tsx
import { ScreenShareDisplay } from '@xrift/world-components';

<ScreenShareDisplay id="screen-1" position={[0, 2, -5]} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | スクリーンの一意なID（必須） |
| `position` | `[number, number, number]` | `[0, 2, -5]` | スクリーンの位置 |
| `rotation` | `[number, number, number]` | `[0, 0, 0]` | スクリーンの回転 |
| `width` | `number` | `4` | スクリーンの幅（高さは16:9で自動計算） |

:::tip[アスペクト比の維持]
映像のアスペクト比は自動的に維持されます。16:9以外の映像でも黒帯が入り正しく表示されます。
:::

:::note[制限事項]
共有できる画面はワールドにつき1つまでです。`ScreenShareDisplay` を複数配置することは可能ですが、すべて同じ画面が表示されます。
:::

---

### SpawnPoint

ワールド内でプレイヤーが出現する地点を指定します。

```tsx
import { SpawnPoint } from '@xrift/world-components';

<SpawnPoint />
<SpawnPoint position={[0, 0, 5]} yaw={180} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `[number, number, number]` | `[0, 0, 0]` | スポーン位置 |
| `yaw` | `number` | `0` | スポーン時の向き（度数法 0-360） |

:::tip[開発時ヘルパー]
開発環境では、半透明の円柱（下から上にかけて透明度が増すグラデーション）と矢印でスポーン位置と方向を視覚化します。本番ビルドではヘルパーは表示されません。

![SpawnPoint ヘルパー](/img/spawnpoint-helper.png)
:::

:::note[複数のSpawnPoint]
複数の `SpawnPoint` を配置した場合、最後に設定されたものが有効になります。
:::

---

## フック

### useInstanceState

ワールド内の全ユーザー間で状態を同期します。React の `useState` と同じインターフェースです。

```tsx
import { useInstanceState } from '@xrift/world-components';

function Counter() {
  const [count, setCount] = useInstanceState('counter', 0);

  return (
    <mesh onClick={() => setCount(count + 1)}>
      {/* count は全ユーザーで同期される */}
    </mesh>
  );
}
```

#### 引数

| 引数 | Type | Description |
|-----|------|-------------|
| `key` | `string` | 状態の一意な識別子 |
| `initialValue` | `T` | 初期値 |

#### 戻り値

`[value: T, setValue: (newValue: T) => void]` - useState と同じ形式

---

### useScreenShareContext

画面共有の状態を取得するフックです。

```tsx
import { useScreenShareContext } from '@xrift/world-components';

function MyComponent() {
  const { videoElement, isSharing, startScreenShare, stopScreenShare } = useScreenShareContext();

  return (
    <button onClick={isSharing ? stopScreenShare : startScreenShare}>
      {isSharing ? '共有を停止' : '共有を開始'}
    </button>
  );
}
```

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `videoElement` | `HTMLVideoElement \| null` | 表示する映像のvideo要素 |
| `isSharing` | `boolean` | 自分が共有中かどうか |
| `startScreenShare` | `() => void` | 共有開始 |
| `stopScreenShare` | `() => void` | 共有停止 |

---

### useSpawnPoint

プラットフォーム側がスポーン地点情報を取得するためのフックです。

```tsx
import { useSpawnPoint } from '@xrift/world-components';

function MyPlatform() {
  const spawnPoint = useSpawnPoint();
  // spawnPoint: { position: [x, y, z], yaw: number }
}
```

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `position` | `[number, number, number]` | スポーン位置 |
| `yaw` | `number` | スポーン時の向き（度数法） |

:::note[使用先]
このフックは xrift-frontend（プラットフォーム）側での使用を想定しています。ワールド開発者は `SpawnPoint` コンポーネントを使用してください。
:::
