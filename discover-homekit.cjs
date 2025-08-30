#!/usr/bin/env node

// Simple HomeKit discovery script
const mdns = require('mdns');
const http = require('http');

console.log('🔍 Scanning for HomeKit accessories...\n');

// Look for HAP (HomeKit Accessory Protocol) services
const sequence = [
  mdns.rst.DNSServiceResolve(),
  'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({families:[4]}),
  mdns.rst.makeAddressesUnique()
];

const browser = mdns.createBrowser(mdns.tcp('hap'), {resolverSequence: sequence});

browser.on('serviceUp', (service) => {
  console.log('🏠 Found HomeKit accessory:');
  console.log('   Name:', service.name);
  console.log('   Type:', service.type.name);
  console.log('   Host:', service.host);
  console.log('   Port:', service.port);
  console.log('   Addresses:', service.addresses);
  if (service.txtRecord) {
    console.log('   TXT Record:', service.txtRecord);
    if (service.txtRecord.md) {
      console.log('   Model:', service.txtRecord.md);
    }
    if (service.txtRecord.id) {
      console.log('   Device ID:', service.txtRecord.id);
    }
  }
  console.log('');
});

browser.on('serviceDown', (service) => {
  console.log('📴 HomeKit accessory went offline:', service.name);
});

browser.on('error', (error) => {
  console.log('❌ Discovery error:', error.message);
});

console.log('Starting discovery (will run for 10 seconds)...');
browser.start();

// Stop after 10 seconds
setTimeout(() => {
  console.log('🔍 Discovery complete!');
  browser.stop();
  process.exit(0);
}, 10000);

// Also try to get info from the bridge directly
setTimeout(() => {
  console.log('📋 Trying to get bridge info...');
  const req = http.request({
    hostname: 'localhost',
    port: 51826,
    path: '/accessories',
    method: 'GET',
    headers: {
      'Content-Type': 'application/hap+json'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('🏠 Bridge accessories:', data);
    });
  });
  
  req.on('error', (e) => {
    console.log('❌ Bridge query failed:', e.message);
  });
  
  req.end();
}, 2000);
