// Short Term Rental MCP Tools - Unified OwnerRez + Nest + Yale Lock Integration
import { search as orSearch, fetch as orFetch } from "./tools";
import * as nestTools from "./nest-tools";
import * as seamTools from "./seam-tools";

// Device ID mapping for the property (2299 Richter Street)
const DEVICE_MAPPING = {
  "2299-richter": {
    thermostats: {
      "thermostat1": {
        id: "enterprises/d7173b79-00e6-476e-9c3b-487a5f3047c2/devices/AVPHwEvQVT9bgh0SQ-EruRKioUBAUEUXji_SHr8mkY4Z8C4Jn7XzAtgQ_iblIGtZcx96Y0_782ZTvzbKLRTnrVqk8c7y",
        name: "thermostat - 2-1",
        location: "2299 richter - 2-1",
        zone: "Unit 2-1"
      },
      "thermostat2": {
        id: "enterprises/d7173b79-00e6-476e-9c3b-487a5f3047c2/devices/AVPHwEsUWKSlsM764Lr9ceBntDGPU5Ztwz3Yh7nUxwJCCSZqXBPUBuIatcrS553pRls9gABP1zmHr9sbQ7RzkUWXiuBB",
        name: "4-3 thermostat", 
        location: "Kitchen",
        zone: "Unit 4-3"
      }
    },
    door_locks: {
      // Yale locks via Seam API (universal lock control)
      "front_door": {
        id: "seam_device_placeholder", // Will be populated after Seam authorization
        name: "Front Door Yale Lock",
        location: "Main Entrance - 2299 Richter",
        type: "yale_lock",
        api: "seam" // Can be "seam" or "google_device_access"
      },
      "back_door": {
        id: "seam_device_placeholder",
        name: "Back Door Yale Lock", 
        location: "Rear Entrance - 2299 Richter",
        type: "yale_lock",
        api: "seam"
      }
    }
  }
};

export async function searchRentals(query: string): Promise<any> {
  // Use existing OwnerRez search functionality
  return orSearch(query);
}

export async function fetchRental(id: string): Promise<any> {
  // Use existing OwnerRez fetch functionality  
  return orFetch(id);
}

export async function listSmartDevices(): Promise<any> {
  try {
    const nestDevices = await nestTools.listDevices();
    const devices = JSON.parse(nestDevices.content[0].text);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          property_devices: DEVICE_MAPPING,
          nest_devices: devices.devices || [],
          total_devices: devices.count || 0,
          available_actions: [
            "Set thermostat temperature",
            "Change thermostat mode", 
            "Set temperature range",
            "Get device status"
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
          error: error.message
        }, null, 2)
      }]
    };
  }
}

