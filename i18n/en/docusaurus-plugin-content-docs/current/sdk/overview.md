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

Place an `xrift.json` in your project and call `uploadWorldFromDirectory` to upload.

```typescript
import { uploadWorldFromDirectory } from '@xrift/sdk/node';

const result = await uploadWorldFromDirectory('./my-project', {
  token: 'your-api-token',
  onProgress: (progress) => {
    console.log(`${progress.completed}/${progress.total}: ${progress.currentFile}`);
  },
});

console.log(`World uploaded: ${result.worldId} v${result.versionNumber}`);
```

This automatically handles reading xrift.json, collecting files from distDir, applying ignore patterns, hash calculation, and uploading.

For more fine-grained control, see the low-level `XriftClient` API in the [API Reference](/sdk/api-reference).

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
