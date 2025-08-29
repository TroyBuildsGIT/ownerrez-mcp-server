# OwnerRez MCP Connector Guide

This guide explains how to run the local MCP server and connect it to ChatGPT Custom Connectors.

## Running the MCP server locally

1. Copy and customize your environment variables:
   ```bash
   cp .env.example .env
   # Edit .env to set OWNERREZ_API_TOKEN
   ```

2. Start the MCP server:
   ```bash
   npm run dev:mcp
   ```

The server will listen on port 8000 by default and expose an SSE endpoint at:

```
http://localhost:8000/sse/
```

## Connecting in ChatGPT

1. Open ChatGPT Settings → Connectors → Add a new Remote Connector.
2. Enter the SSE URL:
   ```
   http://localhost:8000/sse/
   ```
3. Save and enable the Connector.

> **Note:** This Connector supports only two tools: `search(query)` and `fetch(id)` for OwnerRez resources.
> For mutations or sending messages, use the Vercel‑hosted Action proxy.

## Example usage

Try searching bookings via the Connector:
```bash
# Using curl to simulate a search via SSE (example client not provided here)
# Connector UI will show results as text-encoded JSON
```

Or fetch a specific resource:
```bash
# Similarly, the Connector UI will request fetch and return resource JSON
```