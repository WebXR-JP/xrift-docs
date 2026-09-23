---
sidebar_position: 3
---

# API リファレンス

`@xrift/world-components` で提供されるコンポーネント、フック、定数の一覧です。ワールド開発だけでなくアイテム開発からも利用できます（`SpawnPoint` / `DevEnvironment` / `useSpawnPoint` などワールド専用のものは各項目に注記しています）。

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
| `type` | `'button'` | - | インタラクションタイプ |
| `onInteract` | `(id: string) => void` | - | インタラクト時のコールバック（IDが渡される） |
| `interactionText` | `string` | - | ホバー時に表示するテキスト |
| `enabled` | `boolean` | `true` | インタラクションの有効/無効 |
| `children` | `ReactNode` | - | インタラクト対象のオブジェクト |

---

### Grabbable

オブジェクトを「掴める」と宣言するラッパーコンポーネントです。`Interactable` と同じく、囲んだ対象を明示的にオプトインさせます。プレイヤーは掴んだオブジェクトを視点前方に浮かせて運び、任意の位置に置くことができます。

配下のメッシュを `LAYERS.GRABBABLE`（レイヤー14）に載せ、掴む土台（レイキャスト・追従・確定）はプラットフォーム側が担います。開発時は `DevEnvironment` に同梱のシステムで動作確認できます。

`transform` と `onMove` の座標は、`Grabbable` を置いた**親のローカル空間**（通常の `position` prop と同じ）で扱われます。変形された親グループの下にネストしても内部でワールド座標へ変換されるため、離した位置がズレることはありません。

```tsx
import { useState } from 'react';
import { Grabbable, type GrabbableTransform } from '@xrift/world-components';

function GrabbableBall() {
  const [transform, setTransform] = useState<GrabbableTransform>({
    position: { x: 2, y: 0.5, z: -2 },
    rotation: { x: 0, y: 0, z: 0 },
  });

  return (
    <Grabbable
      id="ball"
      transform={transform}
      onMove={(next) => setTransform((prev) => ({ ...prev, ...next }))}
    >
      {/* 子はローカル座標（原点基準）で書く */}
      <mesh>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="gold" />
      </mesh>
    </Grabbable>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | 一意の識別子（必須） |
| `transform` | `GrabbableTransform` | - | 対象の現在姿勢（必須）。親のローカル座標で指定し、ルート group に適用される（子は原点基準で書く） |
| `onMove` | `(transform: GrabResultTransform) => void` | - | 離した（確定）ときに新しい姿勢を受け取る（必須）。`transform` と同じ親ローカル座標で返るので、state に反映して `transform` を更新する |
| `renderGhost` | `() => ReactNode` | - | 掴み中に表示するゴースト（半透明・物理なし）をローカル座標で返す。省略時は `children` を流用 |
| `enabled` | `boolean` | `true` | 掴めるかどうか（`false` で一時的に無効化） |
| `children` | `ReactNode` | - | 掴む対象のオブジェクト（ローカル座標で書く・必須） |

#### GrabbableTransform / GrabResultTransform

```typescript
interface GrabbableTransform {
  position: { x: number; y: number; z: number };  // 親のローカル座標（通常の position prop と同じ）
  rotation: { x: number; y: number; z: number };  // オイラー角（ラジアン）
  scale?: number;                                   // 均一スケール（省略時は 1）
}

interface GrabResultTransform {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}
```

:::caution[物理を含む場合]
子に物理（`RigidBody` など）を含む場合、`renderGhost` に**物理なし版**を必ず指定してください。省略すると `children` がそのままゴーストとして描画され、掴み中に実体とゴーストのコライダーが重複します。
:::

:::note[操作方法]
掴む操作はデスクトップ（ポインターロック＋中央クロスヘア）が前提です。`DevEnvironment` では **G** で掴む/置く、マウスホイールで距離調整、クリックで確定、**Esc**（ポインターロック解除）でキャンセルできます。
:::

---

### Seat

オブジェクトを「座れる」と宣言するラッパーコンポーネントです。`Interactable` と同じく、囲んだ対象を明示的にオプトインさせます。プレイヤーが座ると、視点・姿勢・体の向きが座席に追従し、**Space**（VR は A ボタン）で降ります。

`Seat` は group として置きます。**原点が座面（腰を置く点）、前方が -Z** です。子は座面を原点としたローカル座標で書きます。

座面の姿勢は `Seat` を置いた場所の**ワールド行列から毎フレーム求められます**。そのため、動く乗り物・回転台・傾いたグループの下にネストしても、プレイヤーはそのまま追従します。作者は置くだけで、姿勢を自分で渡す必要はありません。

```tsx
import { Seat } from '@xrift/world-components';

function Stool() {
  const height = 0.45;

  return (
    // 座面の高さに Seat を置く
    <Seat id="stool-1" position={[2, height, -3]} rotation={[0, Math.PI / 2, 0]}>
      {/* 子は座面が原点。箱は半分ぶん下げて描く */}
      <mesh position={[0, -height / 2, 0]}>
        <boxGeometry args={[0.5, height, 0.5]} />
        <meshStandardMaterial color="saddlebrown" />
      </mesh>
    </Seat>
  );
}
```

#### Props

`position` / `rotation` など group のプロパティをそのまま指定できます（`scale` を除く。下記参照）。

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | 一意の識別子（必須） |
| `exitOffset` | `SeatExitOffset` | `{ forward: 0.6, right: 0, up: 0 }` | 降車位置。座席から見た向き・ワールドのメートル |
| `interactionText` | `string` | `'座る'` | 狙ったときに表示するテキスト |
| `enabled` | `boolean` | `true` | 座れるかどうか（`false` で一時的に無効化。他の人が座っている間は自動で無効） |
| `onEnter` | `(occupant: SeatOccupant) => void` | - | 誰かが座ったときに呼ばれる（自分・他人の両方） |
| `onLeave` | `(occupant: SeatOccupant) => void` | - | 誰かが降りたときに呼ばれる（自分・他人の両方） |
| `driver` | `boolean` | `false` | 囲んでいる `Vehicle` の**運転席**にする（0.52.0〜） |
| `onControlInput` | `(input: SeatControlInput, delta: number) => void` | - | 操縦入力。**乗り物ではない**座席（砲台・回転椅子など）で使う |
| `children` | `ReactNode` | - | 座る対象のオブジェクト（座面を原点としたローカル座標で書く・必須） |

#### SeatOccupant

```typescript
interface SeatOccupant {
  id: string;          // プレイヤーの userId
  isLocalUser: boolean; // 自分かどうか
}
```

表示名やアイコンは持ちません。必要なら `useUsers()` から `id` で引いてください（退席後は取れなくなります）。

#### 操縦入力を受け取る（onControlInput）

**乗り物を作るなら `Vehicle` を使ってください**（後述）。`onControlInput` は、砲台・回転椅子・クレーンのように「操縦入力は欲しいが、動かす乗り物は持たない」座席のためのものです。**自分がその席に座っている間だけ**、毎フレーム届きます。

```tsx
<Seat
  id="turret-1"
  position={[0, 0.5, 0]}
  onControlInput={(input, delta) => {
    // 砲身だけ回す
    barrelYaw.current -= input.right * TURN_RATE * delta;
  }}
>
  {/* ... */}
</Seat>
```

#### SeatControlInput

```typescript
interface SeatControlInput {
  forward: number;  // 前後。前が +1、後ろが -1（キーボードなら W / S）
  right: number;    // 左右。右が +1、左が -1（キーボードなら D / A）
}
```

渡されるのは「どれだけ動くか」ではなく**「どの向きに動かしたいか」**です。`right` を旋回（ハンドル）と解釈するか横滑りと解釈するかは、乗り物側が決めます。

:::tip[生のキーイベントとの違い]
`window.addEventListener('keydown')` で乗り物を作ることもできますが、`onControlInput` には3つの利点があります。

- **VR・モバイルでも同じ形で届く**（サムスティック・仮想ジョイスティック）
- **運転者だけに限定される**。生のキーだと、乗っていない人が W を押しても自分の画面で乗り物が動いてしまい、他の人と位置がずれます
- プレイヤーの移動と喧嘩しない（着席中は WASD が歩行に使われません）
:::

:::caution[動かすのは運転者のクライアントだけ]
`onControlInput`（`Vehicle` なら `onDrive`）が呼ばれるのは運転者の画面だけです。全員で物理を回して一致させる作りにはなっていません。

そのため、状態は `useInstanceState` などで同期せず、**運転者のローカル状態として持つのが正しい**です。`Vehicle` を使っていれば姿勢は自動で同期されるので、二重管理になります。
:::

#### SeatExitOffset

```typescript
interface SeatExitOffset {
  forward?: number;  // 前方（-Z 側）へ。既定 0.6
  right?: number;    // 右へ。既定 0
  up?: number;       // ワールド上方向へ。既定 0
}
```

`forward` / `right` は座席の**水平方向の向き（yaw）だけ**で回ります。`up` はワールドの上方向です。傾いた乗り物から降りるときに「座席から見た上」へ出すと、宙返り中に地面へめり込むためです。

テーブル付きの椅子など、前方に降りられない座席で使います。

```tsx
{/* 右側から降りる */}
<Seat id="booth-seat" exitOffset={{ forward: 0, right: 0.7 }}>
  {/* ... */}
