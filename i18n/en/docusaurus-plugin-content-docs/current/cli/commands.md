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

Creates a new world project.

```bash
xrift create [name] [options]
```

### Options

| Option | Description |
|-----------|------|
| `--here` | Create the project in the current directory |
| `--template <name>` | Specify the template to use |
| `--skip-install` | Skip installation of dependencies |
| `-y, --no-interactive` | Skip interactive mode (use default values) |

### Examples

```bash
# Create a project interactively
xrift create my-world

# Create a project without interaction
xrift create my-world -y

# Create in the current directory
xrift create --here
```

## Deployment

### xrift upload world

Uploads the world to the XRift platform.

```bash
xrift upload world
```

Before uploading, the build script defined in `xrift.json` runs automatically. For new worlds, you will be prompted to enter metadata such as title and description.

After uploading, a code review is performed automatically (usually completed in a few minutes). Once the review is passed, the world will be published. If the review fails, the world will not be published, and the version that last passed the review will remain published.

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