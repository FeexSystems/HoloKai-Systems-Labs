export interface Env {}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Extract Cloudflare Geolocation properties
    const cf = (request as any).cf || {};
    const country = cf.country || 'US';
    const city = cf.city || 'Unknown';
    const continent = cf.continent || 'NA';
    const region = cf.region || 'US';

    // Formulate Edge Decision Headers
    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set('x-holokai-geo-country', country);
    modifiedHeaders.set('x-holokai-geo-city', city);
    modifiedHeaders.set('x-holokai-geo-continent', continent);
    modifiedHeaders.set('x-holokai-edge-pop', cf.colo || 'ORD');

    // Proxy request to origin/shell with augmented geo telemetry headers
    const modifiedRequest = new Request(request.url, {
      method: request.method,
      headers: modifiedHeaders,
      body: request.body,
      redirect: 'manual',
    });

    const response = await fetch(modifiedRequest);

    // Append security & edge telemetry headers to client response
    const newResponseHeaders = new Headers(response.headers);
    newResponseHeaders.set('x-holokai-edge-routed', 'true');
    newResponseHeaders.set('x-holokai-edge-region', `${continent}-${country}`);
    newResponseHeaders.set('Server-Timing', `edge;desc="CF-${cf.colo || 'POP'}"`);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newResponseHeaders,
    });
  },
};