</Seat>
```

:::note[座面の高さと子の位置]
`Seat` の原点は座面です。床に置いた箱を座席にする場合、`Seat` 自体を座面の高さに置き、子の箱をそこから下げて描きます。原点を床に合わせると、プレイヤーが床にめり込んで座ります。
:::

:::caution[scale は指定できません]
座面は位置と向きだけで決まり、着席時の腰・目線の高さはプレイヤーのアバターの実寸から決まるため、座席を拡大しても意味がありません。見た目を大きくしたい場合は `children` 側を拡大してください。

親グループを拡大している場合、座面の位置と向きは正しく求まりますが、`exitOffset` の距離は拡大されません（常にワールドのメートル）。
:::

:::note[占有]
同じ座席に他のプレイヤーが座っている間は自動的に `enabled={false}` 相当になり、「座る」のプロンプトが出ません。ほぼ同時に座った場合は両者が座れることがあります（見た目が重なるだけで、状態は壊れません）。
:::

:::note[開発環境で座れます（0.53.0〜）]
`DevEnvironment` には単独プレイヤー用の座席システムが入っているので、`npm run dev` のまま座って試せます。座席を狙ってクリックで着席、**Space** で降車します。`Vehicle` の運転席に座れば WASD で操縦できます。多人数での見え方や同期の確認は XRift 上で行ってください。
:::

---

### Vehicle

乗り物です。中に `Seat` を置き、ひとつに `driver` を付けると運転できるようになります。

**姿勢を所有するのは `Vehicle` です。** 作者は `onDrive` で「どう動かしたいか」だけを書けばよく、同期は意識しなくて構いません。

- 運転者のクライアント: `onDrive` の結果で動き、その姿勢が同期に流れる
- それ以外のクライアント: `onDrive` は呼ばれず、届いた姿勢が当たる

車体ごと動くので、**空いている同乗席も正しい位置**に来ます。流れる姿勢も1台につき1本です。

```tsx
import { Seat, Vehicle } from '@xrift/world-components';

const SPEED = 3;       // m/s
const TURN_RATE = 1.8; // rad/s

function Cart() {
  return (
    <Vehicle
      id="cart-1"
      position={[0, 0, -5]}
      onDrive={(input, delta, vehicle) => {
        // 車体の前方へ進む。傾いていれば坂に沿う
        vehicle.translateZ(-input.forward * SPEED * delta);
        // 今の向きから相対に回る
        vehicle.rotateY(-input.right * TURN_RATE * delta);
      }}
    >
      {/* 車体（乗り物のローカル座標で書く） */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.2, 0.3, 2]} />
        <meshStandardMaterial color="tomato" />
      </mesh>

      {/* 運転席 */}
      <Seat id="cart-1-driver" driver position={[0, 0.45, -0.35]} exitOffset={{ forward: 0, right: -1.2 }}>
        <mesh><boxGeometry args={[0.5, 0.1, 0.5]} /><meshStandardMaterial color="steelblue" /></mesh>
      </Seat>

      {/* 同乗席。運転はできないが車体と一緒に動く */}
      <Seat id="cart-1-back" position={[0, 0.45, 0.55]} exitOffset={{ forward: 0, right: 1.2 }}>
        <mesh><boxGeometry args={[0.5, 0.1, 0.5]} /><meshStandardMaterial color="seagreen" /></mesh>
      </Seat>
    </Vehicle>
  );
}
```

| Prop | 型 | 既定値 | 説明 |
|------|-----|--------|------|
| `id` | `string` | - | 乗り物の一意な ID（必須） |
| `onDrive` | `(input: SeatControlInput, delta: number, vehicle: THREE.Group) => void` | - | 乗り物を動かす。**自分が運転席に座っている間だけ**毎フレーム呼ばれる |

`position` や `rotation` などの group のプロパティもそのまま渡せます。

#### vehicle（onDrive の第3引数）

three.js の `Group` そのものです。書き換えるとそのまま乗り物が動きます。

- `vehicle.rotateY(rad)` — 旋回
- `vehicle.translateZ(-distance)` — **車体の前方**へ前進（傾いていれば坂に沿う）
- `vehicle.quaternion` — 直接いじれば坂・バンク・宙返りも表現できる

:::tip[坂道は translateZ に任せる]
`position.x` / `position.z` に「向きから求めた成分」を足す書き方だと傾きが捨てられ、坂で浮いたり埋まったりします。`translateZ` は車体の前方軸に沿って動くので、坂への追従が何もしなくても付いてきます。
:::

:::caution[props で動かさないこと]
`position` / `rotation` は**初期位置・初期の向き**です。走り出したあとの姿勢は `Vehicle` が持ちます（運転者のクライアントでは `onDrive`、それ以外では届いた姿勢）。変化する値を `position` に渡すと、そのどちらかと喧嘩します。
:::

:::note[driver は Vehicle の中だけ]
`Vehicle` の外の `Seat` に `driver` を付けても運転席にはならず、普通の椅子として扱われます（開発時は console に警告が出ます）。
:::

:::note[停めた場所は覚えられます]
運転者が降りたあとの位置はインスタンスに残るので、後から入室した人にも「停まっている場所」が見えます。初期位置に戻って見えることはありません。
:::

:::note[0.52.0 以降]
`Vehicle` と `Seat` の `driver` は `@xrift/world-components` 0.52.0 以降で使えます。
:::

---

### Mirror

リアルタイム反射面を作成します。

```tsx
import { Mirror } from '@xrift/world-components';

<Mirror position={[0, 1, -5]} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `[number, number, number]` | - | 位置 |
| `rotation` | `[number, number, number]` | - | 回転 |
| `size` | `[number, number]` | - | サイズ |
| `color` | `number` | - | 色（数値形式、例: `0xb5b5b5`） |
| `textureResolution` | `number` | - | テクスチャ解像度 |
| `lodDistance` | `number` | `10` | LOD切り替え距離（この距離より遠いとき低解像度に切り替え） |

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
| `url` | `string` | - | 動画のURL（省略可） |
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
| `playing` | `boolean` | `false` | 初期再生状態 |
| `volume` | `number` | `1` | 初期音量（0〜1） |
| `sync` | `'global' \| 'local'` | `'global'` | 同期モード |

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
| `position` | `[number, number, number]` | `[0, 0, 0]` | スクリーンの位置 |
| `rotation` | `[number, number, number]` | `[0, 0, 0]` | スクリーンの回転 |
| `width` | `number` | `4` | スクリーンの幅（高さは16:9で自動計算） |
| `targetFps` | `number` | - | テクスチャ更新のターゲットFPS |
| `placeholderImageUrl` | `string` | - | 未共有時に表示するプレースホルダー画像のURL |

:::tip[アスペクト比の維持]
映像のアスペクト比は自動的に維持されます。16:9以外の映像でも黒帯が入り正しく表示されます。
:::

:::tip[プレースホルダー画像]
`placeholderImageUrl` を指定すると、画面共有していない間、指定した画像をスクリーンに表示できます。画像はスクリーン内に収まるように表示され（contain）、読み込みに失敗した場合は背景色とガイドテキストの表示にフォールバックします。

画像はWebGLテクスチャとして読み込むため、CORS を許可している画像URLを指定してください（xrift にアップロードした画像はそのまま使えます）。
:::

:::note[制限事項]
共有できる画面はワールドにつき1つまでです。`ScreenShareDisplay` を複数配置することは可能ですが、すべて同じ画面が表示されます。
:::

---

