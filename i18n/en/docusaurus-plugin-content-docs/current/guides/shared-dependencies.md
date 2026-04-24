---
sidebar_position: 2
---

# Shared Packages

Packages declared in the `shared` section of Module Federation in your world or item's `vite.config.ts` are resolved from the host (xrift.net) side. This page lists all packages provided as shared by the host.

## Package List

| Package | Version Requirement | Description |
|---------|-------------------|-------------|
| `react` | ^19.0.0 | React |
| `react-dom` | ^19.0.0 | React DOM |
| `react-dom/client` | - | React DOM client |
| `react/jsx-runtime` | ^19.0.0 | JSX runtime |
| `three` | ^0.176.0 | Three.js |
| `three/addons/loaders/GLTFLoader.js` | - | GLTF model loader |
| `three/addons/loaders/DRACOLoader.js` | - | Draco compressed mesh loader |
| `three/addons/loaders/KTX2Loader.js` | - | KTX2 texture loader |
| `@react-three/fiber` | ^9.0.0 | React Three Fiber |
| `@react-three/rapier` | ^2.0.0 | Physics engine |
| `@react-three/drei` | ^10.0.0 | Three.js helpers |
| `@react-three/uikit` | ^1.0.0 | 3D UI |
| `@pmndrs/uikit` | ^1.0.0 | UIKit core |
| `@xrift/world-components` | ^0.1.0 | XRift world components |

## Notes on three/addons

Sharing the entire `three/addons` barrel file would include `eval` from Lottie in the bundle, so packages are shared at the **subpath level**.

You also need to declare shared packages using subpaths like `three/addons/loaders/DRACOLoader.js` on the world or item side.

:::caution
Do not specify `three/addons` directly as shared. You must specify it at the subpath level.
:::

## Configuration Example

```js
// vite.config.ts
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        'react-dom/client': {
          singleton: true,
        },
        'react/jsx-runtime': {
          singleton: true,
        },
        three: {
          singleton: true,
          requiredVersion: '^0.176.0',
        },
        'three/addons/loaders/DRACOLoader.js': {
          singleton: true,
        },
        '@react-three/fiber': {
          singleton: true,
          requiredVersion: '^9.3.0',
        },
        '@react-three/rapier': {
          singleton: true,
          requiredVersion: '^2.1.0',
        },
        '@react-three/drei': {
          singleton: true,
          requiredVersion: '^10.7.3',
        },
        '@xrift/world-components': {
          singleton: true,
          requiredVersion: '^0.1.0',
        },
      },
    }),
  ],
});
```
