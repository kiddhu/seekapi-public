export type BrowserEvent = {
 event_version:string;event_id:string;event_type:string;occurred_at:string;surface:string;path_class:string;
 referrer_class:string;utm_source:string|null;source_confidence:string;mode:string;product:string;
 privacy_safe_session_id:string|null;request_or_prepare_correlation_id:string|null;
 platform?:string;
};
export const VERSION:string;
export const LEGACY_VERSION:string;
export const INTERACTION_TYPES:readonly string[];
export const SESSION_TTL_MS:number;
export const PRODUCT_LINK_TYPES:readonly string[];
export const PLATFORMS:readonly string[];
export function pathClass(path:unknown):string|null;
export function classifyAcquisition(referrer:unknown,search:unknown):{referrer_class:string;utm_source:string|null;source_confidence:string};
export function sanitizeBrowserEvent(raw:unknown,options?:{now?:number}):BrowserEvent|null;
export function validateBrowser(raw:unknown):BrowserEvent;
export function aggregateDay(input:{day:string;browser_events?:BrowserEvent[];canonical_orders?:Record<string,unknown>[];browser_coverage?:string;canonical_coverage?:string;version?:1|3}):Record<string,unknown>;
