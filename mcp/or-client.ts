const BASE = process.env.OWNERREZ_BASE_URL || "https://api.ownerrez.com";
const TOKEN = process.env.OWNERREZ_API_TOKEN;
const EMAIL = process.env.OWNERREZ_EMAIL || "troynowakrealty@gmail.com";
const UA = process.env.OWNERREZ_USER_AGENT || "DunedinDuo/1.0 (ownerrez-connector)";

async function orFetch(path: string, init: RequestInit = {}): Promise<any> {
  if (!TOKEN) {
    throw new Error("Missing OWNERREZ_API_TOKEN");
  }
  
  // OwnerRez uses Basic Auth: email as username, token as password
  const credentials = btoa(`${EMAIL}:${TOKEN}`);
  
  const headers: Record<string, string> = {
    "Authorization": `Basic ${credentials}`,
    "User-Agent": UA,
    "Accept": "application/json",
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> ?? {})
  };

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