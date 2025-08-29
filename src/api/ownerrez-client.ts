import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '../utils/config.js';

export interface OwnerRezProperty {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OwnerRezBooking {
  id: number;
  property_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface OwnerRezGuest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface OwnerRezInquiry {
  id: number;
  property_id: number;
  guest_id: number;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export class OwnerRezClient {
  private client: AxiosInstance;
  private apiToken: string;
  private baseUrl: string;

  constructor(apiToken: string, baseUrl: string = 'https://api.ownerrez.com') {
    this.apiToken = apiToken;
    this.baseUrl = baseUrl;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          throw new Error('Invalid OwnerRez API credentials');
        } else if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (error.response?.status >= 500) {
          throw new Error('OwnerRez API server error. Please try again later.');
        }
        throw error;
      }
    );
  }

  private async get<T>(endpoint: string, options: any = {}): Promise<T> {
    const response = await this.client.get<T>(endpoint, options);
    return response.data;
  }

  private async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  private async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  private async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }

  // Properties
  async getProperties(params: {
    active?: boolean;
    status?: string;
    limit?: number;
  } = {}): Promise<{ data: OwnerRezProperty[]; total: number }> {
    const queryParams = new URLSearchParams();
    
    if (params.active !== undefined) {
      queryParams.append('active', params.active.toString());
    }
    if (params.status) {
      queryParams.append('status', params.status);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const response = await this.client.get(`/v2/properties?${queryParams.toString()}`);
    return {
      data: response.data.data || response.data,
      total: response.data.total || response.data.length
    };
  }

  async getProperty(id: string): Promise<OwnerRezProperty> {
    const response = await this.client.get(`/v2/properties/${id}`);
    return response.data;
  }

  async createProperty(data: any) {
    return this.post('/properties', data);
  }

  async updateProperty(id: number, data: any) {
    return this.put(`/properties/${id}`, data);
  }

  async deleteProperty(id: number) {
    return this.delete(`/properties/${id}`);
  }

  // Bookings
  async getBookings(options: any = {}): Promise<{ data: OwnerRezBooking[]; total: number }> {
    return this.get('/bookings', options);
  }

  async getBooking(id: string): Promise<OwnerRezBooking> {
    const response = await this.client.get(`/v2/bookings/${id}`);
    return response.data;
  }

  async createBooking(booking: Partial<OwnerRezBooking>): Promise<OwnerRezBooking> {
    const response = await this.client.post('/v2/bookings', booking);
    return response.data;
  }

  async updateBooking(id: number, updates: Partial<OwnerRezBooking>): Promise<OwnerRezBooking> {
    const response = await this.client.patch(`/v2/bookings/${id}`, updates);
    return response.data;
  }

  async deleteBooking(id: number) {
    return this.delete(`/bookings/${id}`);
  }

  // Guests
  async getGuests(params: {
    q?: string;
    limit?: number;
    include_tags?: boolean;
    include_fields?: boolean;
  } = {}): Promise<{ data: OwnerRezGuest[]; total: number }> {
    const queryParams = new URLSearchParams();
    
    if (params.q) {
      queryParams.append('q', params.q);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.include_tags) {
      queryParams.append('include_tags', 'true');
    }
    if (params.include_fields) {
      queryParams.append('include_fields', 'true');
    }

    const response = await this.client.get(`/v2/guests?${queryParams.toString()}`);
    return {
      data: response.data.data || response.data,
      total: response.data.total || response.data.length
    };
  }

  async getGuest(id: string): Promise<OwnerRezGuest> {
    const response = await this.client.get(`/v2/guests/${id}`);
    return response.data;
  }

  async createGuest(guest: Partial<OwnerRezGuest>): Promise<OwnerRezGuest> {
    const response = await this.client.post('/v2/guests', guest);
    return response.data;
  }

  async updateGuest(id: string, updates: Partial<OwnerRezGuest>): Promise<OwnerRezGuest> {
    const response = await this.client.patch(`/v2/guests/${id}`, updates);
    return response.data;
  }

  async deleteGuest(id: number) {
    return this.delete(`/guests/${id}`);
  }

  // Quotes
  async getQuotes(options: any = {}) {
    return this.get('/quotes', options);
  }

  async getQuoteById(id: number) {
    return this.get(`/quotes/${id}`);
  }

  async createQuote(data: any) {
    return this.post('/quotes', data);
  }

  async updateQuote(id: number, data: any) {
    return this.put(`/quotes/${id}`, data);
  }

  async deleteQuote(id: number) {
    return this.delete(`/quotes/${id}`);
  }

  // Test API connectivity
  async ping(): Promise<boolean> {
    try {
      await this.client.get('/v2/bookings?limit=1');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Financial API (custom implementation based on available endpoints)
  async getFinancialSummary(params: {
    property_ids?: string[];
    from?: string;
    to?: string;
  } = {}): Promise<any> {
    // This would need to be implemented based on actual financial endpoints
    // For now, we'll use bookings data to calculate basic financial info
    const bookings = await this.getBookings({
      property_ids: params.property_ids,
      from: params.from,
      to: params.to,
      include_charges: true,
    });

    // Calculate basic financial summary
    const totalRevenue = bookings.data.reduce((sum, booking) => {
      return sum + (booking.total_amount || 0);
    }, 0);

    return {
      total_bookings: bookings.data.length,
      total_revenue: totalRevenue,
      period: {
        from: params.from,
        to: params.to,
      },
    };
  }

  // Inquiries
  async getInquiries(params: {
    property_ids: number[];
    include_guest?: boolean;
    since_utc?: string;
  }): Promise<OwnerRezInquiry[]> {
    const response = await this.client.get('/v2/inquiries', { params });
    return response.data;
  }

  async getInquiry(id: number): Promise<OwnerRezInquiry> {
    const response = await this.client.get(`/v2/inquiries/${id}`);
    return response.data;
  }

  // Property Search
  async searchProperties(params: {
    property_ids?: number[];
    guests_min?: number;
    guests_max?: number;
    bedrooms_min?: number;
    bedrooms_max?: number;
    rate_min?: number;
    rate_max?: number;
    available_from?: string;
    available_to?: string;
  }): Promise<OwnerRezProperty[]> {
    const response = await this.client.get('/v2/propertysearch', { params });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/v2/users/me');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Utility methods
  getApiToken(): string {
    return this.apiToken;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
