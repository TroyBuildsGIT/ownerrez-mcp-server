import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: string;
    id: string;
    [key: string]: any;
  };
  created: string;
  livemode: boolean;
}

interface WebhookPayload {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: WebhookEvent;
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string;
    idempotency_key?: string;
  };
  type: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-OwnerRez-Signature');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook signature if provided
    const signature = req.headers['x-ownerrez-signature'] as string;
    const webhookSecret = process.env.OWNERREZ_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(
        JSON.stringify(req.body),
        signature,
        webhookSecret
      );
      
      if (!isValid) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const payload: WebhookPayload = req.body;
    
    // Log the webhook event
    console.log('Received OwnerRez webhook:', {
      id: payload.id,
      type: payload.type,
      created: new Date(payload.created * 1000).toISOString(),
      livemode: payload.livemode
    });

    // Process different webhook event types
    await processWebhookEvent(payload);

    // Respond with success
    return res.status(200).json({
      received: true,
      id: payload.id,
      type: payload.type,
      processed_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    // OwnerRez typically uses HMAC-SHA256 for webhook signatures
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');
    
    // Compare signatures safely
    const providedSignature = signature.replace('sha256=', '');
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

async function processWebhookEvent(payload: WebhookPayload): Promise<void> {
  const { type, data } = payload;

  switch (type) {
    case 'booking.created':
      await handleBookingCreated(data);
      break;
    
    case 'booking.updated':
      await handleBookingUpdated(data);
      break;
    
    case 'booking.cancelled':
      await handleBookingCancelled(data);
      break;
    
    case 'payment.received':
      await handlePaymentReceived(data);
      break;
    
    case 'guest.created':
      await handleGuestCreated(data);
      break;
    
    case 'property.updated':
      await handlePropertyUpdated(data);
      break;
    
    case 'message.received':
      await handleMessageReceived(data);
      break;
    
    default:
      console.log(`Unhandled webhook event type: ${type}`);
      // Store for later processing or analysis
      await storeUnhandledEvent(payload);
  }
}

async function handleBookingCreated(data: WebhookEvent): Promise<void> {
  console.log('Processing booking created:', data.id);
  
  // Here you could:
  // - Send notifications
  // - Update external systems
  // - Trigger automated workflows
  // - Update cache/database
  
  // Example: Log important booking details
  const booking = data.data;
  console.log('New booking details:', {
    bookingId: booking.id,
    propertyId: booking.property_id,
    guestName: booking.guest_name,
    checkIn: booking.checkin_date,
    checkOut: booking.checkout_date,
    totalAmount: booking.total_amount
  });
}

async function handleBookingUpdated(data: WebhookEvent): Promise<void> {
  console.log('Processing booking updated:', data.id);
  
  // Handle booking modifications
  const booking = data.data;
  console.log('Updated booking:', {
    bookingId: booking.id,
    changes: booking.changes || 'Not specified'
  });
}

async function handleBookingCancelled(data: WebhookEvent): Promise<void> {
  console.log('Processing booking cancelled:', data.id);
  
  // Handle cancellation workflows
  const booking = data.data;
  console.log('Cancelled booking:', {
    bookingId: booking.id,
    cancellationReason: booking.cancellation_reason,
    refundAmount: booking.refund_amount
  });
}

async function handlePaymentReceived(data: WebhookEvent): Promise<void> {
  console.log('Processing payment received:', data.id);
  
  // Handle payment processing
  const payment = data.data;
  console.log('Payment received:', {
    paymentId: payment.id,
    bookingId: payment.booking_id,
    amount: payment.amount,
    method: payment.payment_method
  });
}

async function handleGuestCreated(data: WebhookEvent): Promise<void> {
  console.log('Processing guest created:', data.id);
  
  // Handle new guest registration
  const guest = data.data;
  console.log('New guest:', {
    guestId: guest.id,
    email: guest.email,
    name: guest.name
  });
}

async function handlePropertyUpdated(data: WebhookEvent): Promise<void> {
  console.log('Processing property updated:', data.id);
  
  // Handle property changes
  const property = data.data;
  console.log('Property updated:', {
    propertyId: property.id,
    name: property.name,
    changes: property.changes || 'Not specified'
  });
}

async function handleMessageReceived(data: WebhookEvent): Promise<void> {
  console.log('Processing message received:', data.id);
  
  // Handle guest messages
  const message = data.data;
  console.log('New message:', {
    messageId: message.id,
    from: message.from,
    subject: message.subject,
    bookingId: message.booking_id
  });
}

async function storeUnhandledEvent(payload: WebhookPayload): Promise<void> {
  // In a real application, you might store this in a database
  // or queue for later processing
  console.log('Storing unhandled event for analysis:', {
    id: payload.id,
    type: payload.type,
    timestamp: new Date().toISOString()
  });
  
  // You could also send this to a monitoring service
  // or trigger an alert for unknown event types
}
