---
sidebar_position: 1
---

# Components 一覧

xrift-world-components で提供されるコンポーネントの一覧です。

## コアコンポーネント

### XRiftCanvas

XRift アプリケーションのルートコンポーネント。React Three Fiber の Canvas をラップし、WebXR サポートを提供します。

```tsx
import { XRiftCanvas } from '@xrift/world-components';

<XRiftCanvas>
  {/* 3D コンテンツ */}
</XRiftCanvas>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | 3D シーンの内容 |
| `sessionInit` | `XRSessionInit` | `{}` | XR セッションの初期化オプション |

## 環境コンポーネント

### Environment

環境マップとライティングを設定します。

```tsx
import { Environment } from '@xrift/world-components';

<Environment preset="sunset" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `preset` | `string` | `'sunset'` | プリセット名（sunset, dawn, night, etc.） |
| `background` | `boolean` | `true` | 背景として表示するか |

### Ground

シンプルな地面を表示します。

```tsx
import { Ground } from '@xrift/world-components';

<Ground size={100} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `100` | 地面のサイズ |
| `color` | `string` | `'#3d3d3d'` | 地面の色 |

## インタラクションコンポーネント

### Grabbable

VR コントローラーで掴めるオブジェクトを作成します。

```tsx
import { Grabbable } from '@xrift/world-components';

<Grabbable>
  <mesh>
    <boxGeometry args={[0.2, 0.2, 0.2]} />
    <meshStandardMaterial color="red" />
  </mesh>
</Grabbable>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | 掴めるオブジェクトの内容 |
| `onGrab` | `() => void` | - | 掴んだ時のコールバック |
| `onRelease` | `() => void` | - | 離した時のコールバック |
