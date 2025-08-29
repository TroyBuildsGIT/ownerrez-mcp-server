import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface Config {
  token: string;
  baseUrl: string;
}

export function loadConfig(): Config {
  const configPath = path.join(os.homedir(), '.ownerrez-cli.json');
  
  // Try to load from config file first
  try {
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      const fileConfig = JSON.parse(configData);
      
      return {
        token: fileConfig.token || process.env.OWNERREZ_API_TOKEN || '',
        baseUrl: fileConfig.baseUrl || process.env.OWNERREZ_BASE_URL || 'https://api.ownerrez.com',
      };
    }
  } catch (error) {
    console.warn('Warning: Could not load config file, using environment variables');
  }
  
  // Fall back to environment variables
  return {
    token: process.env.OWNERREZ_API_TOKEN || '',
    baseUrl: process.env.OWNERREZ_BASE_URL || 'https://api.ownerrez.com',
  };
}
