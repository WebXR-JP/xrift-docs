---
sidebar_position: 2
---

# xrift.json Configuration

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
      "allowedCodeRules": ["no-network-without-permission"]
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
      "allowedCodeRules": ["no-navigator-access", "no-network-without-permission"]
    }
  }
}
```

#### allowedDomains

Specifies external domains the item's code communicates with. `@xrift/code-security` statically analyzes the code and blocks communication to domains not listed here.

#### allowedCodeRules

Declares which rules of the `@xrift/code-security` code check should be relaxed because the item needs them. Only the rules listed under "Relaxable rules" can be relaxed.

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

Requests to destinations not in `allowedDomains` (`no-unauthorized-domain`) cannot be allowed by relaxing a rule either. Add the destination to `allowedDomains`.

##### Using WebRTC

Using `RTCPeerConnection` requires declaring `no-rtc-connection`. WebRTC reveals your IP address to the peer, so users are asked to consent to a "WebRTC connection" in the confirmation dialog before the item runs in an instance.

```json
{
  "item": {
    "permissions": {
      "allowedDomains": ["stun.l.google.com"],
      "allowedCodeRules": ["no-rtc-connection"]
    }
  }
}
```

- The hosts of the STUN / TURN servers in `iceServers` are checked against `allowedDomains`. The same applies to STUN / TURN servers a library uses by default, so list those hosts too
- If you pass `iceServers` from a variable or an API response, the destinations cannot be verified, so you also need to declare `no-network-without-permission`
