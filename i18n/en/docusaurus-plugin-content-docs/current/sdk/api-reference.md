---
sidebar_position: 2
---

# API Reference

Complete API reference for `@xrift/sdk`.

## XriftClient

The entry point of the SDK. Provides access to the Worlds API and Items API.

```typescript
import { XriftClient } from '@xrift/sdk';

const client = new XriftClient({
  token: 'your-api-token',
  baseUrl: 'https://api.xrift.net', // optional
  timeout: 30000,                    // optional (ms)
});
```

### Constructor

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | Yes | - | API authentication token |
| `baseUrl` | `string` | No | `https://api.xrift.net` | API base URL |
| `timeout` | `number` | No | `30000` | Request timeout (ms) |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `worlds` | `WorldsApi` | Worlds API |
| `items` | `ItemsApi` | Items API |

---

## WorldsApi

API for creating and uploading worlds. Access via `client.worlds`.

### `upload(files, options)`

Integrated upload method. Executes creation, hash calculation, URL retrieval, upload, and completion notification in one call.

```typescript
const result = await client.worlds.upload(files, options);
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `files` | `UploadFile[]` | Array of files to upload |
| `options` | `WorldUploadOptions` | Upload options |

**WorldUploadOptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `worldId` | `string` | No | Existing world ID (creates new if omitted) |
| `name` | `string` | Yes | World name |
| `description` | `string` | No | Description |
| `thumbnailPath` | `string` | No | Thumbnail path |
| `physics` | `PhysicsConfig` | No | Physics settings |
| `camera` | `CameraConfig` | No | Camera settings |
| `permissions` | `WorldPermissions` | No | Permission settings |
| `outputBufferType` | `OutputBufferType` | No | Output buffer type |
| `onProgress` | `(progress: UploadProgress) => void` | No | Progress callback |

**Returns: `WorldUploadResult`**

| Field | Type | Description |
|-------|------|-------------|
| `worldId` | `string` | World ID |
| `versionId` | `string` | Version ID |
| `versionNumber` | `number` | Version number |
| `contentHash` | `string` | Content hash |
| `files` | `UploadFile[]` | Uploaded files |

---

## ItemsApi

API for creating and uploading items. Access via `client.items`.

### `upload(files, options)`

Integrated upload method for items.

```typescript
const result = await client.items.upload(files, options);
```

**ItemUploadOptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `itemId` | `string` | No | Existing item ID (creates new if omitted) |
| `name` | `string` | Yes | Item name |
| `description` | `string` | No | Description |
| `thumbnailPath` | `string` | No | Thumbnail path |
| `permissions` | `ItemPermissions` | No | Permission settings |
| `onProgress` | `(progress: UploadProgress) => void` | No | Progress callback |

**Returns: `ItemUploadResult`**

| Field | Type | Description |
|-------|------|-------------|
| `itemId` | `string` | Item ID |
| `versionId` | `string` | Version ID |
| `versionNumber` | `number` | Version number |
| `contentHash` | `string` | Content hash |
| `files` | `UploadFile[]` | Uploaded files |

---

## Error Classes

The SDK provides the following error hierarchy.

```
XriftSdkError (base class)
├── XriftApiError (API errors)
│   └── XriftAuthError (authentication error: 401)
└── XriftNetworkError (network errors)
```

### XriftApiError

Thrown when the API returns an error response.

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Error message |
| `statusCode` | `number` | HTTP status code |
| `responseBody` | `unknown` | Response body |

### XriftAuthError

Thrown on authentication failure (HTTP 401). Extends `XriftApiError`.

### XriftNetworkError

Thrown on network connection errors.

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Error message |
| `cause` | `Error` | Underlying error |

### Error Handling Example

```typescript
import {
  XriftAuthError,
  XriftApiError,
  XriftNetworkError,
} from '@xrift/sdk';

try {
  await client.worlds.upload(files, options);
} catch (error) {
  if (error instanceof XriftAuthError) {
    console.error('Auth error: please check your token');
  } else if (error instanceof XriftApiError) {
    console.error(`API error (${error.statusCode}): ${error.message}`);
  } else if (error instanceof XriftNetworkError) {
    console.error('Network error:', error.message);
  }
}
```

---

## Utilities

### `calculateContentHash(files, configValues?)`

Calculates a SHA-256 based content hash (first 12 characters) from files and configuration values. Automatically uses `node:crypto` in Node.js and Web Crypto API in browsers.

```typescript
import { calculateContentHash } from '@xrift/sdk';

const hash = await calculateContentHash(
  [{ remotePath: 'scene.glb', data: fileData }],
  { physics: { gravity: -9.8 } },
);
```

### `getMimeType(filePath)`

Determines MIME type from a file path extension.

```typescript
import { getMimeType } from '@xrift/sdk';

getMimeType('scene.glb');    // 'model/gltf-binary'
getMimeType('texture.png');  // 'image/png'
getMimeType('unknown.xyz');  // 'application/octet-stream'
```

Supported extensions: `.glb`, `.gltf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.json`, `.js`, `.mjs`, `.html`, `.css`, `.txt`, `.bin`, `.wasm`, `.svg`, `.mp3`, `.ogg`, `.wav`, `.mp4`, `.webm`, `.ktx2`, `.basis`, `.hdr`, `.exr`

---

## Type Definitions

### Common Types

| Type | Description |
|------|-------------|
| `FileData` | `ArrayBuffer \| Uint8Array` — Binary file data |
| `UploadFile` | Upload file (remotePath, size, contentType, data) |
| `UploadProgress` | Progress info (completed, total, currentFile) |
| `PhysicsConfig` | Physics settings (gravity, allowInfiniteJump) |
| `CameraConfig` | Camera settings (near, far) |
| `OutputBufferType` | `'UnsignedByteType' \| 'HalfFloatType' \| 'FloatType'` |
| `SignedUrlResponse` | Signed URL response |

### World Types

| Type | Description |
|------|-------------|
| `WorldPermissions` | Permission settings (allowedDomains, allowedCodeRules) |
| `WorldUploadOptions` | Upload options |
| `WorldUploadResult` | Upload result |

### Item Types

| Type | Description |
|------|-------------|
| `ItemPermissions` | Permission settings (allowedDomains, allowedCodeRules) |
| `ItemUploadOptions` | Upload options |
| `ItemUploadResult` | Upload result |
