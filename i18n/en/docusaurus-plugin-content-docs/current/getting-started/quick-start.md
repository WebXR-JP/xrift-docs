---
sidebar_position: 2
---

# Quick Start

Here are the steps to create a world project using XRift CLI and start the development server.

## Creating a New Project

```bash
xrift create my-world
```

You will configure the project name and other settings interactively. You can skip the interaction with the `-y` option.

## Project Structure

The created project already contains a sample world:

```
my-world/
├── src/
│   ├── World.tsx        # Main world component
│   └── components/      # Sample components
├── public/              # Assets (models, textures, etc.)
├── package.json
└── vite.config.ts
```

## Starting the Development Server

```bash
cd my-world
npm run dev
```

Open `http://localhost:5173` in your browser to see the sample world.

## Next Steps

- Learn how to customize in [Create Your First World](/guides/create-first-world)
- Learn how to use components in [World Components](/world-components/components/)
- Check available commands in [CLI Command Reference](/cli/commands)