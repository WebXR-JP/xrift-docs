---
sidebar_position: 1
---

# Triplex (Visual Editor)

[Triplex](https://triplex.dev/) is a visual editor for React Three Fiber, available as a VS Code extension. It allows you to visually place and adjust components in a 3D scene without directly editing code.

![Triplex VS Code](/img/triplex-vscode.png)

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=trytriplex.triplex-vsce).

## Using Triplex with XRift Projects

Both XRift worlds and items are built with React Three Fiber, so you can use Triplex directly.

1. Open an XRift project (world or item) in VS Code
2. Open a `.tsx` file containing an exported component
3. Click the "Open in Triplex" CodeLens that appears above the component
4. Adjust position, rotation, and scale of components in the visual editor
5. Changes are automatically reflected in the source code

Triplex eliminates the need to manually tweak `position` and `rotation` values, allowing you to build scenes intuitively.

## Resources

- [Triplex Official Website](https://triplex.dev/)
