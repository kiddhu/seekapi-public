// Test-only: exercise the unchanged CLI and real SDK, with HTTP confined to loopback.
const local = new URL(process.env.TASK_MCP_WIRE_ORIGIN);
if (local.protocol !== 'http:' || local.hostname !== '127.0.0.1' ||
    local.username || local.password || local.search || local.hash || local.pathname !== '/') {
  throw Error('A loopback fixture origin is required');
}
const nativeFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = (input, init) => {
  const original = new URL(input instanceof Request ? input.url : String(input));
  if (original.href !== 'https://api.seekapi.ai/mcp') {
    throw Error('Unexpected external endpoint in the free example');
  }
  const target = new URL('/mcp', local);
  return nativeFetch(input instanceof Request ? new Request(target, input) : target, init);
};
