import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientId = process.env.OWNERREZ_CLIENT_ID;
    const redirectUri = process.env.OWNERREZ_REDIRECT_URI || 'https://your-domain.vercel.app/api/oauth/callback';

    if (!clientId) {
      return res.status(500).json({ error: 'OAuth client ID not configured' });
    }

    // Generate a random state parameter for security
    const state = crypto.randomBytes(16).toString('hex');

    // Define the scopes you need
    const scopes = [
      'read_properties',
      'read_bookings',
      'read_guests',
      'read_payments',
      'read_messages',
      'write_bookings',
      'write_messages'
    ].join(' ');

    // Build the authorization URL
    const authUrl = new URL('https://secure.ownerrez.com/oauth/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scopes);
    authUrl.searchParams.append('state', state);

    // Return the authorization URL and instructions
    return res.status(200).json({
      authorization_url: authUrl.toString(),
      state: state,
      client_id: clientId,
      redirect_uri: redirectUri,
      scopes: scopes.split(' '),
      instructions: {
        step1: 'Copy the authorization_url and open it in your browser',
        step2: 'Log in to your OwnerRez account and authorize the application',
        step3: 'You will be redirected to the callback URL with an authorization code',
        step4: 'The callback will automatically exchange the code for an access token',
        note: 'Save the state parameter to verify the callback response'
      }
    });

  } catch (error) {
    console.error('OAuth authorization error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
