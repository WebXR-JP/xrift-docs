---
sidebar_position: 3
---

# Supported Devices (PC, Mobile, VR)

Visitors can join the same XRift instance from PC, mobile (smartphones and tablets), and VR headsets. Build your world so that it **works on at least both PC and mobile**. Support VR as far as you can.

| Device | Support | Main controls |
|--------|---------|---------------|
| PC | Required (recommended) | Mouse and keyboard. Aim with the center crosshair and click |
| Mobile | Required (recommended) | Touch. Move with the virtual joystick |
| VR | As far as possible | Controllers. Aim with the ray and pull the trigger |

If you only test on PC, you can easily end up with a world that cannot be operated on mobile and shows nothing in VR. The two common causes are below.

## Don't rely on custom keyboard shortcuts

Mobile and VR have no keyboard. Features built with `window.addEventListener('keydown')` cannot be used at all outside PC. Also, keys such as W / A / S / D, Space, Q / E, G, H, and Esc are used by the platform's own controls and will conflict with your shortcuts.

Use mechanisms that deliver input in the same form on every device instead.

- **Buttons and switches**: build them with [`Interactable`](/world-components/components/#interactable). It responds to clicks on PC, touch on mobile, and controllers in VR
- **Driving vehicles**: use `onControlInput` on [`Seat` / `Vehicle`](/world-components/components/#seat). Keyboard, virtual joystick, and thumbstick input all arrive in the same form
- **Text entry**: use [`TextInput`](/world-components/components/#textinput). **Confirmation dialogs**: use [`useConfirm`](/world-components/components/#useconfirm)

Adding shortcuts is fine. But make the same action available through `Interactable` or similar, and keep shortcuts as a convenience for PC users.

:::caution[Grabbable currently works on PC only]
Grabbing with [`Grabbable`](/world-components/components/#grabbable) currently works only on PC (pointer lock and crosshair). Don't make an action that is required to progress in your world depend on `Grabbable` alone.
:::

## Put HUDs and UI in 3D space, not in the DOM

A HUD built with your own DOM (HTML elements) has these problems:

- **It breaks on mobile**: the screen is small and switches between portrait and landscape. It also overlaps the platform's virtual joystick and buttons
- **It is invisible in VR**: only the 3D scene is rendered in VR, so DOM elements are not shown at all

Place UI such as scores, instructions, and menus as objects in 3D space.

- Use `Text` from `@react-three/drei` for text, and `@react-three/uikit` for panels and menus (both are shared with the host)
- Load fonts with `useDefaultFont` from `@xrift/world-components` to display Japanese text
- Wrap UI in `BillboardY` from `@xrift/world-components` to keep it facing the player
- Wrap it in `Interactable` to make it a button

## Checklist before publishing

- [ ] Every feature is reachable without a keyboard
- [ ] No DOM UI is overlaid on the screen
- [ ] Text and UI live in 3D space and are large enough to read on a smartphone screen
- [ ] No action required to progress depends on `Grabbable` alone
- [ ] After uploading, you can join and operate the world on a real smartphone
- [ ] (If possible) You can join with a VR headset and see and operate the UI
