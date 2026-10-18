// Next 16.3.8 server metadata anchors path bytes before WHATWG parsing.
// Node's request target retains the caller query; hosted initURL may add routing query.
const metadata = Symbol.for('NextInternalRequestMeta');
export function trustedOriginalTarget(request) {
  const initial = request[metadata]?.initURL;
  if (typeof initial !== 'string') return null;
  const anchor = initial.startsWith('/') && !initial.startsWith('//') && !/[#\r\n]/.test(initial)
    ? initial : /^https?:\/\/[^/?#\s]+(\/[^#\r\n]*)$/.exec(initial)?.[1];
  const incoming = request.url;
  if (!anchor || typeof incoming !== 'string' || !incoming.startsWith('/')
      || incoming.startsWith('//') || /[#\r\n]/.test(incoming)) return null;
  // Compare raw paths literally. Never use the normalized Node path to erase traversal.
  if (anchor.split('?')[0] !== incoming.split('?')[0]) return null;
  return incoming;
}
