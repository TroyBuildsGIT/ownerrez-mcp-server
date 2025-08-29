import dotenv from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

export interface Config {
  // API Configuration
  ownerrez: {
    baseUrl: string;
    apiKey: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  
  // CLI Configuration
  cli: {
    defaultPropertyId?: string;
    outputFormat: 'json' | 'table' | 'csv';
    debug: boolean;
  };
  
  // File paths
  paths: {
    configDir: string;
    cacheDir: string;
    logsDir: string;
  };
}

export const config: Config = {
  ownerrez: {
    baseUrl: process.env.OWNERREZ_BASE_URL || 'https://api.ownerrez.com',
    apiKey: process.env.OWNERREZ_API_KEY || '',
    clientId: process.env.OWNERREZ_CLIENT_ID || '',
    clientSecret: process.env.OWNERREZ_CLIENT_SECRET || '',
    redirectUri: process.env.OWNERREZ_REDIRECT_URI || 'http://localhost:3000/callback'
  },
  
  cli: {
    defaultPropertyId: process.env.DEFAULT_PROPERTY_ID,
    outputFormat: (process.env.OUTPUT_FORMAT as 'json' | 'table' | 'csv') || 'table',
    debug: process.env.DEBUG === 'true'
  },
  
  paths: {
    configDir: process.env.CONFIG_DIR || join(__dirname, '../../config'),
    cacheDir: process.env.CACHE_DIR || join(__dirname, '../../cache'),
    logsDir: process.env.LOGS_DIR || join(__dirname, '../../logs')
  }
};

// Validate required configuration
export function validateConfig(): void {
  const required = ['OWNERREZ_API_KEY', 'OWNERREZ_CLIENT_ID', 'OWNERREZ_CLIENT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
