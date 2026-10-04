/** A deadline covers headers AND JSON consumption. Parent abort is terminal. */
export async function checkoutJson(operation:string,order:string,parent:AbortSignal,fetcher:typeof fetch=fetch,timeoutMs=10000){
  const controller=new AbortController();let timer:ReturnType<typeof setTimeout>|undefined;
  let rejectDeadline:(error:Error)=>void=()=>{};
  const deadline=new Promise<never>((_,reject)=>{rejectDeadline=reject});
  const abort=()=>{controller.abort();rejectDeadline(Error("UNAVAILABLE"))};
  parent.addEventListener("abort",abort,{once:true});
  timer=setTimeout(abort,timeoutMs);
  try{
    if(parent.aborted)abort();
    return await Promise.race([deadline,(async()=>{
      const response=await fetcher("/checkout/stripe/"+operation,{method:"POST",credentials:"same-origin",cache:"no-store",
        headers:{"content-type":"application/json","x-seekapi-card-claim":"1"},body:JSON.stringify({order_id:order}),signal:controller.signal});
      const data=await response.json();
      return {response,data};
    })()]);
  }finally{clearTimeout(timer);parent.removeEventListener("abort",abort)}
}
