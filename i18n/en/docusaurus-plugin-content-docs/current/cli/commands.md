---
sidebar_position: 2
---

# Command Reference

A list of commands available in xrift-cli.

## Authentication Commands

### xrift login

Performs browser-based authentication.

```bash
xrift login
```

A browser will open, allowing you to log in with your XRift account.

### xrift logout

Signs out from the current session.

```bash
xrift logout
```

### xrift whoami

Displays information about the currently logged-in user.

```bash
xrift whoami
```

## Project Management

### xrift create

Creates a new project. When run without a subcommand, an interactive prompt lets you select the project type.

```bash
xrift create                          # Interactive type selection
xrift create world [name] [options]   # Create a world project
xrift create item [name] [options]    # Create an item project
```

### Options (`xrift create world` / `xrift create item`)

| Option | Description |
|-----------|------|
| `--here` | Create the project in the current directory |
| `-t, --template <repository>` | Specify the template repository to use |
| `--skip-install` | Skip installation of dependencies |
| `-y, --no-interactive` | Skip interactive mode (use default values) |

The default templates are:

| Command | Default template |
|---------|-------------------|
| `xrift create world` | `WebXR-JP/xrift-test-world` |
| `xrift create item` | `WebXR-JP/xrift-item-template` |

### Examples

```bash
# Select project type interactively
xrift create

# Create a world project interactively
xrift create world my-world

# Create an item project interactively
xrift create item my-item

# Create a project without interaction
xrift create world my-world -y

# Create in the current directory
xrift create item --here
```

## Deployment

### xrift upload

Automatically detects the project type from `xrift.json` and uploads it. You can also specify the type explicitly with a subcommand.

```bash
xrift upload                # Auto-detect from xrift.json
xrift upload world          # Upload a world
xrift upload item           # Upload an item
```

### Options

| Option | Description |
|-----------|------|
| `--skip-check` | Skip the security check before uploading |

### xrift upload world

Uploads the world to the XRift platform.

```bash
xrift upload world
```

Before uploading, the build script defined in `xrift.json` runs automatically. For new worlds, you will be prompted to enter metadata such as title and description.

After uploading, a code review is performed automatically (usually completed in a few minutes). Once the review is passed, the world will be published. If the review fails, the world will not be published, and the version that last passed the review will remain published.

### xrift upload item

Uploads the item to the XRift platform.

```bash
xrift upload item
```

Before uploading, the `item.buildCommand` defined in `xrift.json` runs automatically. For new items, you will be prompted to enter a title (required) and description (optional).

After uploading, a code review is performed automatically. Once the review is passed, the item will be published and can be used in worlds from your inventory.

## Security Checks

### xrift check

Runs code security checks against the build artifacts. The project type is auto-detected from `xrift.json`.

```bash
xrift check                 # Auto-detect from xrift.json
xrift check world           # Check a world's build artifacts
xrift check item            # Check an item's build artifacts
```

### Options

| Option | Description |
|-----------|------|
| `--build` | Run the build command before checking |
| `--ignore-warnings` | Ignore warnings (REVIEW) and fail only on REJECT |
| `--json` | Output results in JSON format |

### Examples

```bash
# Run the build and then check
xrift check --build

# JSON output for CI
xrift check item --json

# Let warnings pass, fail only on critical violations
xrift check world --ignore-warnings
```

Check results are classified as APPROVE / REVIEW / REJECT. If any REJECT is found, the command exits with code 1.

## Utilities

### --version, -v

Displays the installed version.

```bash
xrift --version
xrift -v
```

### --help, -h

Displays help information.

```bash
xrift --help
xrift -h
```

### --verbose

Displays detailed debug output.

```bash
xrift --verbose <command>
```