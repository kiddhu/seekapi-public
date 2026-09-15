import type { Metadata } from 'next';
export const metadata:Metadata={title:'SeekAPI 询盘管理',robots:{index:false,follow:false},alternates:{canonical:null}};
export default function Layout({children}:{children:React.ReactNode}){return <main className="admin-shell" lang="zh-CN">{children}</main>;}