### SpawnPoint

ワールド内でプレイヤーが出現する地点を指定します。

:::caution[ワールド専用]
`SpawnPoint` はワールドレベルのスポーン位置を設定するコンポーネントです。アイテム内で使用することは想定されていません。
:::

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

### TagBoard

ユーザーが選択したタグをローカル/グローバルに扱い、ボードUI（TagSelector）と各ユーザー頭上へのタグ表示（TagDisplay）を提供するコンポーネントです。

```tsx
import { TagBoard } from '@xrift/world-components';

<TagBoard
  instanceStateKey="main-tag-board"
  position={[0, 1.5, -3]}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tags` | `Tag[]` | デフォルトタグ一覧 | 表示・選択対象のタグ |
| `columns` | `number` | `3` | 表示列数 |
| `title` | `string` | `"タグ選択"` | タイトル文言 |
| `instanceStateKey` | `string` | - | インスタンス状態のキー（必須、複数ボード設置時の識別用） |
| `position` | `[number, number, number]` | `[0, 0, 0]` | ボードの位置 |
| `rotation` | `[number, number, number]` | `[0, 0, 0]` | ボードの回転 |
| `scale` | `number` | `1` | 全体スケール |

#### Tag 型定義

```typescript
interface Tag {
  id: string;      // タグの一意識別子
  label: string;   // 表示ラベル
  color: string;   // 色（HEX形式）
}
```

#### デフォルトタグ一覧

`tags` プロパティを省略した場合、以下のタグが使用されます：

```typescript
[
  { color: "#2ECC71", id: "want-talk", label: "話したい" },
  { color: "#3498DB", id: "want-listen", label: "聞きたい" },
  { color: "#95A5A6", id: "silent", label: "無言" },
  { color: "#1ABC9C", id: "developer", label: "開発者" },
  { color: "#2980B9", id: "student", label: "学生" },
  { color: "#F1C40F", id: "beginner", label: "初心者" },
  { color: "#9B59B6", id: "dont-know", label: "なんもわからん" },
  { color: "#8BC34A", id: "working", label: "作業中" },
  { color: "#BF7B41", id: "away", label: "離席中" },
  { color: "#FF9800", id: "cat", label: "ねこ" },
]
```

#### 使用例

##### カスタムタグを使用

```tsx
import { TagBoard, type Tag } from '@xrift/world-components';

const customTags: Tag[] = [
  { id: "frontend", label: "フロントエンド", color: "#61DAFB" },
  { id: "backend", label: "バックエンド", color: "#68A063" },
  { id: "design", label: "デザイン", color: "#FF6B6B" },
  { id: "pm", label: "PM", color: "#9B59B6" },
];

export const MyWorld = () => {
  return (
    <TagBoard
      tags={customTags}
      columns={2}
      title="あなたの役割は？"
      instanceStateKey="role-tag-board"
      position={[0, 1.5, -3]}
      rotation={[0, 0, 0]}
      scale={1.2}
    />
  );
};
```

:::tip[複数のTagBoardを設置する場合]
`instanceStateKey` は同一ワールド内で一意である必要があります。複数の TagBoard を設置する場合は、それぞれ異なる `instanceStateKey` を指定してください。
:::

:::note[依存関係]
- `UsersContext` が必要です（ユーザー情報の取得に使用）
- 内部で `useInstanceState` フックを使用しています（タグ選択状態の同期）
:::

---

### DevEnvironment

ローカル開発用の環境を提供するコンポーネントです。ワールドテンプレートの `dev.tsx` で使用します。

:::caution[ワールド専用]
`DevEnvironment` はワールド開発プロジェクトで `npm run dev` を実行した際のローカル確認用です。`World.tsx` などの実際のワールドコンテンツ内では使用しないでください。また、アイテム開発では使用しません（アイテムテンプレートは独自の `dev.tsx` を持ちます）。
:::

```tsx
import { DevEnvironment, XRiftProvider } from '@xrift/world-components'
import { World } from './World'
import xriftConfig from '../xrift.json'

createRoot(rootElement).render(
  <StrictMode>
    <XRiftProvider baseUrl="/">
      <DevEnvironment
        physicsConfig={xriftConfig.world?.physics}
        camera={{ near: xriftConfig.world?.camera?.near, far: xriftConfig.world?.camera?.far }}
      >
        <World />
      </DevEnvironment>
    </XRiftProvider>
  </StrictMode>
)
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | ワールドコンテンツ（必須） |
| `camera` | `{ position?: [x, y, z]; fov?: number; near?: number; far?: number }` | `{ fov: 50, near: 0.01, far: 1000 }` | カメラ設定 |
| `moveSpeed` | `number` | `5.0` | 移動速度 |
| `shadows` | `boolean` | `true` | シャドウの有効/無効 |
| `spawnPosition` | `[x, y, z]` | `[0.11, 1.6, 7.59]` | スポーン位置 |
| `respawnThreshold` | `number` | `-10` | リスポーンのY座標閾値 |
| `physicsConfig` | `PhysicsConfig` | - | 物理設定 |

#### CameraConfig

`camera` prop で設定可能なクリッピング距離です。`xrift.json` の `world.camera` 設定と対応しています。

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `near` | `number` | `0.01` | nearクリッピング距離 |
| `far` | `number` | `1000` | farクリッピング距離 |

#### PhysicsConfig

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gravity` | `number` | `9.81` | 重力加速度 |
| `allowInfiniteJump` | `boolean` | `true` | 無限ジャンプの許可 |

#### 提供する機能

- **ファーストパーソンプレイヤー**: 物理ベースのWASD移動・ジャンプ・リスポーン
- **視点操作**: PointerLockControls による視点操作
- **インタラクション**: INTERACTABLE レイヤーへのレイキャスト + クリックインタラクション
- **掴む（Grabbable）**: GRABBABLE レイヤーへのレイキャスト + 視点前方への追従・確定
- **座る・操縦（Seat / Vehicle）**: 単独プレイヤー用の座席システム。座席を狙ってクリックで着席、着席中は WASD が操縦入力になり、Space で降車
- **クロスヘアUI**: 画面中央のクロスヘア（ヒット時ハイライト）
- **案内UI**: ポインターロック状態の案内UI
- **操作説明UI**: 操作方法を表示するUI

#### 操作方法

| 操作 | 説明 |
|------|------|
| クリック | ポインターロック開始 / インタラクト / 掴み中は確定 / 座席に座る |
| WASD / 矢印キー | 移動（着席中は操縦） |
| Space / E | ジャンプ（着席中は降りる） |
| G | 掴む / 置く（`Grabbable` 対象） |
| マウスホイール | 掴み中の距離調整 |
| ESC | ポインターロック解除（掴み中はキャンセル） |

:::note[前提条件]
`@react-three/rapier`（`^2.0.0`）のインストールが必要です（optional peerDependency）。
:::

---

### Portal

他のインスタンスへの移動ポータルを表示するコンポーネントです。渦巻きシェーダーエフェクト、移動先のサムネイル・ワールド名・インスタンス名・人数、パーティクル、グロー、クリック可能な台座で構成されます。

`instanceId` を指定すると、対象インスタンスの情報を自動取得して表示します。台座をクリックすると確認モーダル（useConfirm）を経て対象インスタンスへ遷移します。

```tsx
import { Portal } from '@xrift/world-components'

function MyWorld() {
  return (
    <Portal
      instanceId="ceffb128-23c7-4120-b4e6-19bf6c604c47"
      position={[5, 0, 0]}
      rotation={[0, Math.PI / 2, 0]}
    />
  )
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `instanceId` | `string` | - | 移動先のインスタンスID（必須） |
| `position` | `[number, number, number]` | `[0, 0, 0]` | ポータルの座標 |
| `rotation` | `[number, number, number]` | `[0, 0, 0]` | ポータルの回転 |
| `disabled` | `boolean` | `false` | ポータルを無効にする |

:::tip[インスタンスIDの確認方法]
インスタンスIDはインスタンスページのURLに含まれる UUID です。例えば `https://app.xrift.net/instance/ceffb128-23c7-4120-b4e6-19bf6c604c47` の場合、`ceffb128-23c7-4120-b4e6-19bf6c604c47` がインスタンスIDです。
:::

:::note[内部で使用するフック]
`Portal` は内部で `useInstance` フックを使用してインスタンス情報の取得と遷移を行っています。
:::

---

### BillboardY

