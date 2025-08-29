import { Command } from 'commander';
import { OwnerRezClient } from '../../api/ownerrez-client';
import { loadConfig } from '../utils/config-loader';

export class QuotesCommand {
  constructor(program: Command) {
    const quotes = program
      .command('quotes')
      .description('Manage OwnerRez quotes');

    quotes
      .command('list')
      .description('List quotes')
      .action(async (options) => {
        await this.listQuotes(options);
      });

    quotes
      .command('get')
      .description('Get a specific quote')
      .argument('<id>', 'Quote ID')
      .action(async (id) => {
        await this.getQuote(id);
      });

    quotes
      .command('create')
      .description('Create a new quote')
      .option('--property-id <id>', 'Property ID')
      .option('--guest-id <id>', 'Guest ID')
      .option('--arrival-date <date>', 'Arrival date')
      .option('--departure-date <date>', 'Departure date')
      .action(async (options) => {
        await this.createQuote(options);
      });

    quotes
      .command('update')
      .description('Update a quote')
      .argument('<id>', 'Quote ID')
      .option('--status <status>', 'New status')
      .action(async (id, options) => {
        await this.updateQuote(id, options);
      });
  }

  private async listQuotes(options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const result = await client.getQuotes(options);
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error listing quotes:', error.message);
    }
  }

  private async getQuote(id: string): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const quote = await client.getQuoteById(parseInt(id));
      console.log(JSON.stringify(quote, null, 2));
    } catch (error) {
      console.error('Error getting quote:', error.message);
    }
  }

  private async createQuote(options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const quote = await client.createQuote(options);
      console.log('Successfully created quote:', quote);
    } catch (error) {
      console.error('Error creating quote:', error.message);
    }
  }

  private async updateQuote(id: string, options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const quote = await client.updateQuote(parseInt(id), options);
      console.log('Successfully updated quote:', quote);
    } catch (error) {
      console.error('Error updating quote:', error.message);
    }
  }
}
