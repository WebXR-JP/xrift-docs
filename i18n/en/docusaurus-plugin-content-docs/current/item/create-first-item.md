---
sidebar_position: 2
---

# Create Your First Item

In this tutorial, we will explain how to create, customize, and upload an item project using the XRift CLI.

## Prerequisites

- Node.js 18.0.0 or higher
- XRift CLI installed

## Step 1: Create a Project

Create a new item project:

```bash
xrift create item my-first-item
cd my-first-item
```

You can set the project name and item title/description interactively. You can skip this with the `-y` option.

By default, [WebXR-JP/xrift-item-template](https://github.com/WebXR-JP/xrift-item-template) is used. You can specify a different template with `-t <repository>`.

## Step 2: Start the Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser to preview the item locally. The development server uses `src/dev.tsx` as its entry point and provides a `Canvas`, `Physics`, and `OrbitControls` environment to inspect your item.

## Step 3: Understand the Template Layout

The generated project comes with a working sample item:

```
my-first-item/
├── src/
│   ├── Item.tsx          # The item component itself
│   ├── index.tsx         # Module Federation export entry
│   └── dev.tsx           # Dev server entry (not included in production build)
├── xrift.json            # Item configuration
├── vite.config.ts        # Build & Module Federation setup
└── package.json
```

### What the Template Includes

- **A rotating crystal** — sample animation using `useFrame`
- **A base with physics** — a fixed-type `RigidBody` with a collider
- **A point light** — emulates crystal glow

## Step 4: Customize the Item

Edit `src/Item.tsx` to customize your item. Items export an `Item` component that receives `position` and `scale` from the host world.

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
Keep the shape of `ItemProps` (accepting `position` and `scale`). The XRift platform passes transforms to your item through these props when it is placed.
:::

### Add Physics

Items use the same [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) physics engine as worlds:

```tsx
import { RigidBody } from '@react-three/rapier';

{/* Static object that doesn't move */}
<RigidBody type="fixed" colliders="cuboid">
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="gray" />
  </mesh>
</RigidBody>

{/* Object affected by gravity and collisions */}
<RigidBody type="dynamic">
  <mesh>
    <sphereGeometry args={[0.5]} />
    <meshStandardMaterial color="red" />
  </mesh>
</RigidBody>
```

### Using Three.js Addons

When using Three.js addon modules such as `DRACOLoader` or `GLTFLoader`, import them from `three/addons/*`:

```tsx
// OK: kept in the shared chunk
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
```

This prevents addon modules from being inlined into the item bundle. If inlined, `@xrift/code-security` may flag `new Worker()` inside them as a critical violation. See [Shared Dependencies](/guides/shared-dependencies) for details.

## Step 5: Run a Security Check

You can run a code security check before uploading:

```bash
xrift check item
```

To run the build alongside the check:

```bash
xrift check item --build
```

## Step 6: Build and Upload

Create a production build:

```bash
npm run build
```

Upload to the XRift platform:

```bash
xrift upload item
```

On the first upload, you will be prompted for a title (required) and description (optional). If `item.title` is already set in `xrift.json`, the prompt is skipped.

After uploading, a code review runs automatically (usually completed in a few minutes). Once approved, the item is published and becomes available from your inventory.

## Next Steps

- [xrift.json Configuration (Item)](/item/configuration) for configuration details
- [CLI Commands](/cli/commands) for available commands
- [Shared Dependencies](/guides/shared-dependencies) for how shared dependencies work
