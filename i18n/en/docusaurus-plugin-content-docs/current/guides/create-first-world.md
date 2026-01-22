---
sidebar_position: 1
---

# Create Your First World

In this tutorial, we will explain how to create a world project using the XRift CLI and how to customize it.

## Prerequisites

- Node.js 18.0.0 or higher
- XRift CLI installed

## Step 1: Create a Project

Create a new world project:

```bash
xrift create my-first-world
cd my-first-world
```

You can set the project name and other details interactively. You can also skip this with the `-y` option.

## Step 2: Start the Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser, and the sample world will be displayed.

## Step 3: Check the Template Content

The created project already contains a working sample world:

```
my-first-world/
├── src/
│   ├── World.tsx          # Main world component
│   └── components/        # Sample components
├── public/                # Assets (models, textures, skyboxes, etc.)
├── package.json
└── vite.config.ts
```

### What's Included in the Template

- **Ground and Walls** - Floors and boundaries with physics enabled
- **Skybox** - 360-degree panoramic background
- **Lighting** - Ambient light and directional light with shadows
- **Interactive Button** - Sample of a clickable object
- **3D Model (Duck)** - Sample model with physics
- **Rotating Object** - Sample of animation
- **Mirror** - Sample of a reflective surface
- **VideoScreen** - Sample of video playback

## Step 4: Customize the World

Edit `src/World.tsx` to customize the world.

### Add Objects

```tsx
{/* Add a new cube */}
<mesh position={[3, 0.5, 0]}>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="orange" />
</mesh>
```

### Add Interactions

You can create clickable objects using the `Interactable` component:

```tsx
import { Interactable } from '@xrift/world-components';

<Interactable id="my-button" onInteract={() => console.log('Click!')}>
  <mesh position={[0, 1, -2]}>
    <sphereGeometry args={[0.5]} />
    <meshStandardMaterial color="hotpink" />
  </mesh>
</Interactable>
```

### Synchronize State

Using `useInstanceState`, you can synchronize state across all users:

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

### Add Collision Detection

XRift uses [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) for physics. You can add collision detection to objects using `RigidBody`:

```tsx
import { RigidBody } from '@react-three/rapier';

{/* Wall that players cannot pass through */}
<RigidBody type="fixed">
  <mesh position={[0, 1, -5]}>
    <boxGeometry args={[10, 2, 0.5]} />
    <meshStandardMaterial color="gray" />
  </mesh>
</RigidBody>

{/* Falling object */}
<RigidBody type="dynamic">
  <mesh position={[0, 5, 0]}>
    <sphereGeometry args={[0.5]} />
    <meshStandardMaterial color="red" />
  </mesh>
</RigidBody>
```

#### RigidBody Types

| Type | Description |
|------|------|
| `fixed` | Static objects that do not move (walls, floors, etc.) |
| `dynamic` | Objects affected by gravity and collisions |
| `kinematicPosition` | Objects whose position is controlled by code |

:::tip
If you want to create an invisible wall, you can omit `<mesh>` and place only `<CuboidCollider>`:

```tsx
import { RigidBody, CuboidCollider } from '@react-three/rapier';

<RigidBody type="fixed">
  <CuboidCollider args={[5, 1, 0.25]} position={[0, 1, -5]} />
</RigidBody>
```
:::

## Step 5: Add Assets

Place 3D models and textures in the `public/` directory:

```
public/
├── models/
│   └── my-model.glb
├── textures/
│   └── wood.jpg
└── skybox/
    └── sky.jpg
```

Files placed in `public/` are accessed using `baseUrl` obtained from `useXRift`:

```tsx
import { useXRift } from '@xrift/world-components';
import { useGLTF } from '@react-three/drei';

function MyModel() {
  const { baseUrl } = useXRift();
  const { scene } = useGLTF(`${baseUrl}/models/my-model.glb`);
  return <primitive object={scene} />;
}
```

## Step 6: Build and Deploy

Create a production build:

```bash
npm run build
```

Upload to the XRift platform:

```bash
xrift upload world
```

## Next Steps

- Check component details in [World Components](/world-components/components/)
- Check available commands in [CLI Commands](/cli/commands)