---
sidebar_position: 3
---

# xrift.json Configuration (Item)

Item settings are stored in `xrift.json` at the project root, under the `item` key (the same file used for worlds).

## Example

```json
{
  "item": {
    "distDir": "./dist",
    "title": "My Item",
    "description": "A sample item",
    "thumbnailPath": "thumbnail.png",
    "buildCommand": "npm run build",
    "ignore": [
      "**/.DS_Store",
      "**/Thumbs.db",
      "**/*.map"
    ],
    "permissions": {
      "allowedDomains": ["api.example.com"],
      "allowedCodeRules": ["no-storage-access"]
    }
  }
}
```

## Fields

| Field | Type | Description |
|-----------|-----|------|
| `distDir` | string | The directory containing the build artifacts to upload |
| `title` | string | Item title (prompted at upload time if not set) |
| `description` | string | Item description (prompted at upload time if not set) |
| `thumbnailPath` | string | Path to the thumbnail image (relative to `distDir`) |
| `buildCommand` | string | Build command run before upload |
| `ignore` | string[] | Glob patterns of files excluded from the upload |
| `permissions` | object | Permissions required by the item |

:::info Difference from World Configuration
Item configuration shares most fields with worlds, but `physics`, `camera`, and `outputBufferType` are **world-only**. Items do not use them.
:::

## Field Details

### distDir

The directory to upload. This is the build output directory that contains Module Federation's `remoteEntry.js`.

```json
{
  "item": {
    "distDir": "./dist"
  }
}
```

### title / description

Item title and description. These are optional, but when set they skip the corresponding prompts in `xrift upload item`.

```json
{
  "item": {
    "title": "My Awesome Item",
    "description": "An interactive 3D item"
  }
}
```

### thumbnailPath

Path to the item's thumbnail image, relative to `distDir`.

```json
{
  "item": {
    "distDir": "./dist",
    "thumbnailPath": "thumbnail.png"
  }
}
```

In this case, `dist/thumbnail.png` is used as the thumbnail.

**Recommended size**: 512x512 pixels

### buildCommand

A command executed automatically before upload when running `xrift upload item`.

```json
{
  "item": {
    "buildCommand": "npm run build"
  }
}
```

Setting this removes the need to build manually before each upload.

### ignore

Glob patterns of files to exclude from the upload.

```json
{
  "item": {
    "ignore": [
      "**/.DS_Store",
      "**/Thumbs.db",
      "**/*.map"
    ]
  }
}
```

### permissions

Declares the permissions the item requires. Declared permissions are considered during review and apply when the item is used inside a world.

| Field | Type | Description |
|------|-----|------|
| `allowedDomains` | string[] | External domains the item communicates with |
| `allowedCodeRules` | string[] | Code security rules that need to be relaxed |

#### Basic Setup

```json
{
  "item": {
    "permissions": {
      "allowedDomains": ["api.example.com", "cdn.example.com"],
      "allowedCodeRules": ["no-storage-access", "no-network-without-permission"]
    }
  }
}
```

#### allowedDomains

Specifies external domains the item's code communicates with. `@xrift/code-security` statically analyzes the code and blocks communication to domains not listed here.

#### allowedCodeRules

Declares relaxations of code security rules defined by `@xrift/code-security`. By default, unsafe operations (eval, external communication, storage access, etc.) are blocked. Declare relaxations here when they are required by your item's functionality.

##### Dynamic Code Execution

| Rule | Description |
|--------|------|
| `no-eval` | Allow running code via `eval()` |
| `no-new-function` | Allow dynamic code generation via the `Function` constructor |
| `no-string-timeout` | Allow string arguments to `setTimeout`/`setInterval` |
| `no-javascript-blob` | Allow dynamic script generation via JavaScript Blobs |

##### Obfuscation

| Rule | Description |
|--------|------|
| `no-obfuscation` | Allow obfuscated code patterns |

##### Network Communication

| Rule | Description |
|--------|------|
| `no-network-without-permission` | Allow network communication such as fetch and WebSocket |
| `no-unauthorized-domain` | Allow connections to domains not in `allowedDomains` |
| `no-rtc-connection` | Allow WebRTC peer connections |
| `no-external-import` | Allow loading JavaScript modules from external URLs |

##### Storage / Data

| Rule | Description |
|--------|------|
| `no-storage-access` | Allow access to localStorage / sessionStorage |
| `no-cookie-access` | Allow reading/writing cookies |
| `no-indexeddb-access` | Allow access to IndexedDB |
| `no-storage-event` | Allow observing storage change events from other tabs |

##### DOM Manipulation

| Rule | Description |
|--------|------|
| `no-dangerous-dom` | Allow `innerHTML` and inserting script elements |

##### Browser APIs

| Rule | Description |
|--------|------|
| `no-navigator-access` | Allow access to geolocation, camera, microphone, clipboard, etc. |

##### Global Pollution

| Rule | Description |
|--------|------|
| `no-sensitive-api-override` | Allow overriding security-sensitive APIs like fetch |
| `no-global-override` | Allow overriding global objects such as window / document |
| `no-prototype-pollution` | Allow modifying prototypes of built-in objects |
