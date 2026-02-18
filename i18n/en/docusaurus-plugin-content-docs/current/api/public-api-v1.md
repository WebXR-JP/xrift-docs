---
sidebar_position: 1
---

# Public API v1

API reference for external developers to access XRift data using API keys.

## Authentication

Two authentication methods are supported.

| Method | Header | Use case |
|---|---|---|
| API Key | `Authorization: Bearer xrift_sk_xxx` | For third-party developers (scoped + rate limited) |
| CLI Token | `Authorization: Bearer xrf_xxx` | For CLI / internal tools (full access, no rate limit) |

### Request example

```bash
curl -H "Authorization: Bearer xrift_sk_xxx" \
  https://api.xrift.net/api/public/v1/worlds
```

## Endpoints

**Base URL**: `https://api.xrift.net/api/public/v1`

| Method | Path | Scope | Description |
|---|---|---|---|
| GET | `/worlds` | `read:worlds` | List worlds (paginated) |
| GET | `/worlds/search?q=xxx` | `read:worlds` | Search worlds |
| GET | `/worlds/:id` | `read:worlds` | World details |
| GET | `/users/:id` | `read:users` | User public profile |
| GET | `/instances` | `read:instances` | List instances (paginated) |
| GET | `/instances/:id` | `read:instances` | Instance details |

## Query parameters

The following query parameters are available for list endpoints.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | number | 20 | Number of items to fetch (max 50) |
| `offset` | number | 0 | Offset |
| `worldId` | string | - | Filter instances by world |

### Request examples

```bash
# Fetch 10 worlds
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/worlds?limit=10&offset=0"

# Search worlds
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/worlds/search?q=tokyo"

# List instances for a specific world
curl -H "Authorization: Bearer xrift_sk_xxx" \
  "https://api.xrift.net/api/public/v1/instances?worldId=xxx"
```

## Response format

### List

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### Detail

```json
{
  "data": {
    "id": "xxx",
    ...
  }
}
```

### Error

```json
{
  "error": "Error message"
}
```

## HTTP status codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 400 | Bad request |
| 401 | Authentication failed |
| 403 | Insufficient scope |
| 404 | Resource not found |
| 429 | Rate limit exceeded |

## Rate limiting

- **1,000 requests** per hour (default)
- Applies to API key authentication only (CLI tokens are exempt)

You can check your current usage via response headers.

| Header | Description |
|---|---|
| `X-RateLimit-Limit` | Maximum requests allowed |
| `X-RateLimit-Remaining` | Remaining requests |
| `X-RateLimit-Reset` | Reset time (Unix timestamp) |

:::caution
When the rate limit is exceeded, a `429 Too Many Requests` response is returned. Wait until the time indicated in the `X-RateLimit-Reset` header before retrying.
:::
