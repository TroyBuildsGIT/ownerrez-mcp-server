import * as http from "http";
import { search as searchTool, fetch as fetchTool } from "./tools";
import * as rentalTools from "./rental-tools";
import * as homebridgeTools from "./homebridge-tools";

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
              } else if (event === "devices") {
                result = await rentalTools.listSmartDevices();
              } else if (event === "thermostat") {
                result = await rentalTools.controlThermostat(payload.action, ...payload.params || []);
              } else if (event === "prepare") {
                result = await rentalTools.prepareUnitForGuest(payload.booking_id, payload.preferences);
              } else if (event === "checkout") {
                result = await rentalTools.checkoutRoutine(payload.booking_id);
              } else if (event === "stats") {
                result = await rentalTools.getPropertyStats(payload.property_id);
              } else if (event === "homebridge_discover") {
                result = await homebridgeTools.discoverHomebridgeDevices(payload.timeout);
              } else if (event === "homebridge_info") {
                result = await homebridgeTools.getHomebridgeInfo(payload.bridge_ip, payload.bridge_port);
              } else if (event === "homekit_lock") {
                result = await homebridgeTools.controlHomekitLock(payload.device_name, payload.action, payload.bridge_ip);
              } else if (event === "nest_direct") {
                result = await homebridgeTools.testNestDirectAPI(payload.access_token, payload.endpoint);
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