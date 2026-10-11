import truth from '@/public/.well-known/csc-commercial-truth.json';
export const cscCommercialTruth = truth;
export const cscPaymentCopy = `${truth.price.amount} USDC on Base via ${truth.payment.x402_live ? 'live' : 'unavailable'} x402. Public credit-card checkout is ${truth.payment.public_card}.`;
