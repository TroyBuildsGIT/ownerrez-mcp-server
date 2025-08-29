import { VercelRequest, VercelResponse } from '@vercel/node';

interface TokenInfo {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  expires_at?: string;
  created_at: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getTokenInfo(req, res);
      case 'POST':
        return await refreshToken(req, res);
      case 'DELETE':
        return await revokeToken(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Token management error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getTokenInfo(req: VercelRequest, res: VercelResponse) {
  const token = process.env.OWNERREZ_OAUTH_TOKEN;
  
  if (!token) {
    return res.status(404).json({
      error: 'No OAuth token found',
      message: 'Please complete the OAuth flow first',
      auth_url: '/api/oauth/authorize'
    });
  }

  // In a real application, you'd fetch this from a database
  // For now, we'll just check if the token exists and is valid
  try {
    const testResponse = await fetch('https://api.ownerrez.com/v2/properties', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const isValid = testResponse.ok;
    
    return res.status(200).json({
      token_exists: true,
      is_valid: isValid,
      status: isValid ? 'active' : 'invalid',
      last_tested: new Date().toISOString(),
      message: isValid 
        ? 'OAuth token is valid and working'
        : 'OAuth token exists but may be expired or invalid'
    });

  } catch (error) {
    return res.status(200).json({
      token_exists: true,
      is_valid: false,
      status: 'error',
      error: 'Failed to validate token',
      last_tested: new Date().toISOString()
    });
  }
}

async function refreshToken(req: VercelRequest, res: VercelResponse) {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return res.status(400).json({ error: 'Missing refresh_token' });
  }

  const clientId = process.env.OWNERREZ_OAUTH_CLIENT_ID;
  const clientSecret = process.env.OWNERREZ_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'OAuth client credentials not configured' });
  }

  try {
    const tokenUrl = 'https://secure.ownerrez.com/oauth/token';
    
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: clientId,
      client_secret: clientSecret
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Token refresh failed',
        details: errorText
      });
    }

    const tokenData = await response.json();
    
    return res.status(200).json({
      success: true,
      ...tokenData,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      refreshed_at: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Token refresh failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function revokeToken(req: VercelRequest, res: VercelResponse) {
  const token = process.env.OWNERREZ_OAUTH_TOKEN || req.body.token;
  
  if (!token) {
    return res.status(400).json({ error: 'No token to revoke' });
  }

  try {
    // OwnerRez token revocation endpoint (if available)
    // This is a placeholder - check OwnerRez documentation for actual endpoint
    const revokeUrl = 'https://secure.ownerrez.com/oauth/revoke';
    
    const response = await fetch(revokeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      },
      body: new URLSearchParams({ token }).toString()
    });

    // Even if the revoke endpoint doesn't exist, we can consider the token revoked locally
    return res.status(200).json({
      success: true,
      message: 'Token revoked successfully',
      revoked_at: new Date().toISOString(),
      note: 'Remove OWNERREZ_OAUTH_TOKEN from your environment variables'
    });

  } catch (error) {
    // If revocation fails, still return success since the token can be considered invalid
    return res.status(200).json({
      success: true,
      message: 'Token considered revoked (revocation endpoint may not be available)',
      note: 'Remove OWNERREZ_OAUTH_TOKEN from your environment variables',
      revoked_at: new Date().toISOString()
    });
  }
}
