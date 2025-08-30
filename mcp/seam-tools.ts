import { Seam } from 'seam';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const {
  SEAM_API_KEY,
  SEAM_WEBHOOK_URL
} = process.env;

interface SeamDevice {
  device_id: string;
  device_type: string;
  properties: {
    name: string;
    manufacturer: string;
    model: string;
    battery_level?: number;
    online: boolean;
  };
  capabilities_supported: string[];
  location?: {
    location_name?: string;
    timezone?: string;
  };
}

interface AccessCode {
  access_code_id: string;
  device_id: string;
  name: string;
  code: string;
  starts_at?: string;
  ends_at?: string;
  status: string;
}

// Initialize Seam client
function getSeamClient(): Seam {
  if (!SEAM_API_KEY) {
    throw new Error('SEAM_API_KEY environment variable is required');
  }
  
  return new Seam({
    apiKey: SEAM_API_KEY,
    // Add webhook URL if configured
    ...(SEAM_WEBHOOK_URL && { webhookUrl: SEAM_WEBHOOK_URL })
  });
}

// Create Connect Webview for Yale Account Authorization
export async function createYaleConnectWebview(): Promise<any> {
  try {
    const seam = getSeamClient();
    
    const webview = await seam.connectWebviews.create({
      accepted_providers: ["yale"],
      provider_category: "stable",
      custom_redirect_url: "http://localhost:3000/seam/callback",
      device_selection_mode: "none"
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          webview_id: webview.connect_webview_id,
          authorization_url: webview.url,
          status: webview.status,
          instructions: [
            "1. Open the authorization URL in your browser",
            "2. Sign in to your Yale account",
            "3. Grant permissions to Seam",
            "4. Complete the authorization flow",
            "5. Use webview_id to check authorization status"
          ]
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          error: error.message,
          note: "Make sure SEAM_API_KEY is set in environment variables"
        }, null, 2)
      }]
    };
  }
}

// Check Connect Webview Status
export async function checkConnectWebviewStatus(webviewId: string): Promise<any> {
  try {
    const seam = getSeamClient();
    
    const webview = await seam.connectWebviews.get({
      connect_webview_id: webviewId
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          webview_id: webview.connect_webview_id,
          status: webview.status,
          connected_account_id: webview.connected_account_id,
          is_authorized: webview.status === 'authorized'
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          error: error.message
        }, null, 2)
      }]
    };
  }
}

// List All Yale Lock Devices
export async function listYaleLocks(): Promise<any> {
  try {
    const seam = getSeamClient();
    
    const devices = await seam.locks.list({
      manufacturer: "yale"
    });

    const lockData = devices.map((device: any) => ({
      device_id: device.device_id,
      name: device.properties?.name || 'Unnamed Lock',
      manufacturer: device.properties?.manufacturer,
      model: device.properties?.model,
      battery_level: device.properties?.battery?.level,
      online: device.properties?.online,
      locked: device.properties?.locked,
      location: device.location?.location_name,
      capabilities: device.capabilities_supported || []
    }));

    // Save lock mapping for integration
    if (lockData.length > 0) {
      const lockMapping = lockData.reduce((acc: any, lock: any, index: number) => {
        acc[`yale_lock_${index + 1}`] = {
          id: lock.device_id,
          name: lock.name,
          location: lock.location || `2299 Richter - Lock ${index + 1}`,
          type: 'yale_lock',
          model: lock.model,
          online: lock.online
        };
        return acc;
      }, {});
      
      fs.writeFileSync('./yale-locks-seam.json', JSON.stringify(lockMapping, null, 2));
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          total_locks: lockData.length,
          locks: lockData,
          saved_to: lockData.length > 0 ? 'yale-locks-seam.json' : null
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          error: error.message,
          note: "Make sure Yale account is connected via createYaleConnectWebview first"
        }, null, 2)
      }]
    };
  }
}

// Lock a Yale Door
export async function lockYaleDoor(deviceId: string): Promise<any> {
  try {
    const seam = getSeamClient();
    
    const actionAttempt = await seam.locks.lockDoor({
      device_id: deviceId
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          action: 'lock',
          device_id: deviceId,
          action_attempt_id: actionAttempt.action_attempt_id,
          status: actionAttempt.status,
          timestamp: new Date().toISOString()
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          action: 'lock',
          device_id: deviceId,
          error: error.message
        }, null, 2)
      }]
    };
  }
}

// Unlock a Yale Door
export async function unlockYaleDoor(deviceId: string): Promise<any> {
  try {
    const seam = getSeamClient();
    
    const actionAttempt = await seam.locks.unlockDoor({
      device_id: deviceId
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          action: 'unlock',
          device_id: deviceId,
          action_attempt_id: actionAttempt.action_attempt_id,
          status: actionAttempt.status,
          timestamp: new Date().toISOString()
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          action: 'unlock',
          device_id: deviceId,
          error: error.message
        }, null, 2)
      }]
    };
  }
}

// Get Lock Status
export async function getYaleLockStatus(deviceId: string): Promise<any> {
  try {
    const seam = getSeamClient();
    
    const device = await seam.locks.get({
      device_id: deviceId
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          device_id: deviceId,
          name: device.properties?.name,
          locked: device.properties?.locked,
          online: device.properties?.online,
          battery_level: device.properties?.battery?.level,
          last_seen: device.properties?.online ? 'Online' : 'Unknown',
          model: device.properties?.model,
          manufacturer: device.properties?.manufacturer
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          device_id: deviceId,
          error: error.message
        }, null, 2)
      }]
    };
  }
}

// Create Access Code for Guest
export async function createGuestAccessCode(deviceId: string, code: string, guestName: string, startsAt?: string, endsAt?: string): Promise<any> {
  try {
    const seam = getSeamClient();
    
    const accessCodeData: any = {
      device_id: deviceId,
      code: code,
      name: `Guest: ${guestName}`
    };

    if (startsAt) accessCodeData.starts_at = startsAt;
    if (endsAt) accessCodeData.ends_at = endsAt;

    const accessCode = await seam.accessCodes.create(accessCodeData);

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          access_code_id: accessCode.access_code_id,
          device_id: deviceId,
          code: code,
          guest_name: guestName,
          starts_at: startsAt,
          ends_at: endsAt,
          status: accessCode.status,
          created_at: new Date().toISOString()
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          device_id: deviceId,
          guest_name: guestName,
          error: error.message
        }, null, 2)
      }]
    };
  }
}

// Delete Access Code
export async function deleteAccessCode(accessCodeId: string): Promise<any> {
  try {
    const seam = getSeamClient();
    
    await seam.accessCodes.delete({
      access_code_id: accessCodeId
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          access_code_id: accessCodeId,
          action: 'deleted',
          timestamp: new Date().toISOString()
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          access_code_id: accessCodeId,
          error: error.message
        }, null, 2)
      }]
    };
  }
}

// List All Access Codes for a Device
export async function listAccessCodes(deviceId: string): Promise<any> {
  try {
    const seam = getSeamClient();
    
    const accessCodes = await seam.accessCodes.list({
      device_id: deviceId
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          device_id: deviceId,
          total_codes: accessCodes.length,
          access_codes: accessCodes.map((code: any) => ({
            access_code_id: code.access_code_id,
            name: code.name,
            code: code.code,
            status: code.status,
            starts_at: code.starts_at,
            ends_at: code.ends_at
          }))
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          device_id: deviceId,
          error: error.message
        }, null, 2)
      }]
    };
  }
}
