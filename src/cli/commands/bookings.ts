import { Command } from 'commander';
import { OwnerRezClient } from '../../api/ownerrez-client';
import { loadConfig } from '../utils/config-loader';

export class BookingsCommand {
  constructor(program: Command) {
    const bookings = program
      .command('bookings')
      .description('Manage OwnerRez bookings');

    bookings
      .command('list')
      .description('List bookings')
      .action(async (options) => {
        await this.listBookings(options);
      });

    bookings
      .command('get')
      .description('Get a specific booking')
      .argument('<id>', 'Booking ID')
      .action(async (id) => {
        await this.getBooking(id);
      });

    bookings
      .command('create')
      .description('Create a new booking')
      .option('--property-id <id>', 'Property ID')
      .option('--guest-id <id>', 'Guest ID')
      .option('--arrival-date <date>', 'Arrival date')
      .option('--departure-date <date>', 'Departure date')
      .action(async (options) => {
        await this.createBooking(options);
      });

    bookings
      .command('update')
      .description('Update a booking')
      .argument('<id>', 'Booking ID')
      .option('--status <status>', 'New status')
      .action(async (id, options) => {
        await this.updateBooking(id, options);
      });
  }

  private async listBookings(options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const result = await client.getBookings(options);
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error listing bookings:', error.message);
    }
  }

  private async getBooking(id: string): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const booking = await client.getBookingById(parseInt(id));
      console.log(JSON.stringify(booking, null, 2));
    } catch (error) {
      console.error('Error getting booking:', error.message);
    }
  }

  private async createBooking(options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const booking = await client.createBooking(options);
      console.log('Successfully created booking:', booking);
    } catch (error) {
      console.error('Error creating booking:', error.message);
    }
  }

  private async updateBooking(id: string, options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const booking = await client.updateBooking(parseInt(id), options);
      console.log('Successfully updated booking:', booking);
    } catch (error) {
      console.error('Error updating booking:', error.message);
    }
  }

  private async deleteBooking(id: string, options: any): Promise<void> {
    if (!options.force) {
      console.log('This is a destructive action. Use the --force flag to proceed.');
      return;
    }
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      await client.deleteBooking(parseInt(id));
      console.log(`✅ Successfully deleted booking ${id}.`);
    } catch (error) {
      console.error(`❌ Error deleting booking ${id}:`, error.message);
    }
  }
}