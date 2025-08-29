import http from "http";
import { search as searchTool, fetch as fetchTool } from "./tools.js";

const PORT = parseInt(process.env.PORT || "8000", 10);

http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/sse/") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });
    res.write("retry: 10000\n\n");
    let buffer = "";
    req.on("data", async (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split(/\r?\n/);
      for (const line of lines) {
        if (line.startsWith("event:")) {
          const event = line.replace("event:", "").trim();
          buffer = "";
          req.once("data", async (dataChunk) => {
            const payload = JSON.parse(dataChunk.toString().replace(/^data:/, "").trim());
            let result;
            try {
              if (event === "search") {
                result = await searchTool(payload.query);
              } else if (event === "fetch") {
                result = await fetchTool(payload.id);
              } else {
                throw new Error(`Unknown tool: ${event}`);
              }
              const out = { content: [{ type: "text", text: JSON.stringify(result) }] };
              res.write(`event: result\n`);
              res.write(`data: ${JSON.stringify(out)}\n\n`);
            } catch (err: any) {
              const out = { content: [{ type: "text", text: JSON.stringify({ error: err.message }) }] };
              res.write(`event: result\n`);
              res.write(`data: ${JSON.stringify(out)}\n\n`);
            }
          });
        }
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(PORT, () => {
  console.log(`MCP server listening on http://localhost:${PORT}/sse/`);
});