import 'server-only';
import { createHash, createHmac } from 'node:crypto';
import { cookies } from 'next/headers';
import { InputError } from './core';
export class HttpError extends Error { constructor(public status:number,message:string){super(message);} }
export function env(name:string){const value=process.env[name];if(!value)throw new HttpError(503,'Service temporarily unavailable');return value;}
export function hash(value:string){return createHash('sha256').update(value).digest('hex');}
export function enabled(){return process.env.INQUIRIES_ENABLED==='1';}
export function origin(req:Request){const actual=req.headers.get('origin');const allowed=env('INQUIRY_ALLOWED_ORIGINS').split(',').map(x=>x.trim());if(!actual||!allowed.includes(actual))throw new HttpError(403,'Request not allowed');}
export async function json(req:Request){if(!req.headers.get('content-type')?.startsWith('application/json'))throw new HttpError(415,'JSON required');const reader=req.body?.getReader();if(!reader)throw new InputError('Empty request');const chunks:Uint8Array[]=[];let size=0;try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>65536){await reader.cancel();throw new HttpError(413,'Request too large');}chunks.push(value);}return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch(e){if(e instanceof HttpError)throw e;throw new InputError('Invalid JSON');}}
export async function sb(path:string,init:RequestInit={}){
  const key=env('INQUIRY_SUPABASE_SERVICE_ROLE_KEY');const res=await fetch(env('INQUIRY_SUPABASE_URL')+path,{...init,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',...init.headers},cache:'no-store',signal:AbortSignal.timeout(20000)});
  if(!res.ok)throw new HttpError(503,'Service temporarily unavailable');if(res.status===204)return null;return res.json();
}
export function rpc(name:string,body:unknown){return sb('/rest/v1/rpc/'+name,{method:'POST',body:JSON.stringify(body)});}
export function response(value:unknown,status=200){return Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'}});}
export function failure(e:unknown){return response({error:e instanceof InputError?'Please check the required fields and supported files.':e instanceof HttpError?e.message:'Service temporarily unavailable. Your form has not been cleared.'},e instanceof InputError?400:e instanceof HttpError?e.status:503);}
export async function rate(req:Request,kind:string){
  // Vercel overwrites this header. Other hosts MUST provide an equally trusted ingress header.
  const ip=req.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim();
  if(!ip && process.env.NODE_ENV==='production')throw new HttpError(503,'Service temporarily unavailable');
  const key=createHmac('sha256',env('INQUIRY_RATE_SECRET')).update(kind+':'+(ip||'local')).digest('hex');
  if(!await rpc('inquiry_rate',{p_key:key,p_limit:kind==='draft'?6:30}))throw new HttpError(429,'Too many attempts. Please try again later or email support@seekapi.ai.');
}
export async function staff(){
  const token=(await cookies()).get('seekapi_staff')?.value;if(!token)throw new HttpError(401,'Please sign in');
  const res=await fetch(env('INQUIRY_SUPABASE_URL')+'/auth/v1/user',{headers:{apikey:env('INQUIRY_SUPABASE_ANON_KEY'),Authorization:`Bearer ${token}`},cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!res.ok)throw new HttpError(401,'Please sign in');const user=await res.json();
  const rows=await sb('/rest/v1/inquiry_staff?user_id=eq.'+encodeURIComponent(user.id)+'&active=eq.true&select=user_id');
  if(!user.email_confirmed_at||!rows.length)throw new HttpError(403,'Access not permitted');return user.id as string;
}
export async function draft(id:string,token:string){const rows=await sb('/rest/v1/inquiry_drafts?id=eq.'+id+'&token_hash=eq.'+hash(token)+'&select=*');const d=rows[0];if(!d||Date.parse(d.expires_at)<Date.now())throw new HttpError(410,'This upload session has expired. Start a new submission; your fields are retained.');return d;}
