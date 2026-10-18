// Next 16.3.8 Node server metadata; never trust an HTTP raw-path header.
// The symbol lives on the server-created IncomingMessage, before WHATWG parsing.
const metadata = Symbol.for('NextInternalRequestMeta');
export function trustedOriginalTarget(request) {
  const initial = request[metadata]?.initURL;
  if (typeof initial !== 'string') return null;
  // Slice the origin lexically. A URL constructor here would erase traversal.
  const match = /^https?:\/\/[^/?#\s]+(\/[^#\r\n]*)$/.exec(initial);
  return match ? match[1] : null;
}
