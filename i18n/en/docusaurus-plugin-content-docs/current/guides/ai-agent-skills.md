---
sidebar_position: 3
---

# Building Worlds with AI Agents

If you develop XRift worlds and items with an AI coding agent such as Claude Code or Cursor, install [xrift-skills](https://github.com/WebXR-JP/xrift-skills). These [Agent Skills](https://github.com/vercel-labs/skills) teach the agent XRift-specific APIs and rules, so it can use `@xrift/world-components` and `@xrift/sdk` correctly.

## Installation

Run the following command in your project directory:

```bash
npx skills add WebXR-JP/xrift-skills
```

Supported agents: Claude Code, Cursor, Copilot, Codex, and 40+ others.

:::tip
Projects created with `xrift create world` ([xrift-world-template](https://github.com/WebXR-JP/xrift-world-template)) already include the `xrift-world` skill for world development.
:::

## Included Skills

### xrift-world

A guide for building WebXR worlds on the XRift platform.

- Critical rules, project overview, configuration, commands, troubleshooting
- Full specification of `@xrift/world-components` hooks, components, and constants
- Code templates for GLB models, textures, Skybox, interactions, and more
- Type definitions for `User`, `PlayerMovement`, `VRTrackingData`, etc.

### xrift-sdk

A guide for programmatically uploading worlds and items with `@xrift/sdk`.

- `XriftClient` initialization, upload flows, error handling
- Full specification of `XriftClient`, `WorldsApi`, `ItemsApi`, error classes, and utility functions
- Code examples for Node.js and browser environments
- Complete type definitions for all SDK interfaces

## Updating

To update installed skills to the latest version, run:

```bash
npx skills update
```

When you upgrade `@xrift/world-components` or `@xrift/sdk`, update the skills as well.

## Resources

- [xrift-skills (GitHub)](https://github.com/WebXR-JP/xrift-skills)
- [Agent Skills](https://github.com/vercel-labs/skills)
