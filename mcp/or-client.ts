const BASE = (process.env.OWNERREZ_BASE_URL || "https://api.ownerrez.com").trim();
const TOKEN = process.env.OWNERREZ_API_TOKEN?.trim();
const OAUTH_TOKEN = process.env.OWNERREZ_OAUTH_TOKEN?.trim();
const EMAIL = (process.env.OWNERREZ_EMAIL || "troynowakrealty@gmail.com").trim();
const UA = (process.env.OWNERREZ_USER_AGENT || "DunedinDuo/1.0 (ownerrez-connector)").trim();

async function orFetch(path: string, init: RequestInit = {}): Promise<any> {
  // Prefer OAuth token over API token for unlimited access
  if (!OAUTH_TOKEN && !TOKEN) {
    throw new Error("Missing OWNERREZ_OAUTH_TOKEN or OWNERREZ_API_TOKEN");
  }
  
  let headers: Record<string, string>;
  
  if (OAUTH_TOKEN) {
    // Use OAuth Bearer token for unlimited API access
    headers = {
      "Authorization": `Bearer ${OAUTH_TOKEN}`,
      "User-Agent": UA,
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> ?? {})
    };
  } else {
    // Fallback to Basic Auth with API token (rate limited)
    const credentials = btoa(`${EMAIL}:${TOKEN}`);
    headers = {
      "Authorization": `Basic ${credentials}`,
      "User-Agent": UA,
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> ?? {})
    };
  }

  const doCall = async (): Promise<any> => {
    const res = await fetch(`${BASE}${path}`, { ...init, headers });
    if (res.status === 429) throw new Error("RATE_LIMIT");
    if (!res.ok) {
      const text = await res.text();
      const msg = (res.status === 401 || res.status === 403)
        ? "Invalid OwnerRez token or missing scope."
        : `OwnerRez error ${res.status}`;
      throw new Error(`${msg} ${text}`);
    }
    return res.json();
  };

  try {
    return await doCall();
  } catch (err: any) {
    if (err.message === "RATE_LIMIT") {
      await new Promise(r => setTimeout(r, 1000));
      return await doCall();
    }
    throw err;
  }
}

export { orFetch };