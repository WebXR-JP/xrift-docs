---
sidebar_position: 3
---

# Build Your First World with AI

A walkthrough for building and publishing a world by asking an AI coding agent in plain language. You can follow it even if you have never written code yourself. The agent also runs the setup commands for you.

## What You Need

- [Node.js](https://nodejs.org/) 18.0.0 or later
- [Git](https://git-scm.com/) (so you can undo work)
- An AI coding agent (chosen in the next section)
- An [XRift](https://xrift.net) account (used when you publish)

## Choose an Agent

| Agent | Cost | Good for |
|------|------|------|
| [OpenCode Desktop](https://opencode.ai/download) | Free to start | Trying it out first (recommended) |
| [Claude Code](https://claude.com/claude-code) / [Codex](https://openai.com/codex/) | Paid plan | People who already subscribe, or want to ask for harder things |

**OpenCode Desktop** is an app for macOS, Windows, and Linux that comes with free models you can use without creating an account. This page uses OpenCode Desktop as the example, but the prompts and the flow are the same with Claude Code and Codex.

:::note About the free models
With the free models, what you type may be used to improve the model, and the models on offer change over time. See the [OpenCode documentation](https://opencode.ai/docs/zen/) for details.
:::

## Step 1: Create a Folder and Open It in the Agent

1. Download and install [OpenCode Desktop](https://opencode.ai/download)
2. Create an empty folder for your world (for example, `my-world`)
3. Open that folder in OpenCode Desktop

## Step 2: Ask the Agent to Set Things Up

Paste the following prompt as it is. The agent installs the XRift CLI, creates the project, and installs XRift knowledge ([xrift-skills](/guides/ai-agents)).

```text
Set up an XRift world project. Run the following steps in order. If a step fails, find the cause and fix it.

1. Install the XRift CLI with `npm install -g @xrift/cli`
2. Create a world project in this folder with `xrift create world my-world --here -y`
3. Install the XRift skills with `npx skills add WebXR-JP/xrift-skills -y`
4. Run `git init` and commit everything so far
5. Start the dev server with `npm run dev` and tell me the URL to open in the browser

When you are done, read the installed xrift-world skill and AGENTS.md, and summarize in 3 lines the rules to follow when building a world. Always follow those rules from now on.
```

When the agent asks whether it may run a command, check what it is and allow it.

:::tip If you already have a project
To install only the skills, paste this prompt.

```text
Run `npx skills add WebXR-JP/xrift-skills -y` to install the XRift skills. Then read the xrift-world skill and follow it from now on.
```
:::

## Step 3: View the World

Open the URL the agent gave you (usually `http://localhost:5173`) in your browser to see the sample world.

| Action | Key |
|------|------|
| Look | Click the screen, then move the mouse |
| Move | W / A / S / D |
| Jump | Space |
| Interact | Aim and click |
| Release the mouse | ESC |

The browser updates automatically when files change.

## Step 4: Ask for What You Want

Start with something small.

```text
Place a red cube 3m in front of the spawn point
```

Go back to the browser. If the cube is there, it worked. Keep going with requests like these.

```text
Make the cube change color each time it is clicked, and make everyone see the same color
```

```text
Load public/tree.glb and place it at the four corners of the floor
```

To use 3D models or images, put the files in the `public/` folder first, then tell the agent the file name.

## Tips for Asking

- **Ask for one thing at a time** — Instead of "build a plaza, add chairs, and play music," ask for each one and check the browser after each
- **Describe what you see** — "The chair is sunk into the floor," "a bit more to the right," "twice as big." Saying what is on screen is enough
- **Paste errors as they are** — If the screen goes blank or red text appears, copy the message, paste it, and ask the agent to fix it
- **Record what works** — When you like the result, ask "commit this." If things break later, "go back to the last commit" restores it
- **Say which devices matter** — XRift worlds are opened from PC, smartphones, and VR. Adding "make it work on smartphones too" helps ([Supported Devices](/guides/multi-device))

## Step 5: Publish

You can ask the agent to publish, too.

```text
I want to publish this world to XRift. Log in with `xrift login`, then run `xrift upload world`. Ask me whenever input is needed.
```

Logging in opens the browser, where you sign in with your XRift account. The first time, you are asked for a title and description. After the upload, the code is reviewed automatically (usually within a few minutes), and the world is published once it passes. If the review fails, paste the message to the agent and have it fix the problem.

## When Things Go Wrong

| Symptom | What to try |
|------|----------|
| What you asked for does not appear | Tell the agent it is not visible. It is often far away or below the floor |
| The screen went blank | Paste the errors shown in the browser and ask for a fix |
| The agent keeps going back and forth | Say "go back to the last commit" and split the request into smaller ones. Switching to a different model can also help |
| The code does not use XRift's way of doing things | Ask it to "run `npx skills update` to get the latest skills, then read them again" |

## Next Steps

- [Building Worlds with AI Agents](/guides/ai-agents) — what xrift-skills contains and how to update it
- [Create Your First World](/guides/create-first-world) — understand the code the agent writes
- [Supported Devices (PC, Mobile, VR)](/guides/multi-device) — make the world playable on every device
- [World Components](/world-components/components/) — mirrors, video, seats, and other parts you can ask for
