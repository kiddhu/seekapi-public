import { InquiryAdmin } from '@/components/inquiry-admin';
export default async function Page({params}:{params:Promise<{id:string}>}){return <InquiryAdmin id={(await params).id}/>;}
