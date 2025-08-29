export const config = { runtime: "edge" };
import { search as searchTool, fetch as fetchTool } from "../dist/mcp/tools";

function sseStream(controller: ReadableStreamDefaultController, event: string, data: unknown) {
  const enc = new TextEncoder();
  controller.enqueue(enc.encode(`event: ${event}\n`));
  controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));
}

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Use POST with {tool,args}", { status: 405 });
  }

  const { tool, args } = await req.json().catch(() => ({}));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let result;
        if (tool === "search") {
          result = await searchTool(String(args?.query || ""));
        } else if (tool === "fetch") {
          result = await fetchTool(String(args?.id || ""));
        } else {
          throw new Error(`Unknown tool: ${tool}`);
        }
        // Tools now return content in MCP format directly
        sseStream(controller, "result", result);
      } catch (err: any) {
        const out = { content: [ { type: "text", text: JSON.stringify({ error: err.message }) } ] };
        sseStream(controller, "result", out);
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    }
  });
}