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

### VideoPlayer

`VideoScreen` をベースにしたUIコントロール付きのビデオプレイヤーです。再生/停止ボタン、プログレスバー、音量バーなどVR対応のコントロールUIを備えています。

```tsx
import { VideoPlayer } from '@xrift/world-components';

<VideoPlayer
  id="my-video"
  url="https://example.com/video.mp4"
  position={[0, 2, -5]}
  width={4}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | スクリーンの一意なID（必須） |
| `position` | `[number, number, number]` | `[0, 2, -5]` | スクリーンの位置 |
| `rotation` | `[number, number, number]` | `[0, 0, 0]` | スクリーンの回転 |
| `width` | `number` | `4` | スクリーンの幅（高さは16:9で自動計算） |
| `url` | `string` | - | 動画のURL |
| `playing` | `boolean` | `true` | 初期再生状態 |
| `volume` | `number` | `1` | 初期音量（0〜1） |
| `sync` | `'global' \| 'local'` | `'global'` | 同期モード |

#### 機能

- **URL入力ボタン**: 🔗 アイコンをクリックするとURL入力オーバーレイが表示され、動画ソースを動的に切り替え可能
- **再生/停止ボタン**: ▶/|| アイコンで再生状態を切り替え
- **プログレスバー**: 20セグメントに分割された進捗バー。クリックで動画の最初に戻る
- **音量バー**: 0-100%を10刻みで調整。🔈/🔇アイコンでミュート状態を表示
- **VR対応**: `Interactable` を使用したVRコントローラー操作に対応

:::tip[同期モード]
`sync` プロパティで同期モードを選択できます：
- `'global'`: 全ユーザー間で再生状態を同期（デフォルト）
- `'local'`: 各ユーザーが独立して再生を制御
:::

---

### LiveVideoPlayer

HLS/DASH などのライブストリーミング再生に対応したビデオプレイヤーです。`VideoPlayer` と同様のUIコントロールを備えつつ、ライブ配信向けに最適化されています。

```tsx
import { LiveVideoPlayer } from '@xrift/world-components';

<LiveVideoPlayer
  id="my-live"
  url="https://example.com/live/stream.m3u8"
  position={[0, 2, -5]}
  width={4}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | スクリーンの一意なID（必須） |
| `position` | `[number, number, number]` | `[0, 2, -5]` | スクリーンの位置 |
| `rotation` | `[number, number, number]` | `[0, 0, 0]` | スクリーンの回転 |
| `width` | `number` | `4` | スクリーンの幅（高さは16:9で自動計算） |
| `url` | `string` | - | ストリームのURL（HLS/DASH対応） |
| `playing` | `boolean` | `true` | 初期再生状態 |
| `volume` | `number` | `1` | 初期音量（0〜1） |

#### 機能

- **URL入力ボタン**: 🔗 アイコンをクリックするとURL入力オーバーレイが表示され、ストリームソースを動的に切り替え可能
- **再生/停止ボタン**: ▶/|| アイコンで再生状態を切り替え
- **音量バー**: 0-100%を10刻みで調整。🔈/🔇アイコンでミュート状態を表示
- **VR対応**: `Interactable` を使用したVRコントローラー操作に対応

:::note[VideoPlayer との違い]
`LiveVideoPlayer` はライブストリーミング向けに設計されているため、プログレスバー（シーク機能）がありません。録画済み動画の再生には `VideoPlayer` を使用してください。
:::

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

### TextInput

3D空間内でテキスト入力を可能にするコンポーネントです。children方式で外観を自由にカスタマイズできます。

```tsx
import { TextInput } from '@xrift/world-components';

<TextInput
  id="my-input"
  value={inputValue}
  onSubmit={handleSubmit}
  placeholder="テキストを入力..."
>
  <mesh>
    <boxGeometry args={[1, 0.5, 0.1]} />
    <meshStandardMaterial color="#333" />
  </mesh>
</TextInput>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | 入力フィールドの一意なID（必須） |
| `children` | `ReactNode` | - | 3Dオブジェクト（外観）（必須） |
| `placeholder` | `string` | - | プレースホルダーテキスト |
| `maxLength` | `number` | - | 最大文字数 |
| `value` | `string` | - | 現在の値 |
| `onSubmit` | `(value: string) => void` | - | 入力完了時のコールバック |
| `interactionText` | `string` | `'クリックして入力'` | インタラクション時に表示するテキスト |
| `disabled` | `boolean` | `false` | 入力を無効にするか |

#### 仕組み

`TextInput` コンポーネントは以下のアーキテクチャで動作します：

1. **TextInput**: children として渡された3Dオブジェクトをクリック可能な入力フィールドとして表示
2. **オーバーレイ入力**: クリック時に2Dのテキスト入力UIがオーバーレイとして表示され、実際の入力を受け付けます
3. **XRiftContext連携**: world-componentsはXRiftContext経由でオーバーレイ表示をリクエストします

:::tip[外観のカスタマイズ]
`children` に任意の3Dオブジェクトを渡すことで、入力フィールドの外観を自由にカスタマイズできます。ボタン風のデザインや、ワールドの世界観に合わせた見た目を実現できます。
:::

:::note[関連するContext/Hook]
プラットフォーム側では以下のAPIを使用してTextInputの動作を実装しています：
- `TextInputContext`
- `useTextInputContext`
- `TextInputContextValue`
- `TextInputRequest`
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

---

### useUsers

ワールドに参加しているユーザー情報と位置情報を取得するフックです。自分自身（ローカルユーザー）と他の参加者（リモートユーザー）の情報にアクセスできます。

```tsx
import { useUsers } from '@xrift/world-components';

