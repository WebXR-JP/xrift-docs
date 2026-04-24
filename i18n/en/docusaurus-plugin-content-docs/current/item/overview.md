---
sidebar_position: 1
---

# Item Development

Documentation regarding XRift item development.

## Overview

XRift items are reusable 3D components that can be placed and used inside worlds. They are implemented with React Three Fiber and distributed via Module Federation. Once uploaded, items are available from your inventory across any world.

## Development Flow

1. Create an item project with `xrift create item`
2. Edit `src/Item.tsx` to implement the item (preview locally with `npm run dev`)
3. Run `npm run build` to create the production build
4. Run `xrift check item` for a security check (optional)
5. Upload to the XRift platform with `xrift upload item`
6. After automatic review, the item is published and becomes available in inventories

## Items vs. Worlds

| Aspect | Item | World |
|------|---------|---------|
| Purpose | Reusable component placed inside worlds | An entire interactive 3D space |
| Export | `Item` component and `ItemProps` | `World` component |
| `xrift.json` config | Under the `item` key | Under the `world` key |
| Physics / camera / output buffer config | Not available | Configurable on the world side |
| Where used | Placed via the inventory inside any world | Published as an instance on the platform |

## Next Steps

- [Create Your First Item](/item/create-first-item)
- [xrift.json Configuration (Item)](/item/configuration)
- [CLI Commands](/cli/commands)
