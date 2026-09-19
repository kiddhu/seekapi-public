import { cookies } from 'next/headers';
import { env,origin,json,rate,sb,response,failure,HttpError } from '@/lib/inquiries/server';
export async function POST(req:Request){try{origin(req);await rate(req,'login');const b=await json(req);
 if(typeof b.email!=='string'||typeof b.password!=='string'||b.email.length>254||b.password.length>1024)throw new HttpError(400,'Invalid credentials');
 const r=await fetch(env('INQUIRY_SUPABASE_URL')+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:env('INQUIRY_SUPABASE_ANON_KEY'),'Content-Type':'application/json'},body:JSON.stringify({email:b.email,password:b.password}),signal:AbortSignal.timeout(10000)});
 if(!r.ok)throw new HttpError(401,'Sign-in failed');const data=await r.json();
 const allowed=await sb('/rest/v1/inquiry_staff?user_id=eq.'+encodeURIComponent(data.user.id)+'&active=eq.true&select=user_id');
 if(!data.user.email_confirmed_at||!allowed.length)throw new HttpError(403,'Access not permitted');
 (await cookies()).set('seekapi_staff',data.access_token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:Math.min(data.expires_in,3600)});
 return response({ok:true});}catch(e){return failure(e);}}
export async function DELETE(req:Request){try{origin(req);(await cookies()).delete('seekapi_staff');return response({ok:true});}catch(e){return failure(e);}}
