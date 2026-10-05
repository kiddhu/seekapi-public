import { checkoutProxy } from '@/lib/checkout-proxy';
export const dynamic = 'force-dynamic';
export async function POST(request:Request,{params}:{params:Promise<{operation:string}>}){
  return checkoutProxy(request,(await params).operation);
}
