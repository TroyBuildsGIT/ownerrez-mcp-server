import { VercelRequest, VercelResponse } from '@vercel/node';

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

  const clientId = process.env.OWNERREZ_CLIENT_ID;
  const clientSecret = process.env.OWNERREZ_CLIENT_SECRET;
  const redirectUri = process.env.OWNERREZ_REDIRECT_URI;
  const currentToken = process.env.OWNERREZ_OAUTH_TOKEN;

  // Check configuration status
  const config = {
    client_id: !!clientId,
    client_secret: !!clientSecret,
    redirect_uri: !!redirectUri,
    oauth_token: !!currentToken
  };

  const isConfigured = config.client_id && config.client_secret && config.redirect_uri;
  const hasToken = config.oauth_token;

  return res.status(200).json({
    status: hasToken ? 'ready' : (isConfigured ? 'configured' : 'needs_setup'),
    configuration: config,
    oauth_flow: {
      step1: {
        title: 'Get Authorization URL',
        endpoint: '/api/oauth/authorize',
        method: 'GET',
        description: 'Get the OwnerRez authorization URL to start OAuth flow'
      },
      step2: {
        title: 'User Authorization',
        description: 'User visits the authorization URL and grants permissions'
      },
      step3: {
        title: 'Handle Callback',
        endpoint: '/api/oauth/callback',
        method: 'GET',
        description: 'OwnerRez redirects here with authorization code, which is exchanged for access token'
      },
      step4: {
        title: 'Token Management',
        endpoint: '/api/oauth/token',
        methods: ['GET', 'POST', 'DELETE'],
        description: 'Check token status, refresh tokens, or revoke access'
      }
    },
    environment_variables: {
      required: {
        OWNERREZ_CLIENT_ID: 'Your OwnerRez OAuth client ID',
        OWNERREZ_CLIENT_SECRET: 'Your OwnerRez OAuth client secret',
        OWNERREZ_REDIRECT_URI: 'OAuth callback URL (e.g., https://your-domain.vercel.app/api/oauth/callback)'
      },
      optional: {
        OWNERREZ_OAUTH_TOKEN: 'Access token (obtained through OAuth flow)',
        OWNERREZ_WEBHOOK_SECRET: 'Secret for verifying webhook signatures'
      }
    },
    quick_start: isConfigured ? {
      step1: 'Visit /api/oauth/authorize to get authorization URL',
      step2: 'Open the authorization URL in your browser',
      step3: 'Complete OAuth flow in OwnerRez',
      step4: 'Copy the access token from callback response',
      step5: 'Set OWNERREZ_OAUTH_TOKEN environment variable',
      step6: 'Test with /api/oauth/token to verify'
    } : {
      error: 'OAuth not configured',
      required_env_vars: [
        'OWNERREZ_CLIENT_ID',
        'OWNERREZ_CLIENT_SECRET', 
        'OWNERREZ_REDIRECT_URI'
      ],
      instructions: 'Set the required environment variables first, then restart your application'
    },
    endpoints: {
      setup: '/api/oauth/setup (this endpoint)',
      authorize: '/api/oauth/authorize',
      callback: '/api/oauth/callback',
      token: '/api/oauth/token',
      webhooks: '/api/webhooks/ownerrez'
    },
    webhook_setup: {
      url: `${req.headers.host ? `https://${req.headers.host}` : 'https://your-domain.vercel.app'}/api/webhooks/ownerrez`,
      events: [
        'booking.created',
        'booking.updated', 
        'booking.cancelled',
        'payment.received',
        'guest.created',
        'property.updated',
        'message.received'
      ],
      note: 'Configure this URL in your OwnerRez webhook settings'
    }
  });
}
