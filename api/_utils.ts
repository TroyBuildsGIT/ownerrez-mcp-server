export const BASE = process.env.OWNERREZ_BASE_URL || "https://api.ownerrez.com";
const TOKEN = process.env.OWNERREZ_API_TOKEN;
const UA = process.env.OWNERREZ_USER_AGENT || "DunedinDuo/1.0 (ownerrez-connector)";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function orFetch(path: string, init: RequestInit = {}) {
  if (!TOKEN) {
    return new Response(JSON.stringify({ error: "Missing OWNERREZ_API_TOKEN" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${TOKEN}`,
    "User-Agent": UA,
    "Accept": "application/json",
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> ?? {})
  };

  const doCall = async (): Promise<Response> => {
    const res = await fetch(`${BASE}${path}`, { ...init, headers });
    if (res.status === 429) throw new Error("RATE_LIMIT");
    return res;
  };

  try {
    let res: Response;
    try {
      res = await doCall();
    } catch (e: any) {
      if (e.message === "RATE_LIMIT") {
        await new Promise(r => setTimeout(r, 1000));
        res = await doCall();
      } else { throw e; }
    }
    if (!res.ok) {
      const body = await res.text();
      const status = res.status;
      const msg = status === 401 || status === 403
        ? "Invalid OwnerRez token or missing scope."
        : `OwnerRez error ${status}`;
      return new Response(JSON.stringify({ error: msg, details: safeJson(body) }), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    const data = await res.text();
    return new Response(data || "{}", { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Proxy error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}

function safeJson(t: string) { try { return JSON.parse(t); } catch { return t; } }