---
sidebar_position: 2
---

# Shared パッケージ一覧

ワールド・アイテムの `vite.config.ts` で Module Federation の `shared` に宣言したパッケージは、ホスト（xrift.net）側の shared から解決されます。このページでは、ホスト側で shared として提供されているパッケージの一覧を掲載しています。

:::info 正本について
ホストが貸し出すパッケージ名と、照合に使う版キーの正本は `@xrift/world-components` が export する `FEDERATION_SHARED_VERSIONS` です。本番（xrift.net）の共有スコープも、ローカル開発（`DevEnvironment`）の共有スコープも、この表から版キーを引きます。版キーは実際にインストールされているバージョンとは別の「札」で、原則変わりません。
:::

## パッケージ一覧

| パッケージ | バージョン要件 | 説明 |
|-----------|------------|------|
| `react` | ^19.0.0 | React |
| `react-dom` | ^19.0.0 | React DOM |
| `react-dom/client` | - | React DOM client |
| `react/jsx-runtime` | ^19.0.0 | JSX ランタイム |
| `three` | ^0.176.0 | Three.js |
| `three/addons/loaders/GLTFLoader.js` | - | GLTF モデルローダー |
| `three/addons/loaders/DRACOLoader.js` | - | Draco 圧縮メッシュローダー |
| `three/addons/loaders/KTX2Loader.js` | - | KTX2 テクスチャローダー |
| `@react-three/fiber` | ^9.0.0 | React Three Fiber |
| `@react-three/rapier` | ^2.0.0 | 物理演算 |
| `@react-three/drei` | ^10.0.0 | Three.js ヘルパー |
| `@react-three/uikit` | ^1.0.0 | 3D UI |
| `@pmndrs/uikit` | ^1.0.0 | UIKit コア |
| `@xrift/world-components` | ^0.1.0 | XRift ワールドコンポーネント |

## three/addons の注意点

`three/addons` バレルファイル全体を shared にすると Lottie 由来の `eval` がバンドルに含まれるため、**サブパス単位**で shared にしています。

ワールド・アイテム側でも `three/addons/loaders/DRACOLoader.js` のようにサブパスで shared を宣言する必要があります。

:::caution
`three/addons` をそのまま shared に指定しないでください。サブパス単位で指定する必要があります。
:::

## 設定例

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
