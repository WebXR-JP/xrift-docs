---
sidebar_position: 1
---

# CLI Overview

xrift-cli is a command-line tool for managing XRift world projects.

## Features

- Creation of new world projects
- Uploading worlds to the XRift platform
- User authentication management

## Installation

```bash
npm install -g @xrift/cli
```

## Basic Usage

```bash
# Show help
xrift --help

# Show version
xrift --version

# Login (browser authentication)
xrift login

# Check current user
xrift whoami

# Create a new project
xrift create <project-name>

# Upload world
xrift upload world
```

For details, refer to the [Command Reference](/cli/commands).

## Repository

- [GitHub: xrift-cli](https://github.com/WebXR-JP/xrift-cli)