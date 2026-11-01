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
    "outputBufferType": "UnsignedByteType",
    "permissions": {
      "allowedDomains": ["api.example.com"],
      "allowedCodeRules": ["no-network-without-permission"]
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
| `camera` | object | World camera clipping settings |
| `outputBufferType` | string | WebGLRenderer output buffer type |
| `items` | string[] | IDs of items placed in the world from the start (`<Item itemId>`) |
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
| `allowFly` | boolean | true | Whether to allow fly mode |
| `respawnThreshold` | number | -10 | Players who fall below this height (Y) are sent back to the spawn point |

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

#### Disable Fly Mode

Use this for athletic courses, mazes, and other worlds where flying over obstacles would break the experience.

```json
{
  "world": {
    "physics": {
      "allowFly": false
    }
  }
}
```

#### Change the Respawn Height

If your floor sits below -10, or your world has players falling a long way on purpose, lower the respawn height.

```json
{
  "world": {
    "physics": {
      "respawnThreshold": -100
    }
  }
}
```

:::warning
Keep `respawnThreshold` below your spawn point. If it is higher, players fall below it again as soon as they respawn and get stuck respawning over and over.
:::

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

### outputBufferType

Specifies the output buffer type for WebGLRenderer. This affects the precision of post-processing and HDR rendering.

| Value | Description |
|-------|-------------|
| `UnsignedByteType` | 8-bit integer (default, suitable for standard rendering) |
| `HalfFloatType` | 16-bit float (suitable for HDR and post-processing) |
| `FloatType` | 32-bit float (highest precision, higher GPU cost) |

```json
{
  "world": {
    "outputBufferType": "HalfFloatType"
  }
}
```

### items

Declares the IDs of items placed in the world from the start (`<Item itemId>`). Only the IDs listed here are loaded in production (the preload on entry and the resolution of bundle URLs for visitors both use this list).

```json
{
  "world": {
    "items": [
      "2a69ded4-d913-4359-8c1f-eac83a982b0c",
      "a454d074-7f1c-416a-b181-19a63b79f432"
    ]
  }
}
```

- You can only declare **items you created or added to your library** (acquire them on the marketplace). Declaring anything else fails the upload
- Up to 50 items
- When the author publishes a new version, the items placed in the world update automatically
- `xrift upload` scans the built bundle for `<Item itemId>` and compares it with this list; if an ID is missing, the upload stops before anything is sent. Use `xrift upload --skip-item-scan` only when an ID that is not used by `<Item>` was picked up by mistake
- During local development (`xriftDev()`), undeclared IDs show the same "not declared" placeholder as production. Add the ID and reload the page

See [`Item` in world-components](../world-components/components/index.md#item) for how to place them.

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
      "allowedCodeRules": ["no-navigator-access", "no-network-without-permission"]
    }
  }
}
```

#### allowedDomains

Specifies external domains that the world's code communicates with. Communication to unauthorized domains is detected and blocked by `@xrift/code-security` code analysis.

#### allowedCodeRules

Declares which rules of the `@xrift/code-security` code check should be relaxed because the world needs them. Declared rules are shown on the approval screen when entering, and visitors enter after consenting. Only the rules listed under "Relaxable rules" can be relaxed.

##### Relaxable rules

| Rule | What it relaxes |
|------|-------------|
| `no-new-function` | Dynamic code generation with the `Function` constructor |
| `no-string-timeout` | String arguments to `setTimeout` / `setInterval` |
| `no-javascript-blob` | Dynamic script generation with JavaScript Blobs |
| `no-obfuscation` | Obfuscated code patterns |
| `no-network-without-permission` | fetch, WebSocket, etc. whose destination cannot be read from the code (requests with a string destination are checked against `allowedDomains`) |
| `no-rtc-connection` | WebRTC (`RTCPeerConnection`) connections ([see below](#using-webrtc)) |
| `no-dangerous-dom` | innerHTML and script element injection |
| `no-navigator-access` | Access to geolocation, camera, microphone, clipboard, etc. |
| `no-global-override` | Overriding global objects (window, document, etc.) |

##### Rules that cannot be relaxed

The following rules are not relaxed even if listed in `allowedCodeRules`. Any violation makes the upload fail.

| Rule | What it forbids |
|------|-------------|
| `no-eval` | Executing strings as code with `eval()` |
| `no-external-import` | Importing JavaScript modules from external URLs |
| `no-storage-access` | Access to localStorage / sessionStorage |
| `no-cookie-access` | Reading and writing cookies |
| `no-indexeddb-access` | Access to IndexedDB |
| `no-storage-event` | Listening to storage events from other tabs |
| `no-sensitive-api-override` | Overriding security-critical APIs such as fetch |
| `no-prototype-pollution` | Modifying built-in object prototypes |

To persist data, use [`useWorldStorage`](../world-components/components/index.md#useworldstorage).

Requests to destinations not in `allowedDomains` (`no-unauthorized-domain`) cannot be allowed by relaxing a rule either. Add the destination to `allowedDomains`.

##### Using WebRTC

Using `RTCPeerConnection` requires declaring `no-rtc-connection`. WebRTC reveals your IP address to the peer, so visitors are asked to consent to a "WebRTC connection" on the approval screen when entering.

```json
{
  "world": {
    "permissions": {
      "allowedDomains": ["stun.l.google.com"],
      "allowedCodeRules": ["no-rtc-connection"]
    }
  }
}
```

- The hosts of the STUN / TURN servers in `iceServers` are checked against `allowedDomains`. The same applies to STUN / TURN servers a library uses by default, so list those hosts too
- If you pass `iceServers` from a variable or an API response, the destinations cannot be verified, so you also need to declare `no-network-without-permission`
