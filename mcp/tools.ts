import { orFetch } from "./or-client.js";

export async function search(query: string): Promise<any> {
  let results: any[] = [];
  
  try {
    const dateRegex = /\d{4}-\d{2}-\d{2}/g;
    const dates = query.match(dateRegex) || [];
    
    // Helper function to get property IDs for bookings queries
    const getPropertyIds = async (): Promise<string> => {
      try {
        const propertiesResp = await orFetch("/v2/properties");
        const propertyIds = (propertiesResp.items || []).map((p: any) => p.id);
        return propertyIds.join(',');
      } catch (error) {
        // Fallback to since_utc if properties fetch fails
        return ''; // Will use since_utc instead
      }
    };
    
    // Determine search limit based on query
    const getSearchLimit = (): number => {
      if (query.toLowerCase().includes('all')) return 200; // For "all bookings"
      if (query.toLowerCase().includes('recent')) return 20; // For "recent bookings"
      if (dates.length > 0) return 100; // For date searches
      return 50; // Default
    };
    
    if (dates.length >= 2) {
      // Search bookings by date range - need property_ids or since_utc
      const [from, to] = dates;
      const propertyIds = await getPropertyIds();
      const limit = getSearchLimit();
      
      let bookingsUrl;
      if (propertyIds) {
        bookingsUrl = `/v2/bookings?property_ids=${propertyIds}&from=${from}&to=${to}&limit=${limit}&include_guest=true`;
      } else {
        const since_utc = new Date(from).toISOString();
        bookingsUrl = `/v2/bookings?since_utc=${encodeURIComponent(since_utc)}&from=${from}&to=${to}&limit=${limit}&include_guest=true`;
      }
      
      const resp = await orFetch(bookingsUrl);
      results = (resp.items || resp.data || []).map((b: any) => ({
        id: `booking:${b.id}`,
        title: `Booking ${b.id} • ${b.guest?.first_name || ''} ${b.guest?.last_name || ''} • ${b.arrival}→${b.departure}`,
        url: `https://app.ownerrez.com/bookings/${b.id}`
      }));
    } else if (/property|unit|rental/i.test(query)) {
      // Search properties
      const resp = await orFetch("/v2/properties");
      results = (resp.items || resp.data || []).map((p: any) => ({
        id: `property:${p.id}`,
        title: `Property ${p.id} • ${p.name}`,
        url: `https://app.ownerrez.com/properties/${p.id}`
      }));
    } else if (/booking|reservation/i.test(query)) {
      // Search ALL bookings - past, current, and future
      const propertyIds = await getPropertyIds();
      
      const limit = getSearchLimit();
      let bookingsUrl;
      if (propertyIds) {
        bookingsUrl = `/v2/bookings?property_ids=${propertyIds}&limit=${limit}&include_guest=true`;
      } else {
        // Use a date far in the past to get all historical bookings
        const allBookingsStart = new Date('2020-01-01').toISOString();
        bookingsUrl = `/v2/bookings?since_utc=${encodeURIComponent(allBookingsStart)}&limit=${limit}&include_guest=true`;
      }
      
      const resp = await orFetch(bookingsUrl);
      results = (resp.items || resp.data || []).map((b: any) => ({
        id: `booking:${b.id}`,
        title: `Booking ${b.id} • ${b.guest?.first_name || ''} ${b.guest?.last_name || ''} • ${b.arrival}→${b.departure}`,
        url: `https://app.ownerrez.com/bookings/${b.id}`
      }));
    } else if (/past|previous|historical|archive/i.test(query)) {
      // Search past bookings specifically
      const propertyIds = await getPropertyIds();
      const today = new Date().toISOString().split('T')[0];
      
      let bookingsUrl;
      if (propertyIds) {
        bookingsUrl = `/v2/bookings?property_ids=${propertyIds}&to=${today}&limit=100&include_guest=true`;
      } else {
        const historicalStart = new Date('2020-01-01').toISOString();
        bookingsUrl = `/v2/bookings?since_utc=${encodeURIComponent(historicalStart)}&to=${today}&limit=100&include_guest=true`;
      }
      
      const resp = await orFetch(bookingsUrl);
      results = (resp.items || resp.data || []).map((b: any) => ({
        id: `booking:${b.id}`,
        title: `[PAST] Booking ${b.id} • ${b.guest?.first_name || ''} ${b.guest?.last_name || ''} • ${b.arrival}→${b.departure}`,
        url: `https://app.ownerrez.com/bookings/${b.id}`
      }));
    } else if (/future|upcoming|planned/i.test(query)) {
      // Search future bookings specifically
      const propertyIds = await getPropertyIds();
      const today = new Date().toISOString().split('T')[0];
      
      let bookingsUrl;
      if (propertyIds) {
        bookingsUrl = `/v2/bookings?property_ids=${propertyIds}&from=${today}&limit=100&include_guest=true`;
      } else {
        const futureStart = new Date().toISOString();
        bookingsUrl = `/v2/bookings?since_utc=${encodeURIComponent(futureStart)}&from=${today}&limit=100&include_guest=true`;
      }
      
      const resp = await orFetch(bookingsUrl);
      results = (resp.items || resp.data || []).map((b: any) => ({
        id: `booking:${b.id}`,
        title: `[FUTURE] Booking ${b.id} • ${b.guest?.first_name || ''} ${b.guest?.last_name || ''} • ${b.arrival}→${b.departure}`,
        url: `https://app.ownerrez.com/bookings/${b.id}`
      }));
    } else {
      // Default to guest search
      const resp = await orFetch(`/v2/guests?q=${encodeURIComponent(query)}`);
      results = (resp.items || resp.data || []).map((g: any) => ({
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
    data = response.data || response.items?.[0] || response;

    const doc: any = {
      id,
      title: (() => {
        if (type === "booking") {
          const guestName = data.guest ? `${data.guest.first_name || ''} ${data.guest.last_name || ''}`.trim() : 'Unknown Guest';
          return `Booking ${data.id} – ${guestName} – Check-in: ${data.arrival} – Check-out: ${data.departure}`;
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
            arrival: data.arrival, 
            departure: data.departure, 
            check_in: data.check_in,
            check_out: data.check_out,
            status: data.status,
            total_amount: data.total_amount,
            property_id: data.property_id,
            guest_id: data.guest_id,
            listing_site: data.listing_site,
            adults: data.adults,
            children: data.children
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