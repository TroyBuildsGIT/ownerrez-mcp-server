#!/usr/bin/env node

import { Command } from 'commander';
import { config } from 'dotenv';

// Load environment variables
config();

const program = new Command();

program
  .name('ownerrez-cli')
  .description('Global CLI tool for controlling OwnerRez short-term rental business')
  .version('1.0.0')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--debug', 'Enable debug mode');

// Add basic commands for now
program
  .command('test')
  .description('Test the CLI connection')
  .action(() => {
    console.log('✅ CLI is working!');
    console.log('Environment loaded:', process.env.NODE_ENV || 'development');
  });

program
  .command('config')
  .description('Show current configuration')
  .action(() => {
    console.log('📋 Current Configuration:');
    console.log('OwnerRez Email:', process.env.OWNERREZ_EMAIL || 'Not set');
    console.log('OwnerRez API Base URL:', process.env.OWNERREZ_API_BASE_URL || 'Not set');
    console.log('OAuth Client ID:', process.env.OWNERREZ_OAUTH_CLIENT_ID || 'Not set');
  });

program
  .command('ping')
  .description('Test API connectivity')
  .action(async () => {
    console.log('🏓 Testing API connectivity...');
    try {
      // For now, just show that the command works
      console.log('✅ Ping command executed successfully');
      console.log('Note: Full API testing requires working OwnerRez client');
    } catch (error) {
      console.error('❌ API test failed:', error);
    }
  });

// Global error handling
program.exitOverride();
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

// Parse and execute
program.parse();
