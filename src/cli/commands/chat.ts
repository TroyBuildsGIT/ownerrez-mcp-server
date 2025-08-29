import { Command } from 'commander';
import { OwnerRezClient } from '../../api/ownerrez-client';
import { loadConfig } from '../utils/config-loader';

export class ChatCommand {
  constructor(program: Command) {
    const chat = program
      .command('chat')
      .description('Natural language business queries');

    chat
      .argument('<query>', 'Natural language query')
      .action(async (query) => {
        await this.processQuery(query);
      });
  }

  private async processQuery(query: string): Promise<void> {
    const lowerQuery = query.toLowerCase();
    
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      
      console.log(`\n💬 Processing: "${query}"`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Income and financial queries
      if (this.matchesPattern(lowerQuery, ['income', 'revenue', 'earnings', 'money', 'profit'])) {
        await this.handleFinancialQuery(client, query);
      }
      // Booking queries
      else if (this.matchesPattern(lowerQuery, ['booking', 'reservation', 'guest', 'checkin', 'checkout'])) {
        await this.handleBookingQuery(client, query);
      }
      // Property queries
      else if (this.matchesPattern(lowerQuery, ['property', 'house', 'home', 'rental', 'availability'])) {
        await this.handlePropertyQuery(client, query);
      }
      // Message queries
      else if (this.matchesPattern(lowerQuery, ['message', 'communication', 'email', 'text', 'unread'])) {
        await this.handleMessageQuery(client, query);
      }
      // General status queries
      else if (this.matchesPattern(lowerQuery, ['status', 'what', 'how', 'show', 'display'])) {
        await this.handleStatusQuery(client, query);
      }
      else {
        console.log('❓ I\'m not sure how to handle that query. Try asking about:');
        console.log('   • Income and financial data');
        console.log('   • Bookings and guests');
        console.log('   • Properties and availability');
        console.log('   • Messages and communication');
        console.log('   • General business status');
      }
    } catch (error) {
      console.error('❌ Error processing query:', error.message);
    }
  }

  private matchesPattern(query: string, patterns: string[]): boolean {
    return patterns.some(pattern => query.includes(pattern));
  }

  private async handleFinancialQuery(client: OwnerRezClient, query: string): Promise<void> {
    console.log('💰 Processing financial query...');
    
    // Extract time period from query
    let period = 'month';
    if (query.includes('week')) period = 'week';
    if (query.includes('year')) period = 'year';
    if (query.includes('today')) period = 'today';
    
    const now = new Date();
    let fromDate: string;
    
    switch (period) {
      case 'week':
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'year':
        fromDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        break;
      case 'today':
        fromDate = now.toISOString().split('T')[0];
        break;
      default:
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    }
    
    const summary = await client.getFinancialSummary({
      from: fromDate,
      to: now.toISOString().split('T')[0],
    });
    
    console.log(`\n📊 Financial Summary (${period}):`);
    console.log(`   📅 Period: ${fromDate} to ${now.toISOString().split('T')[0]}`);
    console.log(`   📚 Total Bookings: ${summary.total_bookings}`);
    console.log(`   💰 Total Revenue: $${summary.total_revenue.toFixed(2)}`);
    
    if (summary.total_bookings > 0) {
      const avgRevenue = summary.total_revenue / summary.total_bookings;
      console.log(`   📈 Average Revenue per Booking: $${avgRevenue.toFixed(2)}`);
    }
  }

  private async handleBookingQuery(client: OwnerRezClient, query: string): Promise<void> {
    console.log('📅 Processing booking query...');
    
    if (query.includes('unread') || query.includes('new') || query.includes('recent')) {
      const bookings = await client.getBookings({ limit: 5, status: 'confirmed' });
      console.log(`\n📚 Recent Bookings (${bookings.total} total):`);
      bookings.data.forEach((booking: any) => {
        console.log(`   🆔 ${booking.id} - ${booking.check_in} to ${booking.check_out}`);
      });
    } else {
      const bookings = await client.getBookings({ limit: 10 });
      console.log(`\n📚 All Bookings (${bookings.total} total):`);
      bookings.data.forEach((booking: any) => {
        console.log(`   🆔 ${booking.id} - ${booking.status} - ${booking.check_in} to ${booking.check_out}`);
      });
    }
  }

  private async handlePropertyQuery(client: OwnerRezClient, query: string): Promise<void> {
    console.log('🏠 Processing property query...');
    
    const properties = await client.getProperties({ active: true });
    console.log(`\n🏠 Active Properties (${properties.total} total):`);
    properties.data.forEach((property: any) => {
      console.log(`   🆔 ${property.id} - ${property.name} - ${property.status}`);
    });
  }

  private async handleMessageQuery(client: OwnerRezClient, query: string): Promise<void> {
    console.log('💬 Processing message query...');
    
    if (query.includes('unread')) {
      console.log('📬 Unread messages feature coming soon...');
      console.log('   Use the messages command for now: ownerrez-cli messages list');
    } else {
      console.log('💬 Message management feature coming soon...');
      console.log('   Use the messages command for now: ownerrez-cli messages --help');
    }
  }

  private async handleStatusQuery(client: OwnerRezClient, query: string): Promise<void> {
    console.log('📊 Processing status query...');
    
    // Get overall business status
    const properties = await client.getProperties({ active: true });
    const bookings = await client.getBookings({ limit: 1 });
    
    console.log('\n📊 Business Status Overview:');
    console.log(`   🏠 Active Properties: ${properties.total}`);
    console.log(`   📚 Total Bookings: ${bookings.total}`);
    
    // Test API connectivity
    const isConnected = await client.ping();
    console.log(`   🌐 API Status: ${isConnected ? '✅ Connected' : '❌ Disconnected'}`);
    
    if (isConnected) {
      console.log('\n💡 Try these specific queries:');
      console.log('   • "What\'s my income this month?"');
      console.log('   • "Show me recent bookings"');
      console.log('   • "What properties do I have?"');
    }
  }
}
