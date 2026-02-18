---
sidebar_position: 1
---

# Public API v1

API reference for external developers to access XRift data using API keys.

**Base URL**: `https://api.xrift.net/api/public/v1`

## Authentication

Two authentication methods are supported. Send the token via the `Authorization` header.

| Method | Header | Use case |
|---|---|---|
| API Key | `Authorization: Bearer xrift_sk_xxx` | For third-party developers (scoped + rate limited) |
| CLI Token | `Authorization: Bearer xrf_xxx` | For CLI / internal tools (full access, no rate limit) |

- API keys are identified by the `xrift_sk_` prefix
- CLI tokens are identified by the `xrf_` prefix
- Tokens that don't match either format will return a `401` error

### Scopes

API key authentication uses scope-based access control. If the required scope is missing, a `403` error is returned.

| Scope | Access |
|---|---|
| `read:worlds` | World list, search, and details |
| `read:users` | User public profile |
| `read:instances` | Instance list and details |

:::tip
CLI tokens skip scope checks and have access to all endpoints.
:::

## Endpoints

### GET /worlds

List worlds with pagination.

- **Scope**: `read:worlds`

#### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | number | 20 | Number of items (max 50) |
| `offset` | number | 0 | Offset |

#### Request example

```bash
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/worlds?limit=10&offset=0"
```

#### Response example

```json
{
  "data": [
    {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "My World",
      "description": "A sample world",
      "ownerId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "isPublic": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

---

### GET /worlds/search

Search worlds by keyword.

- **Scope**: `read:worlds`

#### Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `q` | string | **Required** | - | Search keyword |
| `limit` | number | - | 20 | Number of items (max 50) |
| `offset` | number | - | 0 | Offset |

#### Request example

```bash
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/worlds/search?q=tokyo&limit=5"
```

#### Response example

```json
{
  "data": [
    {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "Tokyo Tower World",
      "description": "A world recreating Tokyo Tower"
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 5,
    "offset": 0
  }
}
```

#### Errors

| Status | Condition | Response |
|---|---|---|
| 400 | `q` parameter is missing | `{ "error": "Query parameter \"q\" is required" }` |

---

### GET /worlds/:id

Get world details by ID.

- **Scope**: `read:worlds`

#### Path parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | string | World ID |

#### Request example

```bash
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/worlds/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

#### Response example

```json
{
  "data": {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "name": "My World",
    "description": "A sample world",
    "ownerId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "isPublic": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

#### Errors

| Status | Condition | Response |
|---|---|---|
| 404 | World does not exist | `{ "error": "World not found" }` |

---

### GET /users/:id

Get a user's public profile by ID.

- **Scope**: `read:users`

#### Path parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | string | User ID |

#### Request example

```bash
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/users/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

#### Response example

```json
{
  "data": {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "displayName": "sawa-zen",
    "avatarUrl": "https://example.com/avatar.png",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

#### Errors

| Status | Condition | Response |
|---|---|---|
| 404 | User does not exist | `{ "error": "User not found" }` |

---

### GET /instances

List active instances with pagination.

- **Scope**: `read:instances`

#### Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `worldId` | string | - | - | Filter instances by world |
| `limit` | number | - | 20 | Number of items (max 50) |
| `offset` | number | - | 0 | Offset |

#### Request examples

```bash
# All instances
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/instances"

# Instances for a specific world
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/instances?worldId=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

#### Response example

```json
{
  "data": [
    {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "worldId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

---

### GET /instances/:id

Get instance details by ID.

- **Scope**: `read:instances`

#### Path parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Instance ID |

#### Request example

```bash
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/instances/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

#### Response example

```json
{
  "data": {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "worldId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

#### Errors

| Status | Condition | Response |
|---|---|---|
| 404 | Instance does not exist | `{ "error": "Instance not found" }` |

## Common error responses

Errors that can be returned by all endpoints.

| Status | Meaning | Response example |
|---|---|---|
| 401 | Authorization header missing | `{ "error": "Authentication required" }` |
| 401 | Invalid token format | `{ "error": "Invalid token format" }` |
| 401 | Invalid API key | `{ "error": "Invalid API key" }` |
| 401 | API key is deactivated | `{ "error": "API key is deactivated" }` |
| 401 | API key has expired | `{ "error": "API key has expired" }` |
| 401 | Invalid CLI token | `{ "error": "Invalid CLI token" }` |
| 401 | CLI token has expired | `{ "error": "CLI token has expired" }` |
| 403 | Insufficient scope | `{ "error": "Insufficient scope. Required: read:worlds" }` |
| 429 | Rate limit exceeded | `{ "error": "Rate limit exceeded" }` |

## Rate limiting

- **1,000 requests** per hour (default)
- Applies to API key authentication only (CLI tokens are exempt)
- Calculated using a fixed window algorithm

Rate limit usage is returned via response headers (API key authentication only).

| Header | Description |
|---|---|
| `X-RateLimit-Limit` | Maximum requests allowed |
| `X-RateLimit-Remaining` | Remaining requests |
| `X-RateLimit-Reset` | Reset time (Unix timestamp) |

:::caution
When the rate limit is exceeded, a `429 Too Many Requests` response is returned. Wait until the time indicated in the `X-RateLimit-Reset` header before retrying.
:::
