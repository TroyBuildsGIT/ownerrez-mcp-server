import { orFetch } from "./or-client";

export async function search(query: string): Promise<any> {
  let results: any[] = [];
  
  try {
    const dateRegex = /\d{4}-\d{2}-\d{2}/g;
    const dates = query.match(dateRegex) || [];
    
    if (dates.length >= 2) {
      // Search bookings by date range
      const [from, to] = dates;
      const resp = await orFetch(`/v2/bookings?from=${from}&to=${to}`);
      results = resp.data.map((b: any) => ({
        id: `booking:${b.id}`,
        title: `Booking ${b.id} • ${b.guest?.name || b.guestEmail} • ${b.check_in}→${b.check_out}`,
        url: `https://app.ownerrez.com/bookings/${b.id}`
      }));
    } else if (/property|unit|rental/i.test(query)) {
      // Search properties
      const resp = await orFetch("/v2/properties");
      results = resp.data.map((p: any) => ({
        id: `property:${p.id}`,
        title: `Property ${p.id} • ${p.name}`,
        url: `https://app.ownerrez.com/properties/${p.id}`
      }));
    } else if (/booking|reservation/i.test(query)) {
      // Search recent bookings
      const resp = await orFetch("/v2/bookings?limit=10");
      results = resp.data.map((b: any) => ({
        id: `booking:${b.id}`,
        title: `Booking ${b.id} • ${b.guest?.name || b.guestEmail} • ${b.check_in}→${b.check_out}`,
        url: `https://app.ownerrez.com/bookings/${b.id}`
      }));
    } else {
      // Default to guest search
      const resp = await orFetch(`/v2/guests?q=${encodeURIComponent(query)}`);
      results = resp.data.map((g: any) => ({
        id: `guest:${g.id}`,
        title: `Guest ${g.id} • ${g.first_name} ${g.last_name} • ${g.email}`,
        url: `https://app.ownerrez.com/guests/${g.id}`
      }));
    }
  } catch (error) {
    console.error('Search error:', error);
    results = [];
  }

  // Return in ChatGPT MCP format
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ results })
      }
    ]
  };
}

export async function fetch(id: string): Promise<any> {
  try {
    const [type, raw] = id.split(":");
    if (!type || !raw) {
      throw new Error("Invalid ID format. Expected 'type:id'");
    }

    let data: any;
    let endpoint: string;
    
    switch (type) {
      case "booking":
        endpoint = `/v2/bookings/${raw}`;
        break;
      case "property":
        endpoint = `/v2/properties/${raw}`;
        break;
      case "guest":
        endpoint = `/v2/guests/${raw}`;
        break;
      default:
        throw new Error(`Unknown type prefix: ${type}`);
    }

    const response = await orFetch(endpoint);
    data = response.data || response;

    const doc: any = {
      id,
      title: (() => {
        if (type === "booking") {
          return `Booking ${data.id} – ${data.guest?.name || data.guestEmail} – Check-in: ${data.check_in} – Check-out: ${data.check_out}`;
        }
        if (type === "property") {
          return `Property ${data.id} – ${data.name} – ${data.address || 'No address'}`;
        }
        if (type === "guest") {
          return `Guest ${data.id} – ${data.first_name} ${data.last_name} – ${data.email}`;
        }
        return `${type} ${data.id}`;
      })(),
      text: JSON.stringify(data, null, 2),
      url: `https://app.ownerrez.com/${type}s/${data.id}`,
      metadata: (() => {
        if (type === "booking") {
          return { 
            check_in: data.check_in, 
            check_out: data.check_out, 
            status: data.status,
            total_amount: data.total_amount,
            property_id: data.property_id,
            guest_id: data.guest_id
          };
        }
        if (type === "property") {
          return { 
            active: data.active,
            address: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip
          };
        }
        if (type === "guest") {
          return { 
            email: data.email, 
            phone: data.phone,
            first_name: data.first_name,
            last_name: data.last_name
          };
        }
        return { source: "ownerrez" };
      })()
    };

    // Return in ChatGPT MCP format
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(doc)
        }
      ]
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            id,
            title: "Error fetching document",
            text: `Error: ${error.message}`,
            url: "",
            metadata: { error: true, message: error.message }
          })
        }
      ]
    };
  }
}