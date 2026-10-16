import type {BrowserEvent} from './funnel.mjs';
export function createBrowserObserver(options?:{send?:(event:BrowserEvent)=>unknown;now?:()=>number;randomUUID?:()=>string;enabled?:boolean;globalPrivacyControl?:boolean;doNotTrack?:string|null}):{reset():void;observe(type:string,context?:Record<string,unknown>):void};
