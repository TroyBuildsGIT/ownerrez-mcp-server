import { Command } from 'commander';
import { OwnerRezClient } from '../../api/ownerrez-client';
import { loadConfig } from '../utils/config-loader';

export class PropertiesCommand {
  constructor(program: Command) {
    const properties = program
      .command('properties')
      .description('Manage OwnerRez properties');

    properties
      .command('list')
      .description('List properties')
      .option('--active', 'Show only active properties')
      .option('--status <status>', 'Filter by status')
      .action(async (options) => {
        await this.listProperties(options);
      });

    properties
      .command('get')
      .description('Get a specific property')
      .argument('<id>', 'Property ID')
      .action(async (id) => {
        await this.getProperty(id);
      });

    properties
      .command('delete')
      .description('Delete a property')
      .argument('<id>', 'Property ID')
      .option('--force', 'Permanently delete the property without confirmation')
      .action(async (id, options) => {
        await this.deleteProperty(id, options);
      });
  }

  private async listProperties(options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      
      const params: any = {};
      if (options.active) params.active = true;
      if (options.status) params.status = options.status;
      
      const result = await client.getProperties(params);
      
      console.log(`\n🏠 Properties (${result.total} total):`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      result.data.forEach((property: any) => {
        console.log(`🆔 ${property.id} - ${property.name}`);
        console.log(`   📊 Status: ${property.status}`);
        if (property.address) console.log(`   📍 Address: ${property.address}`);
        console.log('');
      });
    } catch (error) {
      console.error('❌ Error listing properties:', error.message);
    }
  }

  private async getProperty(id: string): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      
      const property = await client.getProperty(id);
      
      console.log(`\n🏠 Property Details (${id}):`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🆔 ID: ${property.id}`);
      console.log(`🏷️  Name: ${property.name}`);
      console.log(`📊 Status: ${property.status}`);
      if (property.address) console.log(`📍 Address: ${property.address}`);
      console.log(`📝 Created: ${property.created_at}`);
      console.log(`🔄 Updated: ${property.updated_at}`);
    } catch (error) {
      console.error('❌ Error getting property:', error.message);
    }
  }

  private async createProperty(options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const property = await client.createProperty(options);
      console.log('✅ Successfully created property:', property);
    } catch (error) {
      console.error('❌ Error creating property:', error.message);
    }
  }

  private async updateProperty(id: string, options: any): Promise<void> {
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const property = await client.updateProperty(parseInt(id), options);
      console.log('✅ Successfully updated property:', property);
    } catch (error) {
      console.error('❌ Error updating property:', error.message);
    }
  }

  private async deleteProperty(id: string, options: any): Promise<void> {
    if (!options.force) {
      console.log('This is a destructive action. Use the --force flag to proceed.');
      return;
    }
    try {
      const config = loadConfig();
      const client = new OwnerRezClient(config.token, config.baseUrl);
      await client.deleteProperty(parseInt(id));
      console.log(`✅ Successfully deleted property ${id}.`);
    } catch (error) {
      console.error(`❌ Error deleting property ${id}:`, error.message);
    }
  }
}
