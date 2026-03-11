---
sidebar_position: 2
---

# xrift.json Configuration

Configure your world settings in `xrift.json` at the project root.

## Configuration Example

```json
{
  "world": {
    "distDir": "./dist",
    "title": "My World",
    "description": "This is a sample world",
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

## Configuration Items

| Field | Type | Description |
|-----------|-----|------|
| `distDir` | string | Directory of build artifacts to upload |
| `title` | string | World title (if not set, input required at upload) |
| `description` | string | World description (if not set, input required at upload) |
| `thumbnailPath` | string | Path to thumbnail image (relative to `distDir`) |
| `buildCommand` | string | Build command to execute before upload |
| `ignore` | string[] | Glob patterns of files to exclude from upload |
| `physics` | object | World physics settings |
| `permissions` | object | Permissions required by the world |

## Details of Each Item

### distDir

Specifies the directory to upload.

```json
{
  "world": {
    "distDir": "./dist"
  }
}
```

### title / description

Sets the world title and description. These are optional, but if set, they will be used as default values in the prompt when running `xrift upload world`.

```json
{
  "world": {
    "title": "My Awesome World",
    "description": "An interactive 3D world"
  }
}
```

### thumbnailPath

Specifies the thumbnail image for the world. Specify as a relative path from `distDir`.

```json
{
  "world": {
    "distDir": "./dist",
    "thumbnailPath": "thumbnail.png"
  }
}
```

In this case, `dist/thumbnail.png` will be used as the thumbnail.

**Recommended Size**: 1280x720 pixels

### buildCommand

A command that is automatically executed before uploading when running `xrift upload world`.

```json
{
  "world": {
    "buildCommand": "npm run build"
  }
}
```

Setting this eliminates the need to build manually.

### ignore

Specifies files to exclude from upload using glob patterns.

```json
{
  "world": {
    "ignore": [
      "**/.DS_Store",
      "**/Thumbs.db",
      "**/*.map"
    ]
  }
}
```

### physics

You can customize the physics behavior of the world.

| Setting | Type | Default | Description |
|------|-----|---------|------|
| `gravity` | number | 9.81 | Strength of gravity (Positive value, Earth=9.81, Moon=1.62) |
| `allowInfiniteJump` | boolean | true | Whether to allow infinite jumping |

#### Basic Settings

```json
{
  "world": {
    "physics": {
      "gravity": 9.81,
      "allowInfiniteJump": true
    }
  }
}
```

#### Athletic World (No Infinite Jump)

```json
{
  "world": {
    "physics": {
      "allowInfiniteJump": false
    }
  }
}
```

#### Low Gravity World (Moon Gravity)

```json
{
  "world": {
    "physics": {
      "gravity": 1.62
    }
  }
}
```

#### High Gravity World (Jupiter Gravity)

```json
{
  "world": {
    "physics": {
      "gravity": 24.79
    }
  }
}
```

### permissions

Declares the permissions required by the world. Declared permissions are shown to users as an approval screen when entering an instance.

| Setting | Type | Description |
|---------|------|-------------|
| `allowedDomains` | string[] | List of external domains the world communicates with |
| `allowedCodeRules` | string[] | List of code security rules to relax |

#### Basic Settings

```json
{
  "world": {
    "permissions": {
      "allowedDomains": ["api.example.com", "cdn.example.com"],
      "allowedCodeRules": ["no-storage-access", "no-network-without-permission"]
    }
  }
}
```

#### allowedDomains

Specifies external domains that the world's code communicates with. Communication to unauthorized domains is detected and blocked by `@xrift/code-security` code analysis.

#### allowedCodeRules

Declares relaxation of code security rules defined by `@xrift/code-security`. By default, unsafe operations (eval, external communication, storage access, etc.) are blocked, but can be relaxed here when required for the world's functionality.

##### Dynamic Code Execution

| Rule | Description |
|------|-------------|
| `no-eval` | Allows `eval()` to execute strings as code |
| `no-new-function` | Allows `Function` constructor to dynamically generate code |
| `no-string-timeout` | Allows `setTimeout`/`setInterval` with string arguments |
| `no-javascript-blob` | Allows creating JavaScript Blobs for dynamic script execution |

##### Obfuscation

| Rule | Description |
|------|-------------|
| `no-obfuscation` | Allows obfuscated code patterns |

##### Network

| Rule | Description |
|------|-------------|
| `no-network-without-permission` | Allows network requests (fetch, WebSocket, etc.) |
| `no-unauthorized-domain` | Allows connections to domains not in `allowedDomains` |
| `no-rtc-connection` | Allows WebRTC peer connections |
| `no-external-import` | Allows importing JavaScript modules from external URLs |

##### Storage & Data

| Rule | Description |
|------|-------------|
| `no-storage-access` | Allows localStorage/sessionStorage access |
| `no-cookie-access` | Allows cookie read/write |
| `no-indexeddb-access` | Allows IndexedDB access |
| `no-storage-event` | Allows listening to storage events from other tabs |

##### DOM

| Rule | Description |
|------|-------------|
| `no-dangerous-dom` | Allows innerHTML and script element injection |

##### Browser APIs

| Rule | Description |
|------|-------------|
| `no-navigator-access` | Allows access to geolocation, camera, microphone, clipboard, etc. |

##### Global Pollution

| Rule | Description |
|------|-------------|
| `no-sensitive-api-override` | Allows overriding security-critical APIs (fetch, etc.) |
| `no-global-override` | Allows overriding global objects (window, document, etc.) |
| `no-prototype-pollution` | Allows modifying built-in object prototypes |