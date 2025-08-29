import { VercelRequest, VercelResponse } from '@vercel/node';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state, error, error_description } = req.query;

    // Handle OAuth error responses
    if (error) {
      console.error('OAuth error:', error, error_description);
      return res.status(400).json({
        error: 'OAuth error',
        details: error_description || error
      });
    }

    // Validate required parameters
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    // Validate state parameter (optional but recommended)
    if (state && typeof state !== 'string') {
      return res.status(400).json({ error: 'Invalid state parameter' });
    }

    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForToken(code);

    // Store token securely (in production, you'd store this in a database)
    // For now, we'll return it to the client
    const response = {
      success: true,
      tokenInfo: {
        access_token: tokenResponse.access_token,
        token_type: tokenResponse.token_type,
        expires_in: tokenResponse.expires_in,
        scope: tokenResponse.scope,
        expires_at: new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString()
      },
      message: 'OAuth flow completed successfully'
    };

    // In a real application, you'd redirect to a success page
    // For API usage, we'll return JSON
    return res.status(200).json(response);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const clientId = process.env.OWNERREZ_OAUTH_CLIENT_ID;
  const clientSecret = process.env.OWNERREZ_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.OWNERREZ_REDIRECT_URI || 'https://your-domain.vercel.app/api/oauth/callback';

  if (!clientId || !clientSecret) {
    throw new Error('Missing OAuth client credentials');
  }

  const tokenUrl = 'https://secure.ownerrez.com/oauth/token';
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'User-Agent': 'ShortTermRentalMCP/1.0'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
  }

  const tokenData: TokenResponse = await response.json();
  
  // Validate required fields
  if (!tokenData.access_token || !tokenData.token_type) {
    throw new Error('Invalid token response from OwnerRez');
  }

  return tokenData;
}
