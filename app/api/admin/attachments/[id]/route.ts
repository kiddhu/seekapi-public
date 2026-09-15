import { staff,sb,response,failure,HttpError,env } from '@/lib/inquiries/server';
import { validId } from '@/lib/inquiries/core';
export async function GET(req:Request,ctx:{params:Promise<{id:string}>}){try{await staff();const {id}=await ctx.params;if(!validId(id))throw new HttpError(404,'Not found');
 const rows=await sb('/rest/v1/inquiry_attachments?id=eq.'+id+'&select=clean_path,scan_status,extension,name');const f=rows[0];if(!f||f.scan_status!=='clean'||!f.clean_path)throw new HttpError(403,'Attachment is not cleared for download');
 const r=await sb('/storage/v1/object/sign/inquiry-clean/'+f.clean_path,{method:'POST',body:JSON.stringify({expiresIn:60})});
 const url=new URL('/storage/v1'+r.signedURL,env('INQUIRY_SUPABASE_URL'));
 if(!new URL(req.url).searchParams.has('preview')||!['jpg','jpeg','png','webp','pdf'].includes(f.extension))url.searchParams.set('download',f.name);
 return new Response(null,{status:302,headers:{Location:url.href,'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex'}});
}catch(e){return failure(e);}}
