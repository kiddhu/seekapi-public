export type BrowserEvent = {
 event_version:string;event_id:string;event_type:string;occurred_at:string;surface:string;path_class:string;
 referrer_class:string;utm_source:string|null;source_confidence:string;mode:string;product:string;
 privacy_safe_session_id:string|null;request_or_prepare_correlation_id:string|null;
};
export const VERSION:string;
export const SESSION_TTL_MS:number;
export function pathClass(path:unknown):string|null;
export function classifyAcquisition(referrer:unknown,search:unknown):{referrer_class:string;utm_source:string|null;source_confidence:string};
export function sanitizeBrowserEvent(raw:unknown,options?:{now?:number}):BrowserEvent|null;
export function validateBrowser(raw:unknown):BrowserEvent;
export function aggregateDay(input:{day:string;browser_events?:BrowserEvent[];canonical_orders?:Record<string,unknown>[];browser_coverage?:string;canonical_coverage?:string}):Record<string,unknown>;
