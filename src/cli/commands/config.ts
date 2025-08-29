import { Command } from 'commander';
import { OwnerRezClient } from '../../api/ownerrez-client';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class ConfigCommand {
  private configPath: string;

  constructor(program: Command) {
    this.configPath = path.join(os.homedir(), '.ownerrez-cli.json');
    
    const config = program
      .command('config')
      .description('Configure OwnerRez CLI settings');

    config
      .command('set')
      .description('Set configuration values')
      .option('--token <token>', 'Set API token')
      .option('--base-url <url>', 'Set base URL')
      .action(async (options) => {
        await this.setConfig(options);
      });

    config
      .command('get')
      .description('Get current configuration')
      .action(() => {
        this.getConfig();
      });

    config
      .command('test')
      .description('Test API connectivity')
      .action(async () => {
        await this.testConnection();
      });

    config
      .command('reset')
      .description('Reset configuration to defaults')
      .action(() => {
        this.resetConfig();
      });
  }

  private loadConfig(): any {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(configData);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    
    // Return default config
    return {
      token: process.env.OWNERREZ_API_TOKEN || '',
      baseUrl: process.env.OWNERREZ_BASE_URL || 'https://api.ownerrez.com',
    };
  }

  private saveConfig(config: any): void {
    try {
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
      console.log('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  private async setConfig(options: any): Promise<void> {
    const config = this.loadConfig();
    
    if (options.token) {
      config.token = options.token;
      console.log('API token updated');
    }
    
    if (options.baseUrl) {
      config.baseUrl = options.baseUrl;
      console.log('Base URL updated');
    }

    this.saveConfig(config);
    
    if (options.token || options.baseUrl) {
      console.log('\nTesting connection with new configuration...');
      await this.testConnection();
    }
  }

  private getConfig(): void {
    const config = this.loadConfig();
    
    console.log('\n📋 Current Configuration:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔑 API Token: ${config.token ? '***' + config.token.slice(-4) : 'Not set'}`);
    console.log(`🌐 Base URL: ${config.baseUrl}`);
    console.log(`📁 Config File: ${this.configPath}`);
    
    // Check environment variables
    const envToken = process.env.OWNERREZ_API_TOKEN;
    const envUrl = process.env.OWNERREZ_BASE_URL;
    
    if (envToken || envUrl) {
      console.log('\n🔧 Environment Variables:');
      if (envToken) console.log(`   OWNERREZ_API_TOKEN: ***${envToken.slice(-4)}`);
      if (envUrl) console.log(`   OWNERREZ_BASE_URL: ${envUrl}`);
    }
  }

  private async testConnection(): Promise<void> {
    const config = this.loadConfig();
    
    if (!config.token) {
      console.error('❌ No API token configured. Use "ownerrez-cli config set --token <your-token>"');
      return;
    }

    console.log('\n🧪 Testing API Connection...');
    console.log(`🌐 Base URL: ${config.baseUrl}`);
    
    try {
      const client = new OwnerRezClient(config.token, config.baseUrl);
      const isConnected = await client.ping();
      
      if (isConnected) {
        console.log('✅ Connection successful! API is responding.');
        
        // Test basic API calls
        console.log('\n📊 Testing API endpoints...');
        
        try {
          const properties = await client.getProperties({ limit: 1 });
          console.log(`✅ Properties API: ${properties.total} properties found`);
        } catch (error) {
          console.log(`⚠️  Properties API: ${error.message}`);
        }
        
        try {
          const bookings = await client.getBookings({ limit: 1 });
          console.log(`✅ Bookings API: ${bookings.total} bookings found`);
        } catch (error) {
          console.log(`⚠️  Bookings API: ${error.message}`);
        }
        
      } else {
        console.log('❌ Connection failed. Please check your API token and base URL.');
      }
    } catch (error) {
      console.error('❌ Connection error:', error.message);
      
      if (error.message.includes('Authentication failed')) {
        console.log('\n💡 Try updating your API token:');
        console.log('   ownerrez-cli config set --token <your-new-token>');
      } else if (error.message.includes('ENOTFOUND')) {
        console.log('\n💡 Check your base URL and internet connection');
      }
    }
  }

  private resetConfig(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        fs.unlinkSync(this.configPath);
        console.log('✅ Configuration reset to defaults');
      } else {
        console.log('ℹ️  No configuration file found');
      }
    } catch (error) {
      console.error('Error resetting config:', error);
    }
  }
}
