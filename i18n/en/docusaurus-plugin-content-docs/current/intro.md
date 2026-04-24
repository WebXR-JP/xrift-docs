---
sidebar_position: 1
slug: /
---

# What is XRift?

XRift is a platform for easily building immersive 3D worlds using WebXR.

## What You Can Develop

### Worlds

With XRift, you can create your own unique 3D worlds. Using a component library based on React Three Fiber, you can build interactive spaces compatible with VR/AR.

- [Start World Development](/getting-started/installation)
- [World Components](/world-components/components/)

### Items

Create reusable 3D components that can be placed inside worlds. Uploaded items are available from your inventory in any world.

- [Create Your First Item](/item/create-first-item)
- [Item Development Overview](/item/overview)

## Tools

### xrift-cli

A command-line tool. It handles project creation, uploading to the XRift platform, and more.

- [CLI Documentation](/cli/overview)
- [GitHub](https://github.com/WebXR-JP/xrift-cli)

### @xrift/sdk

A universal SDK for the XRift platform. Provides API operations and file uploads for worlds and items in both Node.js and browser environments.

- [SDK Documentation](/sdk/overview)
- [GitHub](https://github.com/WebXR-JP/xrift-sdk)

### xrift-world-components

A React component library for building WebXR worlds.

- [Component List](/world-components/components/)
- [GitHub](https://github.com/WebXR-JP/xrift-world-components)

## Quick Start

```bash
# Install XRift CLI
npm install -g @xrift/cli

# Create a new world
xrift create world my-world

# Navigate to the project and start the development server
cd my-world
npm run dev
```

For details, please refer to [Getting Started](/getting-started/installation).