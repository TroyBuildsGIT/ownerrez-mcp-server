import { Command } from 'commander';
import { OwnerRezClient } from '../../api/ownerrez-client';
import { loadConfig } from '../utils/config-loader';

export class GuestsCommand {
  constructor(program: Command) {
    const guests = program
      .command('guests')
      .description('Manage OwnerRez guests');

    guests
      .command('list')
      .description('List guests')
      .action(async (options) => {
        await this.listGuests(options);
      });

    guests
      .command('get')
      .description('Get a specific guest')
      .argument('<id>', 'Guest ID')
      .action(async (id) => {
        await this.getGuest(id);
      });

    guests
      .command('create')
      .description('Create a new guest')
      .option('--first-name <name>', 'First name')
      .option('--last-name <name>', 'Last name')
      .option('--email <email>', 'Email address')
      .action(async (options) => {
        await this.createGuest(options);
      });

    guests
      .command('update')
      .description('Update a guest')
      .argument('<id>', 'Guest ID')
      .option('--first-name <name>', 'First name')
      .option('--last-name <name>', 'Last name')
      .option('--email <email>', 'Email address')
      .action(async (id, options) => {
        await this.updateGuest(id, options);
      });
  }

  private async listGuests(options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const result = await client.getGuests(options);
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error listing guests:', error.message);
    }
  }

  private async getGuest(id: string): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const guest = await client.getGuest(id);
      console.log(JSON.stringify(guest, null, 2));
    } catch (error) {
      console.error('Error getting guest:', error.message);
    }
  }

  private async createGuest(options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const guest = await client.createGuest(options);
      console.log('Successfully created guest:', guest);
    } catch (error) {
      console.error('Error creating guest:', error.message);
    }
  }

  private async updateGuest(id: string, options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const guest = await client.updateGuest(id, options);
      console.log('Successfully updated guest:', guest);
    } catch (error) {
      console.error('Error updating guest:', error.message);
    }
  }
}