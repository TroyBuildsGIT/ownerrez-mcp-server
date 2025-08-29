export const config = { runtime: "edge" };
import { orFetch } from "../dist/mcp/or-client";

export default async function handler() {
  try {
    const resp = await orFetch("/v2/properties");
    return new Response(JSON.stringify(resp.data, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}