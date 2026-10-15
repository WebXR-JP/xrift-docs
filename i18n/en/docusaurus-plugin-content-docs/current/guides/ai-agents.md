---
sidebar_position: 3
---

# Building Worlds with AI Agents

[xrift-skills](https://github.com/WebXR-JP/xrift-skills) is a set of [Agent Skills](https://github.com/vercel-labs/skills) for building XRift worlds and items with AI coding agents. By loading the `@xrift/world-components` API reference, code templates, and type definitions into your agent, it can generate code that follows XRift-specific rules.

Supported agents: Claude Code, Cursor, GitHub Copilot, Codex, and more (40+)

## Installation

Run the following command in your project root:

```bash
npx skills add WebXR-JP/xrift-skills
```

The skill files are placed inside your project, and supported agents will reference them automatically.

:::tip Starting from the template
Projects created with `xrift create world` ([xrift-world-template](https://github.com/WebXR-JP/xrift-world-template)) already include the `xrift-world` skill. You can hand tasks to your AI agent right away without any additional installation.
:::

## Updating

To update installed skills to the latest version, run:

```bash
npx skills update
```

## Included Skills

### xrift-world

A guide for building WebXR worlds on the XRift platform.

- **SKILL.md** - Critical rules, project overview, configuration, commands, troubleshooting
- **references/api-reference.md** - Full specification of `@xrift/world-components` hooks, components, and constants
- **references/code-templates.md** - Code templates for GLB models, textures, Skybox, interactions, and more
- **references/type-definitions.md** - Type definitions for User, PlayerMovement, VRTrackingData, etc.

### xrift-sdk

A guide for programmatically uploading worlds and items with [`@xrift/sdk`](/sdk/overview).

- **SKILL.md** - Critical rules, XriftClient initialization, upload flows, error handling
- **references/api-reference.md** - Full specification of XriftClient, WorldsApi, ItemsApi, error classes, and utility functions
- **references/code-templates.md** - Code examples for Node.js and browser environments
- **references/type-definitions.md** - Complete type definitions for all SDK interfaces

## Example Usage

In a project with the skills installed, ask your agent something like:

```
Load public/models/tree.glb and place it 5m in front of the player
```

The agent will consult the code templates and API reference in the skill and generate code that follows the `@xrift/world-components` conventions.

## Resources

- [xrift-skills (GitHub)](https://github.com/WebXR-JP/xrift-skills)
- [Agent Skills Directory](https://skills.sh)
- [Create Your First World](/guides/create-first-world)