function ParticipantCount() {
  const { localUser, remoteUsers, getMovement, getLocalMovement } = useUsers();

  const totalCount = (localUser ? 1 : 0) + remoteUsers.length;

  return (
    <div>
      <p>参加者数: {totalCount}人</p>
    </div>
  );
}
```

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `localUser` | `User \| null` | 自分自身のユーザー情報 |
| `remoteUsers` | `User[]` | 他の参加者のユーザー情報の配列 |
| `getMovement` | `(id: string) => PlayerMovement \| undefined` | 指定ユーザーの位置情報を取得 |
| `getLocalMovement` | `() => PlayerMovement` | 自分の位置情報を取得 |

#### User 型

```typescript
interface User {
  id: string;              // ユーザーID
  displayName: string;     // 表示名
  avatarUrl: string | null; // アバターアイコンURL
  isGuest: boolean;        // ゲストかどうか
}
```

#### PlayerMovement 型

```typescript
interface PlayerMovement {
  position: { x: number; y: number; z: number };
  direction: { x: number; z: number };
  horizontalSpeed: number;
  verticalSpeed: number;
  rotation: { yaw: number; pitch: number };
  isGrounded: boolean;
  isJumping: boolean;
  isInVR?: boolean;
  vrTracking?: VRTrackingData;
}
```

#### useFrame 内での位置情報取得

`getMovement()` と `getLocalMovement()` は `useFrame` 内で毎フレーム呼び出すことができます。これらの関数は再レンダリングを発生させずに最新の位置情報を取得できます。

```tsx
import { useUsers } from '@xrift/world-components';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';

function FollowCamera() {
  const groupRef = useRef<Group>(null);
  const { getLocalMovement } = useUsers();

  useFrame(() => {
    const movement = getLocalMovement();
    if (!groupRef.current) return;

    // 自分の位置の少し上にオブジェクトを配置
    groupRef.current.position.set(
      movement.position.x,
      movement.position.y + 3,
      movement.position.z
    );
  });

  return (
    <group ref={groupRef}>
      <pointLight intensity={1} />
    </group>
  );
}
```

#### ユースケース

##### ユーザーの頭上にHUDを表示

```tsx
import { useUsers } from '@xrift/world-components';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';
import { Text } from '@react-three/drei';

function UserHUD({ user, getMovement }) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const movement = getMovement(user.id);
    if (!movement || !groupRef.current) return;

    // ユーザーの頭の上に配置
    groupRef.current.position.set(
      movement.position.x,
      movement.position.y + 2,
      movement.position.z
    );
  });

  return (
    <group ref={groupRef}>
      <Text fontSize={0.2}>{user.displayName}</Text>
    </group>
  );
}

function UserHUDs() {
  const { remoteUsers, getMovement } = useUsers();

  return (
    <>
      {remoteUsers.map(user => (
        <UserHUD key={user.id} user={user} getMovement={getMovement} />
      ))}
    </>
  );
}
```

##### 近くにいるユーザーを検出

```tsx
import { useUsers } from '@xrift/world-components';
import { useFrame } from '@react-three/fiber';
import { useState } from 'react';

function ProximityDetector() {
  const { remoteUsers, getMovement, getLocalMovement } = useUsers();
  const [nearbyUsers, setNearbyUsers] = useState<string[]>([]);

  useFrame(() => {
    const myPos = getLocalMovement().position;
    const nearby: string[] = [];

    remoteUsers.forEach(user => {
      const movement = getMovement(user.id);
      if (!movement) return;

      const distance = Math.sqrt(
        Math.pow(myPos.x - movement.position.x, 2) +
        Math.pow(myPos.y - movement.position.y, 2) +
        Math.pow(myPos.z - movement.position.z, 2)
      );

      if (distance < 5) {
        nearby.push(user.displayName);
      }
    });

    // 配列の内容が変わった場合のみ更新
    if (JSON.stringify(nearby) !== JSON.stringify(nearbyUsers)) {
      setNearbyUsers(nearby);
    }
  });

  return null;
}
```

##### ユーザー間の距離を計算

```tsx
import { useUsers } from '@xrift/world-components';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Line } from '@react-three/drei';

function DistanceLine({ targetUser, getMovement, getLocalMovement }) {
  const lineRef = useRef<any>(null);

  useFrame(() => {
    const myPos = getLocalMovement().position;
    const targetMovement = getMovement(targetUser.id);
    if (!targetMovement || !lineRef.current) return;

    lineRef.current.geometry.setPositions([
      myPos.x, myPos.y + 1, myPos.z,
      targetMovement.position.x, targetMovement.position.y + 1, targetMovement.position.z
    ]);
  });

  return (
    <Line
      ref={lineRef}
      points={[[0, 0, 0], [0, 0, 0]]}
      color="yellow"
      lineWidth={2}
    />
  );
}
```

:::tip[パフォーマンスのヒント]
`getMovement()` と `getLocalMovement()` は `useFrame` 内で毎フレーム呼び出しても問題ありません。これらは内部的にキャッシュされた値を返すため、パフォーマンスへの影響は最小限です。
:::

:::note[remoteUsers の更新タイミング]
`remoteUsers` 配列はユーザーの参加/離脱時のみ更新されます。ユーザーの位置情報の変化では再レンダリングは発生しません。位置情報は常に `getMovement()` を使用して取得してください。
:::
