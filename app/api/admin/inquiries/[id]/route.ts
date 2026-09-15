import { staff,origin,json,rpc,sb,response,failure,HttpError } from '@/lib/inquiries/server';
import { validId,states } from '@/lib/inquiries/core';
type Context={params:Promise<{id:string}>};
export async function GET(req:Request,ctx:Context){try{await staff();const {id}=await ctx.params;if(!validId(id))throw new HttpError(404,'Not found');
 const [rows,attachments,events,mail]=await Promise.all([sb('/rest/v1/inquiries?id=eq.'+id+'&select=*'),sb('/rest/v1/inquiry_attachments?inquiry_id=eq.'+id+'&select=id,name,expected_size,extension,scan_status,scan_at'),sb('/rest/v1/inquiry_events?inquiry_id=eq.'+id+'&order=created_at.desc&limit=200&select=actor,note,created_at'),sb('/rest/v1/inquiry_outbox?inquiry_id=eq.'+id+'&select=kind,state,attempts,provider_id')]);
 if(!rows.length)throw new HttpError(404,'Not found');const value={inquiry:rows[0],attachments,events,mail};
 if(new URL(req.url).searchParams.has('export'))return new Response(JSON.stringify(value,null,2),{headers:{'Content-Type':'application/json','Content-Disposition':`attachment; filename="${rows[0].reference}.json"`,'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
 return response(value);}catch(e){return failure(e);}}
export async function PATCH(req:Request,ctx:Context){try{origin(req);const actor=await staff();const {id}=await ctx.params;const b=await json(req);
 if(!validId(id)||!states.includes(b.status)||typeof b.note!=='string'||b.note.length>5000||typeof b.owner!=='string'||b.owner.length>150)throw new HttpError(400,'Invalid update');
 await rpc('inquiry_update',{p_id:id,p_actor:actor,p_status:b.status,p_owner:b.owner,p_note:b.note});return response({ok:true});}catch(e){return failure(e);}}
export async function DELETE(req:Request,ctx:Context){try{origin(req);const actor=await staff();const {id}=await ctx.params;if(!validId(id))throw new HttpError(404,'Not found');await rpc('inquiry_request_deletion',{p_id:id,p_actor:actor});return response({ok:true});}catch(e){return failure(e);}}
