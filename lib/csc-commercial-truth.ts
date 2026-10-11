import truth from '@/public/.well-known/csc-commercial-truth.json';
export const cscCommercialTruth = truth;
export const cscPaymentCopy = `Text/model path: ${truth.price.amount} USDC on Base via ${truth.payment.x402_live ? 'live' : 'unavailable'} x402. Public credit-card checkout is ${truth.payment.public_card} for that legacy path. The separate photo entry checks image Stripe availability before an explicit USD 2.99 payment.`;
