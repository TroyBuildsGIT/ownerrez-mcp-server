const BASE = process.env.OWNERREZ_BASE_URL || "https://api.ownerrez.com";
const TOKEN = process.env.OWNERREZ_API_TOKEN;
const UA = process.env.OWNERREZ_USER_AGENT || "DunedinDuo/1.0 (ownerrez-connector)";
async function orFetch(path, init = {}) {
    if (!TOKEN) {
        throw new Error("Missing OWNERREZ_API_TOKEN");
    }
    const headers = {
        "Authorization": `Bearer ${TOKEN}`,
        "User-Agent": UA,
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(init.headers ?? {})
    };
    const doCall = async () => {
        const res = await fetch(`${BASE}${path}`, { ...init, headers });
        if (res.status === 429)
            throw new Error("RATE_LIMIT");
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
    }
    catch (err) {
        if (err.message === "RATE_LIMIT") {
            await new Promise(r => setTimeout(r, 1000));
            return await doCall();
        }
        throw err;
    }
}
export { orFetch };
//# sourceMappingURL=or-client.js.map