---
sidebar_position: 1
---

# Editing Worlds with an AI Agent

Ask your browser's AI agent to "line up ten chairs here" and the objects appear in your
XRift world. This works for worlds you can edit in the browser (EDITOR type), and is built
on [WebMCP](https://developer.chrome.com/docs/ai/webmcp).

Whatever the agent places shows up immediately for everyone in the instance and is saved to
the world. It is treated exactly like something you placed by hand, so you can undo it with
`Cmd/Ctrl+Z` and keep editing it from the inspector.

## What is WebMCP?

A page registers a list of "things you can do here", and an AI agent built into the browser
can call them. Instead of clicking around the screen, the agent calls the functions the page
exposes directly, so it does not depend on how the UI looks.

XRift exposes its world editing operations this way. If your agent supports WebMCP, the tools
are visible without installing anything.

## Requirements

| | |
|---|---|
| Browser | Chrome 149 or later |
| Site | `https://app.xrift.net` |
| World | A world editable in the browser (EDITOR type) |
| Permission | Owner of the world, or a user granted edit access |

Enter an instance, and if the edit button (🔧) is visible you are ready. **You do not need to
enter edit mode** — you can ask for a wall while walking around.

:::note

This ships through Chrome's Origin Trial, so it works on `app.xrift.net` as-is
**until November 17, 2026**. After that, further work may be needed depending on how the
specification is finalized.

:::

## What it can do

These are the operations the agent can see. You never need to name them yourself — describe
what you want and the agent picks the right ones.

| Tool | What it does |
|---|---|
| `list-placeable-types` | Look up placeable types and their dimension ranges |
| `get-scene` | Look up what is currently placed in the world |
| `get-viewer-context` | Look up where you are looking and how many objects can still be added |
| `list-world-images` | Look up the images uploaded to this world |
| `place-objects` | Place objects in bulk (up to 50 per call) |
| `update-objects` | Change position, rotation, scale, dimensions, color, material |
| `remove-objects` | Remove objects (groups are removed with their contents) |
| `group-objects` | Combine several objects into one group |
| `undo-last-agent-edit` | Undo what the AI just did |

Everything in edit mode's Add menu can be placed.

| Type | What to keep in mind |
|---|---|
| Box, floor, wall, sphere, cylinder | Dimensions, color, and material can be set |
| Image panel | **Only images already uploaded to this world** can be used. URLs from other sites cannot, so upload the image first from Asset Management in edit mode |
| Screen share display | Just place it. What it shows is decided by whoever shares their screen on the spot |
| Sit area | The spot you land on when you stand up can be set too |
| Spawn point | Only one per world. If one exists, it is moved instead of adding another. People enter standing on it, so ask for it to be placed on solid ground |

Portals and items have their own screens for choosing a destination or an inventory item, so
place those by hand.

## Tips for asking

**Say what the reference point is.** "At the world origin" uses absolute coordinates;
"where I'm looking right now" uses the surface under your crosshair; "at my feet" or
"in front of me" uses where you are standing. The last two save you from naming coordinates.

```
Build a 2m square stage on the floor in front of me
Put a wall 3m directly in front of me
```

If you are looking at the sky or off into the distance there is no surface to use, and where
you stand becomes the reference instead. The agent picks between them, so you do not need to
phrase it carefully.

**Use meters.** One unit is one meter in XRift. Real dimensions like "a 3m wall" or
"a sphere with a 50cm radius" pass straight through.

**Ask for things in bulk.** "Five chairs, 2m apart" is placed in a single call. That is faster
than one at a time, and it undoes in one step.

**Ask for a group when you are done.** "Group the bench you just made" turns it into a single
object you can move or delete as a unit.

**Roll it back freely.** "Undo that" reverts it, same as `Cmd/Ctrl+Z`.

## Seeing what happened

When the agent places something, a banner appears at the top of the screen.

- **選択 (Select)** — selects what was placed (and enters edit mode), for fine-tuning
- **元に戻す (Undo)** — reverts it, same as `Cmd/Ctrl+Z`
- **✕** — dismisses the banner

The banner hides itself after 10 seconds, but you can still undo after it is gone.

## Your input always wins

The AI never takes over what you are doing.

- **It does not steal your selection** — if you are editing something in the inspector,
  your selection stays put even when the AI places objects
- **It does not switch modes** — edit mode stays however you left it
- **It backs off while you are working** — requests are refused while you are placing an
  object or in the middle of a move (M)
- **It leaves other people's work alone** — objects someone else has selected are excluded
  from changes and deletions, and reported back as "N object(s) being edited by someone else
  were left alone"

## Troubleshooting

**The agent cannot see the tools**

1. Are you on `https://app.xrift.net` in Chrome 149 or later?
2. Are you inside an instance? (Nothing is registered on list screens.)
3. Is the edit button (🔧) visible? If not, you lack edit permission for that world, or it is
   a code-built world (CODE type) that cannot be edited in the browser.

**"The object limit has been reached"**

A world can store up to 500 objects. `get-viewer-context` reports the remaining capacity.
Remove what you do not need and ask again.

**Objects land on the wrong side**

The reference for "in front of me" may not have come across. Naming what you are looking at —
"on the wall I'm facing" — makes it reliable.

**You cannot find what was placed**

Press 選択 (Select) on the banner: it enters edit mode with the new objects selected. This also
finds objects that ended up below the ground or far away.

## For developers

Tool input/output schemas, the coordinate and rotation conventions, and the pitfalls to avoid
when implementing an agent are collected in the `xrift-world-editing` skill in
[xrift-skills](https://github.com/WebXR-JP/xrift-skills), formatted for AI coding agents.

```bash
npx skills add WebXR-JP/xrift-skills
```