export async function controlThermostat(action: string, ...params: any[]): Promise<any> {
  const thermostats = DEVICE_MAPPING["2299-richter"].thermostats;
  
  try {
    switch (action.toLowerCase()) {
      case 'set_temperature':
      case 'set_temp':
        const [temp, mode, zone] = params;
        if (zone) {
          // Control specific thermostat
          const thermostat = Object.values(thermostats).find(t => t.zone.toLowerCase().includes(zone.toLowerCase()));
          if (!thermostat) {
            throw new Error(`Zone '${zone}' not found. Available: ${Object.values(thermostats).map(t => t.zone).join(', ')}`);
          }
          return await nestTools.setThermostatTemperature(thermostat.id, temp, mode || 'cool');
        } else {
          // Control all thermostats
          const results = [];
          for (const [key, thermostat] of Object.entries(thermostats)) {
            const result = await nestTools.setThermostatTemperature(thermostat.id, temp, mode || 'cool');
            results.push({ zone: thermostat.zone, result: JSON.parse(result.content[0].text) });
          }
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                success: true,
                action: `Set all thermostats to ${temp}°C`,
                results
              }, null, 2)
            }]
          };
        }
        
      case 'set_mode':
        const [thermoMode, targetZone] = params;
        if (targetZone) {
          // Control specific thermostat
          const thermostat = Object.values(thermostats).find(t => t.zone.toLowerCase().includes(targetZone.toLowerCase()));
          if (!thermostat) {
            throw new Error(`Zone '${targetZone}' not found. Available: ${Object.values(thermostats).map(t => t.zone).join(', ')}`);
          }
          return await nestTools.setThermostatMode(thermostat.id, thermoMode);
        } else {
          // Control all thermostats
          const results = [];
          for (const [key, thermostat] of Object.entries(thermostats)) {
            const result = await nestTools.setThermostatMode(thermostat.id, thermoMode);
            results.push({ zone: thermostat.zone, result: JSON.parse(result.content[0].text) });
          }
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                success: true,
                action: `Set all thermostats to ${thermoMode} mode`,
                results
              }, null, 2)
            }]
          };
        }
        
      case 'set_range':
        const [heatTemp, coolTemp, rangeZone] = params;
        if (rangeZone) {
          // Control specific thermostat
          const thermostat = Object.values(thermostats).find(t => t.zone.toLowerCase().includes(rangeZone.toLowerCase()));
          if (!thermostat) {
            throw new Error(`Zone '${rangeZone}' not found. Available: ${Object.values(thermostats).map(t => t.zone).join(', ')}`);
          }
          return await nestTools.setThermostatRange(thermostat.id, heatTemp, coolTemp);
        } else {
          // Control all thermostats
          const results = [];
          for (const [key, thermostat] of Object.entries(thermostats)) {
            const result = await nestTools.setThermostatRange(thermostat.id, heatTemp, coolTemp);
            results.push({ zone: thermostat.zone, result: JSON.parse(result.content[0].text) });
          }
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                success: true,
                action: `Set all thermostats range: ${heatTemp}-${coolTemp}°C`,
                results
              }, null, 2)
            }]
          };
        }
        
      case 'status':
      case 'get_status':
        const [statusZone] = params;
        if (statusZone) {
          // Get specific thermostat status
          const thermostat = Object.values(thermostats).find(t => t.zone.toLowerCase().includes(statusZone.toLowerCase()));
          if (!thermostat) {
            throw new Error(`Zone '${statusZone}' not found. Available: ${Object.values(thermostats).map(t => t.zone).join(', ')}`);
          }
          return await nestTools.getDevice(thermostat.id);
        } else {
          // Get all thermostat statuses
          const results = [];
          for (const [key, thermostat] of Object.entries(thermostats)) {
            const result = await nestTools.getDevice(thermostat.id);
            const deviceData = JSON.parse(result.content[0].text);
            results.push({ 
              zone: thermostat.zone, 
              name: thermostat.name,
              location: thermostat.location,
              status: deviceData 
            });
          }
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                success: true,
                total_thermostats: results.length,
                thermostats: results
              }, null, 2)
            }]
          };
        }
        
      default:
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Unknown action: ${action}`,
              available_actions: ["set_temperature", "set_mode", "set_range", "status"],
              available_zones: Object.values(thermostats).map(t => t.zone),
              usage_examples: [
                "set_temperature 22 cool 'Unit 2-1'  // Set specific zone",
                "set_temperature 22 cool              // Set all zones",
                "status 'Unit 4-3'                   // Get specific zone",
                "status                               // Get all zones"
              ]
            }, null, 2)
          }]
        };
    }
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

// Rental management workflow helpers
export async function prepareUnitForGuest(bookingId: string, guestPreferences?: any): Promise<any> {
  try {
    // 1. Get booking details
    const bookingResult = await orFetch(`booking:${bookingId}`);
    const booking = JSON.parse(bookingResult.content[0].text);
    
    // 2. Set comfortable temperature for arrival
    const tempResult = await controlThermostat('set_mode', 'HEATCOOL');
    const rangeResult = await controlThermostat('set_range', 20, 24); // 68-75°F
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          booking_id: bookingId,
          guest: booking.title,
          actions_completed: [
            "Retrieved booking details",
            "Set thermostat to auto mode",
            "Set comfortable temperature range (20-24°C / 68-75°F)"
          ],
          thermostat_status: {
            mode_result: JSON.parse(tempResult.content[0].text),
            range_result: JSON.parse(rangeResult.content[0].text)
          },
          next_steps: [
            "Unit is prepared for guest arrival",
            "Monitor temperature before check-in"
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
          error: error.message
        }, null, 2)
      }]
    };
  }
}

export async function checkoutRoutine(bookingId: string): Promise<any> {
  try {
    // 1. Get booking details
    const bookingResult = await orFetch(`booking:${bookingId}`);
    const booking = JSON.parse(bookingResult.content[0].text);
    
    // 2. Set energy-saving temperature
    const ecoResult = await controlThermostat('set_range', 16, 26); // 61-79°F for energy saving
    
    return {
      content: [{
        type: "text", 
        text: JSON.stringify({
          success: true,
          booking_id: bookingId,
          guest: booking.title,
          actions_completed: [
            "Retrieved booking details",
            "Set thermostat to energy-saving mode",
            "Set eco temperature range (16-26°C / 61-79°F)"
          ],
          energy_savings: {
            range_result: JSON.parse(ecoResult.content[0].text)
          },
          next_steps: [
            "Unit ready for next guest",
            "Monitor for cleaning completion"
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
          error: error.message
        }, null, 2)
      }]
    };
  }
}

// Income tracking with environmental efficiency
export async function getPropertyStats(propertyId?: string): Promise<any> {
  try {
    // Get recent bookings
    const bookingsResult = await orSearch("recent bookings");
    const bookings = JSON.parse(bookingsResult.content[0].text);
    
    // Get current device status
    const devicesResult = await listSmartDevices();
    const devices = JSON.parse(devicesResult.content[0].text);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          property_overview: {
            recent_bookings: bookings.results?.length || 0,
            smart_devices: devices.total_devices || 0,
            automation_status: "Active"
          },
          bookings_summary: bookings.results || [],
          smart_home_status: devices.nest_devices || [],
          efficiency_features: [
            "Automated temperature control",
            "Energy-saving checkout routine", 
            "Guest comfort optimization"
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
          error: error.message
        }, null, 2)
      }]
    };
  }
}