子要素をカメラに対してY軸回転のみで追従させるコンポーネントです。drei の `<Billboard>` は全軸で回転しますが、`BillboardY` はY軸のみ回転するため「上方向」が維持されます。炎、パーティクル、ネームプレート、看板などに最適です。

Mirror（Reflector）と併用しても、鏡の中で正しい向きで表示されます。

```tsx
import { BillboardY } from '@xrift/world-components'

function NamePlate() {
  return (
    <BillboardY position={[0, 2, 0]}>
      <mesh>
        <planeGeometry args={[2, 0.5]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </BillboardY>
  )
}
```

#### Props

`<group>` と同じ Props を受け取ります（`position`, `rotation`, `scale` など）。

:::tip[フックとして使う]
`useBillboardY` フックを使うと、任意の Object3D に対してY軸ビルボードを適用できます。詳しくは[useBillboardY](#usebillboardy)を参照してください。
:::

---

### EntryLogBoard

インスタンスへの入退室ログを3D空間のボードに表示します。

```tsx
import { EntryLogBoard } from '@xrift/world-components';

<EntryLogBoard
  position={[3, 1.5, -2]}
  rotation={[0, -0.5, 0]}
  maxEntries={10}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stateNamespace` | `string` | - | インスタンス状態のキー（複数ボード設置時の識別用） |
| `maxEntries` | `number` | - | 最大表示件数 |
| `formatTimestamp` | `(timestampMs: number) => string` | - | タイムスタンプのフォーマット関数（epoch ミリ秒を受け取る） |
| `displayNameFallback` | `string` | - | 表示名が取得できない場合のフォールバック |
| `labels` | `Partial<Labels>` | - | ラベル文言のカスタマイズ（join、leave） |
| `colors` | `Partial<Colors>` | - | 色設定のカスタマイズ（join、leave、background、text） |
| `position` | `[number, number, number]` | `[0, 0, 0]` | ボードの位置 |
| `rotation` | `[number, number, number]` | `[0, 0, 0]` | ボードの回転 |
| `scale` | `number` | `1` | 全体スケール |
| `onJoin` | `(entry: LogEntry) => void` | - | 入室時のコールバック |
| `onLeave` | `(entry: LogEntry) => void` | - | 退室時のコールバック |

:::note[内部で使用するフック]
`EntryLogBoard` は自分の入室ログを自身で書き込み、ログを `useInstanceState` で同期します。
時刻は共有時計（`useServerClock`）の epoch ミリ秒で保持し、`user-left` イベントの受信に
`useInstanceEvent` を使用しています。
:::

---

## フック

### useInstanceState

インスタンス内の全ユーザー間で状態を同期します。React の `useState` と同じインターフェースです。

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

### useInstanceEvent

インスタンスイベントの送受信を行うフックです。プラットフォームイベント（`user-joined`, `user-left`）の受信や、ワールド独自のカスタムイベントの送受信ができます。

```tsx
import { useInstanceEvent } from '@xrift/world-components';

// プラットフォームイベントの受信（受信のみ、emit 不可）
useInstanceEvent('user-joined', (data) => {
  console.log('User joined:', data)
})

// カスタムイベントの送受信
const emitReaction = useInstanceEvent('reaction', (data) => {
  console.log('Reaction received:', data)
})
emitReaction({ emoji: '👍', userId: 'user-1' })
```

#### 引数

| 引数 | Type | Description |
|-----|------|-------------|
| `eventName` | `string` | イベント名 |
| `callback` | `(data: T) => void` | イベント受信時のコールバック |

#### 戻り値

`(data: T) => void` - イベント送信関数。プラットフォーム予約イベント（`user-joined`, `user-left`）の場合は no-op になります。

#### イベントの種類

| 種類 | イベント名 | 送信 | 受信 | 説明 |
|------|-----------|:----:|:----:|------|
| プラットフォーム | `user-joined` | - | ✅ | ユーザーがインスタンスに入室 |
| プラットフォーム | `user-left` | - | ✅ | ユーザーがインスタンスから退室 |
| カスタム | 任意の文字列 | ✅ | ✅ | ワールド独自のイベント |

#### ユースケース

##### リアクション機能

```tsx
import { useInstanceEvent } from '@xrift/world-components';
import { useCallback, useState } from 'react';

function ReactionSystem() {
  const [reactions, setReactions] = useState<{ emoji: string }[]>([]);

  const emitReaction = useInstanceEvent('reaction', (data: { emoji: string }) => {
    setReactions(prev => [...prev, data]);
  });

  const sendReaction = useCallback((emoji: string) => {
    emitReaction({ emoji });
  }, [emitReaction]);

  return (
    <mesh onClick={() => sendReaction('👍')}>
      <boxGeometry args={[1, 1, 0.2]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}
```

##### 入退室の検知

```tsx
import { useInstanceEvent } from '@xrift/world-components';

function JoinLeaveNotifier() {
  useInstanceEvent('user-joined', (data) => {
    console.log('User joined:', data);
  });

  useInstanceEvent('user-left', (data) => {
    console.log('User left:', data);
  });

  return null;
}
```

:::tip[カスタムイベントとインスタンスステートの使い分け]
- **useInstanceEvent**: 一時的なイベント通知（リアクション、エフェクトトリガーなど）に適しています。
- **useInstanceState**: 永続的な同期状態（カウンター、ON/OFF状態など）に適しています。
:::

:::note[開発環境での動作]
開発環境ではローカル EventEmitter が使用されるため、同一ブラウザ内でのみイベントが送受信されます。本番環境ではプラットフォームが WebSocket 実装を注入し、インスタンス内の全ユーザー間でイベントが共有されます。
:::

---

### useServerClock

インスタンス内の全端末で一致する時計（サーバ時刻）を提供します。端末の `Date.now()` は互いに 0.1〜数秒ズレているため、カウントダウン・同時演出・動画の再生位置合わせ・全員で揃う周期アニメーションなど、「同じタイミング」を要する処理には必ずこちらを使います。

```tsx
import { useServerClock } from '@xrift/world-components';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

// 全員の画面で同じ位相で動く床（通信ゼロ。後から入った人も即座に一致する）
function MovingFloor() {
  const { now } = useServerClock();
  const floor = useRef<Mesh>(null);

  useFrame(() => {
    if (!floor.current) return;
    // 位置を「時刻の関数」として書く。状態を持たないので同期処理そのものが不要
    floor.current.position.y = 1 + Math.sin(now() / 1000) * 0.5;
  });

  return (
    <mesh ref={floor}>
      <boxGeometry args={[2, 0.2, 2]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
}
```

#### 引数

| 引数 | Type | Description |
|-----|------|-------------|
| `options.require` | `'media' \| 'motion'`（省略可） | 用途に応じた精度要件。`trustworthy` の判定に使われます |

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `now` | `() => number` | サーバ時刻の推定値（ms）。**値ではなく関数**なので `useFrame` の中から再レンダーなしで呼べます。初回同期前は `Date.now()` にフォールバック |
| `uncertainty` | `number` | 推定誤差の上界（ms）。経過時間による劣化を含みます。未同期なら `Infinity` |
| `synced` | `boolean` | いま同期が有効か。切断中は `false` になりますが `now()` は直前の推定を返し続けます |
| `trustworthy` | `boolean` | `require` で指定した精度要件を満たしているか。省略時は `synced` と同じ |
| `timeJumpCount` | `number` | 時刻が飛んだ回数。差分を積算する作りの場合はこの変化で基準を取り直します（下記） |
| `lastTimeJumpMs` | `number` | 直近に飛んだ量（ms）。負なら時刻が戻りました |

#### 精度プリセット

| プリセット | 要求精度 | 用途 |
|-----------|---------|------|
| `media` | ±300ms | 動画・音楽の再生位置合わせ |
| `motion` | ±100ms | 周期アニメーション（動く床・観覧車）、同時演出 |

実測ではデスクトップ・Quest（Wi-Fi）とも ±40ms 程度で、どちらのプリセットも満たします。

#### 時刻が「飛ぶ」ことがある

通常の補正は徐々に寄せるため時刻は巻き戻りませんが、スリープ復帰や初回同期の完了時には飛びます。上の例のように**位置を毎フレーム時刻から計算する（stateless な）作りなら、何もしなくても次のフレームで自己回復します**。速度や差分を積算する作りの場合だけ、`timeJumpCount` の変化を見て基準を取り直してください。

```tsx
const { now, timeJumpCount } = useServerClock();
const seen = useRef(timeJumpCount);

useFrame(() => {
  if (seen.current !== timeJumpCount) {
    seen.current = timeJumpCount;
    resetBaseline(); // 時刻が飛んだので基準を取り直す
  }
  // ...
});
```

#### 動画の再生位置合わせに使う場合

原則は「**補正のコストが誤差より大きいなら補正しない**」です。シークはバッファの破棄と再取得（= 再生停止）を伴うため、小さなズレの補正に使ってはいけません。

```tsx
const clock = useServerClock({ require: 'media' });

useFrame(() => {
  if (!clock.trustworthy) return; // 精度が出ていないなら同期を諦める（再生継続を優先）
  const target = ((clock.now() - epoch) / 1000) % duration;
  const diff = target - video.currentTime;
  if (Math.abs(diff) < 0.3) {
    video.playbackRate = 1; // dead band。戻し忘れると振動し続けるので注意
    return;
  }
  if (Math.abs(diff) < 5) {
    video.playbackRate = 1 + Math.sign(diff) * 0.05; // 映像を止めずに吸収
    return;
  }
  if (isBuffered(video, target)) video.currentTime = target; // バッファ内のときだけシーク
  // バッファ外なら何もしない（同期より再生継続を優先）
});
```

:::warning[公平性が要る用途には使えません]
早押しやゴール判定には使わないでください。通信経路の行き帰りが非対称なぶんの誤差はクライアント側から検出できず、セッション中ほぼ一定なので繰り返しても平均化されません（= 回線条件で同じ人が毎回勝ちます）。勝敗の判定はサーバー側で裁定する設計にしてください。
:::

:::note[開発環境での動作]
開発環境ではデフォルト実装（`synced: false`・`now()` はローカル時計）が使われるため、`trustworthy` は常に `false` です。同期ロジックを開発中に動かすには、dev エントリで `XRiftProvider` に同期済みのフェイク実装を注入してください。

```tsx
<XRiftProvider
  baseUrl="/"
  serverClockImplementation={{
    now: () => Date.now(),
    uncertainty: 10,
    synced: true,
    timeJumpCount: 0,
    lastTimeJumpMs: 0,
  }}
>
```
:::

`@xrift/world-components` **0.47.0 以降**で利用できます。

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
| `getAvatarHeight?` | `(id: string) => AvatarHeight \| undefined` | 指定ユーザーのアバター高さ情報を取得 |
| `getLocalAvatarHeight?` | `() => AvatarHeight` | 自分のアバター高さ情報を取得 |

#### User 型

```typescript
interface User {
  id: string;              // ユーザーID
  displayName: string;     // 表示名
  userIconUrl: string | null; // アバターアイコンURL
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

#### AvatarHeight 型

```typescript
interface AvatarHeight {
  height: number;    // アバターの全身の高さ（メートル）
  eyeHeight: number; // 地面からアバターの目の位置までの高さ（メートル）
}
```

:::note[デフォルト値]
プラットフォーム側が `getAvatarHeight` / `getLocalAvatarHeight` を実装していない場合、デフォルト値として `height: 1.5`、`eyeHeight: 1.35` が返されます。optional プロパティのため、呼び出し時はオプショナルチェーン（`?.`）を使用してください。
:::

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

function UserHUD({ user, getMovement, getAvatarHeight }) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const movement = getMovement(user.id);
    if (!movement || !groupRef.current) return;

    // アバターの高さを取得し、頭の上にHUDを配置
    const avatarHeight = getAvatarHeight?.(user.id);
    const headOffset = (avatarHeight?.height ?? 1.5) + 0.2;

    groupRef.current.position.set(
      movement.position.x,
      movement.position.y + headOffset,
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
  const { remoteUsers, getMovement, getAvatarHeight } = useUsers();

  return (
    <>
      {remoteUsers.map(user => (
        <UserHUD key={user.id} user={user} getMovement={getMovement} getAvatarHeight={getAvatarHeight} />
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

---

### useTeleport

自分自身のアバターを指定した座標に瞬間移動させるフックです。ポータル、エレベーター、ワープゾーンなどのユースケースに対応します。

```tsx
import { useTeleport } from '@xrift/world-components';

function MyComponent() {
  const { teleport } = useTeleport();

  const handleTeleport = useCallback(() => {
    teleport({ position: [50, 0, 30], yaw: 180 });
  }, [teleport]);
}
```

#### API

```typescript
interface TeleportDestination {
  position: [number, number, number]
  yaw?: number // 度数法（0-360）省略時は現在の向きを維持
}

const { teleport } = useTeleport()
```

#### パラメータ（TeleportDestination）

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `position` | `[number, number, number]` | Yes | テレポート先の座標 [x, y, z] |
| `yaw` | `number` | No | テレポート後の向き（度数法 0-360）。省略時は現在の向きを維持 |

#### 使用例

##### ポータルでテレポート

```tsx
import { useTeleport, Interactable } from '@xrift/world-components'
import { useCallback } from 'react'

function MyWorld() {
  const { teleport } = useTeleport()

  const handlePortal = useCallback(() => {
    teleport({ position: [50, 0, 30], yaw: 180 })
  }, [teleport])

  return (
    <Interactable id="portal" onInteract={handlePortal}>
      <mesh>
        <torusGeometry />
        <meshStandardMaterial color="purple" />
      </mesh>
    </Interactable>
  )
}
```

:::tip[yaw の省略]
`yaw` を省略するとテレポート後もプレイヤーの現在の向きが維持されます。特定の方向を向かせたい場合のみ指定してください。
:::

---

### useConfirm

ユーザーに確認モーダルを表示するフックです。ワールド移動など重要なアクションの前に確認を求めることができます。

```tsx
import { useConfirm } from '@xrift/world-components';

function MyComponent() {
  const { requestConfirm } = useConfirm();

  const handleAction = async () => {
    const ok = await requestConfirm({ message: 'ワールドを移動しますか？' });
    if (ok) {
      // 確認された場合の処理
    }
  };
}
```

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `requestConfirm` | `(options: ConfirmOptions) => Promise<boolean>` | 確認モーダルを表示し、結果を返す |

#### ConfirmOptions

| Property | Type | 必須 | Description |
|----------|------|------|-------------|
| `message` | `string` | Yes | ユーザーに表示するメッセージ |
| `title` | `string` | No | ダイアログのタイトル |
| `confirmLabel` | `string` | No | 確認ボタンのラベル |
| `cancelLabel` | `string` | No | キャンセルボタンのラベル |

#### 使用例

##### 外部サイトへの遷移前に確認

```tsx
import { useConfirm, Interactable } from '@xrift/world-components'

function ExternalLink() {
  const { requestConfirm } = useConfirm()

  const handleClick = async () => {
    const ok = await requestConfirm({
      title: '外部サイトへ移動',
      message: '外部サイトへ移動します。よろしいですか？',
      confirmLabel: '移動する',
      cancelLabel: 'キャンセル',
    })
    if (ok) {
      window.open('https://example.com', '_blank')
    }
  }

  return (
    <Interactable id="external-link" onInteract={handleClick}>
      <mesh>
        <boxGeometry args={[1, 1, 0.2]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
    </Interactable>
  )
}
```

:::tip[iOS Safari のポップアップブロック回避]
iPhone 等のモバイルブラウザでは、ユーザー操作を起点としない `window.open` や外部サイトへの遷移がブロックされます。`useConfirm` で確認ダイアログを挟むことで、ユーザー操作起点のイベントチェーンを作り、ブラウザのポップアップブロックを回避できます。
:::

:::note[Portal コンポーネントとの関係]
`Portal` コンポーネントは内部で `useInstance` フックを経由して `useConfirm` を使用しています。Portal を使う場合は `useConfirm` を直接呼ぶ必要はありません。
:::

---

### useInstance

インスタンス情報の取得と確認付き遷移を提供するフックです。内部で `useConfirm` を使い、遷移前に確認モーダルを表示します。

```tsx
import { useInstance } from '@xrift/world-components'

function MyComponent() {
  const { info, navigateWithConfirm } = useInstance('target-instance-id')

  if (!info) return null

  return (
    <mesh onClick={navigateWithConfirm}>
      {/* インスタンス名: {info.name} */}
    </mesh>
  )
}
```

#### 引数

| 引数 | Type | Description |
|-----|------|-------------|
| `instanceId` | `string` | 取得するインスタンスのID |

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `info` | `InstanceInfo \| null` | インスタンス情報（取得前は null） |
| `navigateWithConfirm` | `() => Promise<void>` | 確認モーダル付きでインスタンスへ遷移 |

#### InstanceInfo 型

| フィールド | Type | Description |
|-----------|------|-------------|
| `id` | `string` | インスタンスID |
| `name` | `string` | インスタンス名 |
| `description` | `string \| null` | 説明 |
| `currentUsers` | `number` | 現在のユーザー数 |
| `maxCapacity` | `number` | 最大収容人数 |
| `isPublic` | `boolean` | 公開かどうか |
| `allowGuests` | `boolean` | ゲスト許可 |
| `owner` | `{ id, displayName, userIconUrl? }` | オーナー情報（任意） |
| `world` | `WorldInfo` | 所属ワールドの情報 |

---

### useWorld

ワールド情報の取得を提供するフックです。

```tsx
import { useWorld } from '@xrift/world-components'

function MyComponent() {
  const { info } = useWorld('target-world-id')

  if (!info) return null

  return (
    <mesh>
      {/* ワールド名: {info.name} */}
    </mesh>
  )
}
```

#### 引数

| 引数 | Type | Description |
|-----|------|-------------|
| `worldId` | `string` | 取得するワールドのID |

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `info` | `WorldInfo \| null` | ワールド情報（取得前は null） |

#### WorldInfo 型

| フィールド | Type | Description |
|-----------|------|-------------|
| `id` | `string` | ワールドID |
| `name` | `string` | ワールド名 |
| `description` | `string \| null` | 説明 |
| `thumbnailUrl` | `string \| null` | サムネイルURL |
| `isPublic` | `boolean` | 公開かどうか |
| `instanceCount` | `number` | インスタンス数 |
| `totalVisitCount` | `number` | 総訪問数 |
| `uniqueVisitorCount` | `number` | ユニーク訪問者数 |
| `favoriteCount` | `number` | お気に入り数 |
| `owner` | `{ id, displayName, userIconUrl? }` | オーナー情報（任意） |
| `permissions` | `{ allowedDomains: string[], allowedCodeRules: string[] } \| undefined` | ワールドが必要とする権限（[詳細](/guides/configuration#permissions)） |

---

### useVoiceVolumeOverride

ユーザーごとのボイスチャット音量をオーバーライドするフックです。ステージや壇上にいるユーザーの声を全体に届けるなどのユースケースに対応します。

```tsx
import { useVoiceVolumeOverride } from '@xrift/world-components';

function StagePodium() {
  const { setOverride, clearOverride } = useVoiceVolumeOverride();

  // ステージに乗ったユーザーの声を全員に届ける
  const handleEnter = (userId: string) => {
    setOverride(userId, 1.0);
  };
  const handleLeave = (userId: string) => {
    clearOverride(userId);
  };
}
```

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `setOverride` | `(userId: string, volume: number) => void` | 指定ユーザーのボリュームをオーバーライド |
| `clearOverride` | `(userId: string) => void` | オーバーライドを解除 |
| `clearAll` | `() => void` | すべてのオーバーライドを解除 |
| `getOverrides` | `() => ReadonlyMap<string, number>` | 現在のオーバーライド一覧を取得 |

:::note[旧名称からの移行]
v0.34.0 で `useAudioVolume` から `useVoiceVolumeOverride` にリネームされました。旧名称は `@deprecated` として引き続き使用可能ですが、新しい名前への移行を推奨します。
:::

---

### useBillboardY

対象の Object3D を毎フレームカメラに向けてY軸のみ回転させるフックです。`BillboardY` コンポーネントの内部で使用されていますが、任意の Object3D に適用したい場合に直接使えます。

内部では sentinel Mesh の `onBeforeRender` を使用しているため、Mirror（Reflector）の virtualCamera でも正しい回転が適用されます。

```tsx
import { useBillboardY } from '@xrift/world-components'
import type { Group } from 'three'

function CustomBillboard() {
  const ref = useBillboardY<Group>()

  return (
    <group ref={ref}>
      <mesh>
        <planeGeometry args={[1, 1.5]} />
        <meshBasicMaterial map={fireTexture} />
      </mesh>
    </group>
  )
}
```

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `ref` | `RefObject<T>` | 対象の Object3D にアタッチする ref |

#### 関連

- `BillboardY` コンポーネント — このフックを `<group>` でラップしたもの
- `getBillboardYRotation(cameraWorldPos, targetWorldPos)` — 回転角度を計算する純粋関数（InstancedMesh などで手動計算する場合に使用）

---

### useDefaultFont

UIKit（`@pmndrs/uikit`）用の多言語 MSDF フォントをロードするフックです。ロード完了時に uikit のグローバルプロパティとしても登録されるため、`Container` に `fontFamilies` を明示的に渡さなくても `fontFamily="ja"` が使えます。

```tsx
import { useDefaultFont } from '@xrift/world-components'
import type { FontLocale } from '@xrift/world-components'

const FONT_LOCALES: FontLocale[] = ['ja']

function MyUIComponent() {
  const fontFamilies = useDefaultFont(FONT_LOCALES)

  return (
    <Container fontFamilies={fontFamilies}>
      <Text fontFamily="ja">こんにちは</Text>
    </Container>
  )
}
```

#### 引数

| 引数 | Type | Description |
|------|------|-------------|
| `locales` | `FontLocale[]` | ロードするフォントのロケール配列 |

#### 戻り値

`FontFamilies | undefined` — ロード完了後に `FontFamilies` を返す。ロード中は `undefined`。

#### FontLocale

```typescript
type FontLocale = 'ja'
```

:::tip[グローバル登録]
モジュール読み込み時にフォントが自動的にフェッチされ、`setGlobalProperties` で uikit にグローバル登録されます。そのため、`Container` に `fontFamilies` を渡さなくても `fontFamily="ja"` が利用可能です。明示的に渡す場合はロード中の `undefined` ハンドリングが不要になります。
:::

---

### useFileInput

ファイル選択ダイアログを表示するフックです。3Dオブジェクトのクリックをトリガーに、ブラウザのファイルピッカー（ドラッグ&ドロップ対応のオーバーレイUI）を開くことができます。

```tsx
import { useFileInput } from '@xrift/world-components';

function MyComponent() {
  const { requestFileInput } = useFileInput();

  const handleClick = () => {
    requestFileInput({
      id: 'avatar-upload',
      accept: '.vrm',
      maxSize: 30 * 1024 * 1024,
      onSelect: (files) => console.log('選択:', files),
    });
  };
}
```

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `requestFileInput` | `(request: FileInputRequest) => void` | ファイル選択ダイアログを表示する |

#### FileInputRequest

| Property | Type | 必須 | Description |
|----------|------|------|-------------|
| `id` | `string` | Yes | 入力の一意なID |
| `accept` | `string` | No | 受け入れるファイルタイプ（例: `'.vrm'`, `'image/*'`） |
| `multiple` | `boolean` | No | 複数ファイル選択を許可するか |
| `maxSize` | `number` | No | 最大ファイルサイズ（バイト単位） |
| `onSelect` | `(files: File[]) => void` | Yes | ファイル選択完了時のコールバック |
| `onCancel` | `() => void` | No | キャンセル時のコールバック |
| `onError` | `(error: FileInputError) => void` | No | エラー時のコールバック |

#### FileInputError

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'file_too_large' \| 'invalid_type'` | エラー種別 |
| `message` | `string` | エラーメッセージ |

#### 使用例

##### VRMファイルのアップロード

```tsx
import { useFileInput, Interactable } from '@xrift/world-components'
import { useState } from 'react'

function AvatarUploader() {
  const { requestFileInput } = useFileInput()
  const [fileName, setFileName] = useState('')

  const handleClick = () => {
    requestFileInput({
      id: 'avatar-upload',
      accept: '.vrm',
      maxSize: 30 * 1024 * 1024, // 30MB
      onSelect: (files) => {
        setFileName(files[0].name)
        // ファイルをアップロードする処理...
      },
      onError: (error) => {
        console.error(error.message)
      },
    })
  }

  return (
    <Interactable id="upload-button" onInteract={handleClick} interactionText="アバター変更">
      <mesh>
        <boxGeometry args={[1, 0.5, 0.1]} />
        <meshStandardMaterial color="#7b2d8b" />
      </mesh>
    </Interactable>
  )
}
```

:::tip[ドラッグ&ドロップ対応]
ファイル選択オーバーレイはドラッグ&ドロップにも対応しています。ユーザーはクリックでファイルを選択するか、ファイルをドロップゾーンにドラッグして追加できます。
:::

:::note[VRセッション中の動作]
VRセッション中にファイル選択がリクエストされた場合、自動的にVRセッションが終了してからファイルピッカーが表示されます。
:::

---

### useSharedFile

インスタンスの共有ファイルをアップロード・一覧取得・ロック（削除保護）・情報更新・削除するフックです。3D空間内から画像やドキュメントをアップロードし、他のユーザーと共有できます。

```tsx
import { useSharedFile } from '@xrift/world-components';

function MyComponent() {
  const { uploadSharedFile, getSharedFiles, setSharedFileLock, updateSharedFile } = useSharedFile();

  const handleUpload = async (file: File) => {
    const result = await uploadSharedFile(file, (progress) => {
      console.log(`${progress}%`);
    });
    console.log('URL:', result.publicUrl);
    // アップロード直後にロックして誤削除を防ぐ
    await setSharedFileLock(result.id, true);
  };
}
```

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `uploadSharedFile` | `(file: File, onProgress?: (progress: number) => void, options?: UploadSharedFileOptions) => Promise<SharedFileInfo>` | ファイルをアップロードする |
| `getSharedFiles` | `() => Promise<SharedFileInfo[]>` | 共有ファイル一覧を取得する |
| `setSharedFileLock` | `(fileId: string, locked: boolean) => Promise<SharedFileInfo>` | ロック状態（削除保護）を設定する |
| `updateSharedFile` | `(fileId: string, updates: UpdateSharedFileParams) => Promise<SharedFileInfo>` | ファイル情報（fileName / description / metadata）を更新する |
| `deleteSharedFile` | `(fileId: string) => Promise<void>` | ファイルを削除する |

#### SharedFileInfo

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | ファイルの一意なID |
| `fileName` | `string` | ファイル名 |
| `contentType` | `string` | MIMEタイプ |
| `fileSize` | `number` | ファイルサイズ（バイト） |
| `publicUrl` | `string` | 公開URL |
| `locked` | `boolean` | ロック中（削除保護）かどうか |
| `description` | `string \| null` | 説明文 |
| `metadata` | `Record<string, string> \| null` | 構造化メタデータ |
| `createdAt` | `string` | 作成日時（ISO 8601） |

#### UploadSharedFileOptions

アップロード時に任意で付与できる情報です。

| Property | Type | Description |
|----------|------|-------------|
| `description` | `string` | 説明文（500文字以内） |
| `metadata` | `Record<string, string>` | フラットな key-value のメタデータ（20件以内、キー1〜64文字、値500文字以内） |

#### UpdateSharedFileParams

`updateSharedFile` に渡す更新内容です。`description` / `metadata` は `null` を指定するとクリアできます。

| Property | Type | Description |
|----------|------|-------------|
| `fileName` | `string` | ファイル名 |
| `description` | `string \| null` | 説明文（`null` でクリア） |
| `metadata` | `Record<string, string> \| null` | メタデータ（`null` でクリア） |

:::note
ロック中（`locked: true`）のファイルは `deleteSharedFile` による削除も `updateSharedFile` による更新も拒否されます。削除・更新したい場合は先に `setSharedFileLock(fileId, false)` でロックを解除してください。
:::

#### 使用例

##### 画像のアップロードと一覧表示

```tsx
import { useSharedFile, useFileInput, Interactable } from '@xrift/world-components'
import { useCallback, useState } from 'react'

function SharedFileUploader() {
  const { uploadSharedFile, getSharedFiles } = useSharedFile()
  const { requestFileInput } = useFileInput()
  const [status, setStatus] = useState('')

  const handleUpload = useCallback(() => {
    requestFileInput({
      id: 'shared-file-upload',
      accept: 'image/*',
      maxSize: 10 * 1024 * 1024, // 10MB
      onSelect: async (files) => {
        const file = files[0]
        if (!file) return
        try {
          const result = await uploadSharedFile(file, (progress) => {
            setStatus(`アップロード中: ${progress}%`)
          })
          setStatus(`完了: ${result.fileName}`)
        } catch (e) {
          setStatus(`エラー: ${e instanceof Error ? e.message : String(e)}`)
        }
      },
    })
  }, [requestFileInput, uploadSharedFile])

  const handleList = useCallback(async () => {
    const files = await getSharedFiles()
    setStatus(`${files.length}件のファイル`)
  }, [getSharedFiles])

  return (
    <>
      <Interactable id="upload-btn" onInteract={handleUpload} interactionText="アップロード">
        <mesh>
          <boxGeometry args={[1, 0.5, 0.1]} />
          <meshStandardMaterial color="#d4a017" />
        </mesh>
      </Interactable>
      <Interactable id="list-btn" onInteract={handleList} interactionText="一覧表示">
        <mesh position={[1.5, 0, 0]}>
          <boxGeometry args={[1, 0.5, 0.1]} />
          <meshStandardMaterial color="#c47f17" />
        </mesh>
      </Interactable>
    </>
  )
}
```

##### 説明文・メタデータ付きアップロードとロック

来場者がアップロードしたファイルを永続展示するようなケースでは、アップロード時に説明文・メタデータを付与し、直後にロックすることで誤削除を防げます。

```tsx
import { useSharedFile } from '@xrift/world-components'

function ExhibitUploader() {
  const { uploadSharedFile, setSharedFileLock, updateSharedFile, deleteSharedFile } = useSharedFile()

  const handleExhibitUpload = async (file: File) => {
    // 説明文・メタデータを付与してアップロード
    const result = await uploadSharedFile(file, undefined, {
      description: '展示品A',
      metadata: { exhibit: 'pedestal-1' },
    })

    // アップロード直後にロックして誤削除を防ぐ
    await setSharedFileLock(result.id, true)

    return result.publicUrl
  }

  const handleUpdateDescription = async (fileId: string) => {
    // ロック中は更新できないため、一度解除してから更新して再ロック
    await setSharedFileLock(fileId, false)
    await updateSharedFile(fileId, { description: '展示品B' })
    await setSharedFileLock(fileId, true)
  }

  const handleRemoveExhibit = async (fileId: string) => {
    // 展示を取り下げてファイル実体も削除（ロック中は先に解除する）
    await setSharedFileLock(fileId, false)
    await deleteSharedFile(fileId)
  }

  // ...
}
```

---

### useItem

配置されたアイテムの固有IDと設置者の情報を取得するフックです。同じアイテムが複数配置された場合でも、配置ごとに異なるIDが返されます。

```tsx
import { useItem } from '@xrift/world-components';

function MyItem() {
  const { id, placedBy } = useItem();
  // id は配置ごとにユニーク
  // placedBy はこのアイテムを設置したユーザー（特定できない場合は null）
}
```

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | 配置オブジェクトの固有ID（UUID） |
| `placedBy` | `ItemPlacer \| null` | 設置者。プレビュー中（配置前）は自分。永続シーン由来などで設置者を特定できない場合は `null` |

#### ItemPlacer

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | 設置者の userId。サーバーが確定した値で、常に入ります |
| `displayName` | `string \| null` | 表示名。設置者が退室済みなどでプロフィールを解決できない場合は `null` |
| `avatarUrl` | `string \| null` | アイコン URL。解決できない場合は `null` |
| `isLocalUser` | `boolean` | 自分（ローカルユーザー）が設置したものか |

:::note
`useItem` は `ItemProvider` 内でのみ使用可能です。Provider 外で呼び出すと例外がスローされます。プラットフォームが `ItemProvider` を自動的に提供するため、アイテム開発者が Provider を設定する必要はありません。
:::

:::tip[設置者の判定は id で行う]
`placedBy.id` はバックエンドが確定した userId なので、クライアント側で偽装できません。「設置者だけが操作できる」ようにしたい場合は `isLocalUser`（自分かどうか）や `id` の比較で判定してください。一方 `displayName` / `avatarUrl` はインスタンス内の参加者情報から都度解決されるため、設置者が退室すると `null` になります。表示用途にとどめ、判定に使わないでください。
:::

`placedBy` は `@xrift/world-components` **0.49.0 以降**で利用できます。

##### 設置者だけが操作できるアイテム

```tsx
import { useCallback } from 'react';
import { Interactable, useItem, useInstanceState } from '@xrift/world-components';

function PlacerOnlyCounter() {
  const { id, placedBy } = useItem();
  const [count, setCount] = useInstanceState(`count-${id}`, 0);

  const handleReset = useCallback(() => {
    // 設置者だけがリセットできる
    if (!placedBy?.isLocalUser) return;
    setCount(0);
  }, [placedBy, setCount]);

  return (
    <Interactable id={`reset-${id}`} onInteract={handleReset}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={placedBy?.isLocalUser ? 'orange' : 'gray'} />
      </mesh>
    </Interactable>
  );
}
```

##### 設置者の名前を表示する

```tsx
import { Text } from '@react-three/drei';
import { useItem } from '@xrift/world-components';

function OwnerLabel() {
  const { placedBy } = useItem();
  // 退室済みなどで表示名が引けない場合のフォールバックを用意する
  const label = placedBy?.displayName ?? '（不明なユーザー）';

  return (
    <Text position={[0, 1.2, 0]} fontSize={0.1} anchorX="center">
      {`設置者: ${label}`}
    </Text>
  );
}
```

##### 配置ごとのステート管理

```tsx
import { useItem, useInstanceState } from '@xrift/world-components';

function VotingBox() {
  const { id } = useItem();
  const [votes, setVotes] = useInstanceState(`votes-${id}`, 0);

  return (
    <Interactable id={`vote-${id}`} onInteract={() => setVotes(votes + 1)}>
      <mesh>
        <boxGeometry args={[1, 1, 0.2]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </Interactable>
  );
}
```

---

### useWorldStorage

ワールド単位のKV永続化（World Storage）を提供するフックです。ランキング・ワールド内通貨・登録情報などを、インスタンスをまたいで永続化できます。

```tsx
import { useWorldStorage } from '@xrift/world-components';

function MyComponent() {
  const storage = useWorldStorage();

  const saveProgress = async () => {
    // 共有KV（ワールドに1つの共有値）
    await storage.shared.set('event_phase', '第2章');
    const visits = await storage.shared.increment('total_visits', 1);

    // ユーザー別KV（書き込みは自分の値のみ）
    await storage.player.set('coins', 340);
    const coins = await storage.player.get('coins');
  };
}
```

#### 戻り値

| Property | Type | Description |
|----------|------|-------------|
| `shared` | `SharedWorldStorage` | 共有KV（ワールドに1つの共有値）。インスタンス参加中の認証ユーザーなら誰でも書ける |
| `player` | `PlayerWorldStorage` | ユーザー別KV。書き込みは自分の値のみ、読み取りは他人の値も可 |

#### SharedWorldStorage

| Method | Type | Description |
|--------|------|-------------|
| `get` | `(key: string) => Promise<unknown>` | 値を取得する。存在しない場合は `undefined` |
| `list` | `() => Promise<WorldStorageEntry[]>` | すべてのキーと値を取得する |
| `set` | `(key: string, value: unknown) => Promise<void>` | 値を保存する |
| `increment` | `(key: string, delta: number) => Promise<number>` | 数値を加算し、加算後の値を返す（同時実行でも加算がロストしない） |
| `delete` | `(key: string) => Promise<void>` | 値を削除する（冪等） |

#### PlayerWorldStorage

| Method | Type | Description |
|--------|------|-------------|
| `get` | `(key: string, options?: { userId?: string }) => Promise<unknown>` | 値を取得する。`userId` を指定すると他のユーザーの値を読める |
| `list` | `(options?: { userId?: string }) => Promise<WorldStorageEntry[]>` | すべてのキーと値を取得する。`userId` 指定で他のユーザーの値も可 |
| `set` | `(key: string, value: unknown) => Promise<void>` | 自分の値を保存する |
| `increment` | `(key: string, delta: number) => Promise<number>` | 自分の値に数値を加算し、加算後の値を返す |
| `delete` | `(key: string) => Promise<void>` | 自分の値を削除する（冪等） |

#### 制約・指針

| 項目 | 内容 |
|------|------|
| 保存タイミング | 「ゲームイベントの節目」で保存する。毎フレームの同期は `useInstanceState` などの揮発性の状態同期を使う |
| 容量 | ワールドごと合計 10MB / 1エントリ 100KB |
| キー数 | 共有 256キー / ユーザーあたり 64キー |
| キー形式 | `/^[A-Za-z0-9_.\-:]{1,128}$/` |
| レートリミット | 書き込みはユーザーごと 30回/分 |
| 読み取り | 公開（認証不要で API から読める）。**秘密情報を入れないこと** |
| ゲスト | 読み取りのみ（書き込みは `WorldStorageError` になる） |
| 加算 | 通貨・スコアの加算は `set` ではなく `increment` を使う |

#### WorldStorageError

操作が失敗すると `WorldStorageError` が投げられます。`code` プロパティで原因を判別できます。

| Code | Description |
|------|-------------|
| `QUOTA_EXCEEDED` | ワールド合計容量（10MB）を超過 |
| `LIMIT_EXCEEDED` | キー数上限を超過（共有: 256キー / ユーザーあたり: 64キー） |
| `ENTRY_TOO_LARGE` | 1エントリの上限（100KB）を超過 |
| `TYPE_MISMATCH` | `increment` 対象の既存値が数値でない |
| `INVALID_KEY` | キー形式が不正 |
| `NOT_IN_WORLD` | ワールドのインスタンスに参加していない状態での書き込み |
| `RATE_LIMITED` | レートリミット超過 |
| `UNAUTHORIZED` | 未認証（ゲスト）での書き込み |
| `UNKNOWN` | その他のエラー |

#### 使用例

##### 来場者数カウンター

```tsx
import { useWorldStorage, Interactable } from '@xrift/world-components'
import { Text } from '@react-three/drei'
import { useEffect, useState } from 'react'

function VisitCounter() {
  const storage = useWorldStorage()
  const [visits, setVisits] = useState<number | null>(null)

  useEffect(() => {
    // 入場時に一度だけカウントアップ
    storage.shared.increment('total_visits', 1).then(setVisits)
  }, [storage])

  return (
    <Text position={[0, 2, 0]} fontSize={0.2} color="white">
      {visits === null ? '...' : `累計来場者数: ${visits}`}
    </Text>
  )
}
```

##### ユーザー別のコイン管理

```tsx
import { useWorldStorage, WorldStorageError } from '@xrift/world-components'

function useCoins() {
  const storage = useWorldStorage()

  const addCoins = async (amount: number) => {
    try {
      // 同時実行でも加算がロストしないよう increment を使う
      return await storage.player.increment('coins', amount)
    } catch (e) {
      if (e instanceof WorldStorageError && e.code === 'UNAUTHORIZED') {
        console.log('ゲストは書き込みできません')
        return null
      }
      throw e
    }
  }

  return { addCoins }
}
```

:::note
World Storage は永続化ストレージです。毎フレーム更新されるような値の同期には `useInstanceState` / `useInstanceEvent` を使い、World Storage への保存はゲームイベントの節目（クリア時、購入時など）に行ってください。
:::

---

## 定数

### LAYERS

Three.js のレイヤーシステムを活用した定数です。カメラやRaycasterのレイヤー設定に使用します。

```typescript
import { LAYERS } from '@xrift/world-components';
```

| 定数名 | 値 | 説明 |
|--------|-----|------|
| `LAYERS.DEFAULT` | `0` | デフォルトレイヤー（すべてのオブジェクトが初期状態で属する） |
| `LAYERS.FIRST_PERSON_ONLY` | `9` | 一人称視点のみ表示（VRMFirstPerson用） |
| `LAYERS.THIRD_PERSON_ONLY` | `10` | 三人称視点のみ表示（VRMFirstPerson用） |
| `LAYERS.INTERACTABLE` | `11` | インタラクト可能オブジェクト（Raycast対象） |
| `LAYERS.GRABBABLE` | `14` | 掴めるオブジェクト（`Grabbable` のRaycast対象） |

#### 関連する型

```typescript
type LayerName = 'DEFAULT' | 'FIRST_PERSON_ONLY' | 'THIRD_PERSON_ONLY' | 'INTERACTABLE' | 'GRABBABLE';
type LayerNumber = 0 | 9 | 10 | 11 | 14;
```

#### ユースケース

- Raycasterでインタラクション対象を検出する際のレイヤー設定
- VRモードでの一人称/三人称の表示切り替え
