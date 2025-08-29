#!/usr/bin/env node
// Use built-in global fetch in Node 18+

const url = process.argv[2];
if (!url) {
  console.error("Usage: node scripts/sse-test.mjs <sse-url>");
  process.exit(1);
}

const res = await globalThis.fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ tool: "search", args: { query: "bookings from 2025-09-01 to 2025-09-07" } })
});

for await (const chunk of res.body) {
  process.stdout.write(chunk.toString());
}