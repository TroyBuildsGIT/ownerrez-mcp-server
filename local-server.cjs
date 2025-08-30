#!/usr/bin/env node

// Simple local OAuth server for testing
const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;

// Simple OAuth test endpoint
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>🏠 Short Term Rental MCP Server</title>
        <style>
          body { font-family: -apple-system, sans-serif; margin: 40px; line-height: 1.6; }
          .success { color: #10b981; }
          .info { color: #3b82f6; }
          .warning { color: #f59e0b; }
          .code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
          .card { border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 16px 0; }
        </style>
      </head>
      <body>
        <h1>🏠 Short Term Rental MCP Server</h1>
        <div class="card">
          <h2 class="success">✅ Server Running Successfully!</h2>
          <p><strong>Port:</strong> ${PORT}</p>
          <p><strong>Status:</strong> Ready for OAuth testing</p>
        </div>
        
        <div class="card">
          <h3 class="info">🔗 Available Endpoints:</h3>
          <ul>
            <li><code>/oauth/authorize</code> - Start OAuth flow</li>
            <li><code>/oauth/callback</code> - OAuth callback handler</li>
            <li><code>/test</code> - API test endpoint</li>
            <li><code>/health</code> - Health check</li>
          </ul>
        </div>
        
        <div class="card">
          <h3 class="info">🧪 Test OAuth Flow:</h3>
          <p>1. Visit: <a href="/oauth/authorize">/oauth/authorize</a></p>
          <p>2. Complete the authorization</p>
          <p>3. Return to this page after callback</p>
        </div>
        
        <div class="card">
          <h3 class="warning">📝 Next Steps:</h3>
          <ul>
            <li>✅ Local server is running</li>
            <li>✅ OAuth endpoints are available</li>
            <li>✅ Production deployment is live</li>
            <li>🔧 Test the OAuth flow locally</li>
            <li>🔧 Verify production OAuth works</li>
          </ul>
        </div>
      </body>
      </html>
    `);
    return;
  }
  
  if (path === '/oauth/authorize') {
    // Nest OAuth authorization URL
    const authUrl = 'https://nestservices.google.com/partnerconnections/' +
      'd7173b79-00e6-476e-9c3b-487a5f3047c2/auth?' +
      'redirect_uri=http://localhost:3000/oauth/callback&' +
      'access_type=offline&' +
      'prompt=consent&' +
      'client_id=721613593121-skmv6j4g31ts0nod28cgsb2794p11ph9.apps.googleusercontent.com&' +
      'response_type=code&' +
      'scope=https://www.googleapis.com/auth/sdm.service';
    
    res.writeHead(302, { 'Location': authUrl });
    res.end();
    return;
  }
  
  if (path === '/oauth/callback') {
    const code = parsedUrl.query.code;
    const error = parsedUrl.query.error;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    if (error) {
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>OAuth Error</title></head>
        <body>
          <h1>❌ OAuth Error</h1>
          <p>Error: ${error}</p>
          <p><a href="/">← Back to Home</a></p>
        </body>
        </html>
      `);
      return;
    }
    
    if (code) {
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>🎉 OAuth Success!</title></head>
        <body style="font-family: -apple-system, sans-serif; margin: 40px;">
          <h1>🎉 OAuth Authorization Successful!</h1>
          <p>Your Nest devices are now ready to be controlled via your MCP system.</p>
          <p><strong>Authorization Code:</strong> <code>${code.substring(0, 20)}...</code></p>
          <p>You can now close this window and return to your terminal.</p>
          <p><a href="/">← Back to Home</a></p>
          <script>
            // Save the code for curl testing
            console.log('Authorization Code:', '${code}');
            localStorage.setItem('nest_auth_code', '${code}');
          </script>
        </body>
        </html>
      `);
      return;
    }
    
    res.end('No authorization code received');
    return;
  }
  
  if (path === '/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'success',
      message: 'OAuth server is working!',
      timestamp: new Date().toISOString(),
      endpoints: {
        oauth_authorize: '/oauth/authorize',
        oauth_callback: '/oauth/callback',
        health: '/health'
      }
    }, null, 2));
    return;
  }
  
  if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // 404 for unknown paths
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head><title>404 Not Found</title></head>
    <body style="font-family: -apple-system, sans-serif; margin: 40px;">
      <h1>404 Not Found</h1>
      <p>The page <code>${path}</code> was not found.</p>
      <p><a href="/">← Back to Home</a></p>
    </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`🏠 Short Term Rental OAuth Server running on http://localhost:${PORT}`);
  console.log(`🔗 Open http://localhost:${PORT} in your browser to test`);
  console.log(`🧪 OAuth flow: http://localhost:${PORT}/oauth/authorize`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try a different port:`);
    console.error(`   PORT=3001 node local-server.js`);
  } else {
    console.error('❌ Server error:', err);
  }
});
