---
sidebar_position: 2
---

# xrift.json Configuration

Configure your world settings in `xrift.json` at the project root.

## Configuration Example

```json
{
  "world": {
    "distDir": "./dist",
    "title": "My World",
    "description": "This is a sample world",
    "thumbnailPath": "thumbnail.png",
    "buildCommand": "npm run build",
    "ignore": [
      "**/.DS_Store",
      "**/Thumbs.db",
      "**/*.map"
    ]
  }
}
```

## Configuration Items

| Field | Type | Description |
|-----------|-----|------|
| `distDir` | string | Directory of build artifacts to upload |
| `title` | string | World title (if not set, input required at upload) |
| `description` | string | World description (if not set, input required at upload) |
| `thumbnailPath` | string | Path to thumbnail image (relative to `distDir`) |
| `buildCommand` | string | Build command to execute before upload |
| `ignore` | string[] | Glob patterns of files to exclude from upload |
| `physics` | object | World physics settings |

## Details of Each Item

### distDir

Specifies the directory to upload.

```json
{
  "world": {
    "distDir": "./dist"
  }
}
```

### title / description

Sets the world title and description. These are optional, but if set, they will be used as default values in the prompt when running `xrift upload world`.

```json
{
  "world": {
    "title": "My Awesome World",
    "description": "An interactive 3D world"
  }
}
```

### thumbnailPath

Specifies the thumbnail image for the world. Specify as a relative path from `distDir`.

```json
{
  "world": {
    "distDir": "./dist",
    "thumbnailPath": "thumbnail.png"
  }
}
```

In this case, `dist/thumbnail.png` will be used as the thumbnail.

**Recommended Size**: 1280x720 pixels

### buildCommand

A command that is automatically executed before uploading when running `xrift upload world`.

```json
{
  "world": {
    "buildCommand": "npm run build"
  }
}
```

Setting this eliminates the need to build manually.

### ignore

Specifies files to exclude from upload using glob patterns.

```json
{
  "world": {
    "ignore": [
      "**/.DS_Store",
      "**/Thumbs.db",
      "**/*.map"
    ]
  }
}
```

### physics

You can customize the physics behavior of the world.

| Setting | Type | Default | Description |
|------|-----|---------|------|
| `gravity` | number | 9.81 | Strength of gravity (Positive value, Earth=9.81, Moon=1.62) |
| `allowInfiniteJump` | boolean | true | Whether to allow infinite jumping |

#### Basic Settings

```json
{
  "world": {
    "physics": {
      "gravity": 9.81,
      "allowInfiniteJump": true
    }
  }
}
```

#### Athletic World (No Infinite Jump)

```json
{
  "world": {
    "physics": {
      "allowInfiniteJump": false
    }
  }
}
```

#### Low Gravity World (Moon Gravity)

```json
{
  "world": {
    "physics": {
      "gravity": 1.62
    }
  }
}
```

#### High Gravity World (Jupiter Gravity)

```json
{
  "world": {
    "physics": {
      "gravity": 24.79
    }
  }
}
```