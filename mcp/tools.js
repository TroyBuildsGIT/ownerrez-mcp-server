import { orFetch } from "./or-client";
export async function search(query) {
    const dateRegex = /\d{4}-\d{2}-\d{2}/g;
    const dates = query.match(dateRegex) || [];
    if (dates.length >= 2) {
        const [from, to] = dates;
        const resp = await orFetch(`/v2/bookings?from=${from}&to=${to}`);
        const results = resp.data.map((b) => ({
            id: `booking:${b.id}`,
            title: `Booking ${b.id} • ${b.guest?.name || b.guestEmail} • ${b.check_in}→${b.check_out}`,
            url: `https://app.ownerrez.com/bookings/${b.id}`
        }));
        return { results };
    }
    if (/property|unit/i.test(query)) {
        const resp = await orFetch("/v2/properties");
        const results = resp.data.map((p) => ({
            id: `property:${p.id}`,
            title: `Property ${p.id} • ${p.name}`,
            url: `https://app.ownerrez.com/properties/${p.id}`
        }));
        return { results };
    }
    // default to guest search
    const resp = await orFetch(`/v2/guests?q=${encodeURIComponent(query)}`);
    const results = resp.data.map((g) => ({
        id: `guest:${g.id}`,
        title: `Guest ${g.id} • ${g.first_name} ${g.last_name} • ${g.email}`,
        url: `https://app.ownerrez.com/guests/${g.id}`
    }));
    return { results };
}
export async function fetch(id) {
    const [type, raw] = id.split(":");
    let data;
    switch (type) {
        case "booking":
            ({ data } = await orFetch(`/v2/bookings/${raw}`));
            break;
        case "property":
            ({ data } = await orFetch(`/v2/properties/${raw}`));
            break;
        case "guest":
            ({ data } = await orFetch(`/v2/guests/${raw}`));
            break;
        default:
            throw new Error(`Unknown type prefix: ${type}`);
    }
    const doc = {
        id,
        title: (() => {
            if (type === "booking") {
                return `Booking ${data.id} – ${data.guest?.name || data.guestEmail} – Total ${data.total_amount_cents / 100}`;
            }
            if (type === "property") {
                return `Property ${data.id} – ${data.name}`;
            }
            if (type === "guest") {
                return `Guest ${data.id} – ${data.first_name} ${data.last_name}`;
            }
            return id;
        })(),
        text: JSON.stringify(data, null, 2),
        url: `https://app.ownerrez.com/${type}s/${data.id}`,
        metadata: (() => {
            if (type === "booking") {
                return { check_in: data.check_in, check_out: data.check_out, tags: data.tags };
            }
            if (type === "property") {
                return { status: data.status, unit_type: data.unit_type };
            }
            if (type === "guest") {
                return { email: data.email, phone: data.phone };
            }
            return {};
        })()
    };
    return doc;
}
//# sourceMappingURL=tools.js.map