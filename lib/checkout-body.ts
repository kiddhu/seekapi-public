/** Bound untrusted streaming bodies by bytes, wall time and caller cancellation. */
export async function boundedText(body:ReadableStream<Uint8Array>|null,limit:number,signal?:AbortSignal,timeoutMs=3000){
  if(!body)return "";
  const reader=body.getReader(),chunks:Uint8Array[]=[];let size=0,aborted=false;
  let rejectDeadline:(error:Error)=>void=()=>{};
  const deadline=new Promise<never>((_,reject)=>{rejectDeadline=reject});
  const abort=()=>{aborted=true;rejectDeadline(Error("UNAVAILABLE"));void reader.cancel().catch(()=>{})};
  const timer=setTimeout(abort,timeoutMs);signal?.addEventListener("abort",abort,{once:true});
  try{
    if(signal?.aborted)throw Error("UNAVAILABLE");
    for(;;){
      const {done,value}=await Promise.race([reader.read(),deadline]);
      if(aborted||signal?.aborted)throw Error("UNAVAILABLE");
      if(done)break;
      size+=value.length;if(size>limit)throw Error("LIMIT");
      chunks.push(value);
    }
    const bytes=new Uint8Array(size);let offset=0;
    for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
    return new TextDecoder().decode(bytes);
  }finally{
    clearTimeout(timer);signal?.removeEventListener("abort",abort);
    void reader.cancel().catch(()=>{});reader.releaseLock();
  }
}
