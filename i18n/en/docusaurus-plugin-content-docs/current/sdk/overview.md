---
sidebar_position: 1
---

# SDK Overview

`@xrift/sdk` is a universal SDK for the XRift platform. It provides API operations and file uploads for worlds and items, working in both Node.js and browser environments.

## Features

- **Universal**: Works in both Node.js and browser
- **Zero dependencies**: Based on fetch API, no additional packages needed
- **TypeScript**: Full type definitions included
- **ESM + CJS**: Dual build support
- **Integrated upload**: Hash calculation, signed URL retrieval, upload, and completion notification in one call

## Installation

```bash
npm install @xrift/sdk
```

## Basic Usage

### Initializing the Client

```typescript
import { XriftClient } from '@xrift/sdk';

const client = new XriftClient({
  token: 'your-api-token',
});
```

### Uploading a World

```typescript
import { readFile } from 'node:fs/promises';
import { XriftClient, getMimeType } from '@xrift/sdk';

const client = new XriftClient({ token: 'your-api-token' });

// Read the file
const data = new Uint8Array(await readFile('scene.glb'));

const result = await client.worlds.upload(
  [
    {
      remotePath: 'scene.glb',
      data,
      size: data.byteLength,
      contentType: getMimeType('scene.glb'),
    },
  ],
  {
    name: 'My World',
    description: 'A sample world',
  },
);

console.log(`World uploaded: ${result.worldId}`);
```

### Uploading an Item

```typescript
const result = await client.items.upload(
  [
    {
      remotePath: 'model.glb',
      data,
      size: data.byteLength,
      contentType: getMimeType('model.glb'),
    },
  ],
  {
    name: 'My Item',
  },
);

console.log(`Item uploaded: ${result.itemId}`);
```

### Browser Usage

```typescript
// Get data from File API
const fileInput = document.querySelector<HTMLInputElement>('#file');
const file = fileInput.files[0];
const data = new Uint8Array(await file.arrayBuffer());

const result = await client.worlds.upload(
  [
    {
      remotePath: file.name,
      data,
      size: data.byteLength,
      contentType: file.type || getMimeType(file.name),
    },
  ],
  {
    name: 'Browser Upload World',
  },
);
```

### Tracking Progress

```typescript
const result = await client.worlds.upload(files, {
  name: 'My World',
  onProgress: (progress) => {
    console.log(`${progress.completed}/${progress.total}: ${progress.currentFile}`);
  },
});
```

## Differences from CLI

| | xrift-cli | @xrift/sdk |
|---|---|---|
| Use case | Local development & deployment | Application integration |
| Input | Local file paths | Binary data (ArrayBuffer / Uint8Array) |
| Environment | Node.js only | Node.js + Browser |
| Authentication | Obtained via `xrift login` | Token specified directly |

## Next Steps

- [API Reference](/sdk/api-reference) - Full API specification
- [Public API v1](/public-api/v1) - REST API specification
