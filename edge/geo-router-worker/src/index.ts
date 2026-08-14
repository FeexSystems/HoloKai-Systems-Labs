/**
 * Geo Router Worker
 * Intercepts requests, detects CF-IPCountry header, and routes based on proximity.
 */

export interface Env {
  // Bindings can be added here
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const country = request.headers.get('CF-IPCountry') || 'US';
    const city = request.cf?.city || 'Unknown';
    const colo = request.cf?.colo || 'Unknown';

    // Simulated Geo-Routing logic
    let regionNode = 'us-east';
    if (['GB', 'FR', 'DE'].includes(country)) {
      regionNode = 'eu-west';
    } else if (['JP', 'SG', 'AU'].includes(country)) {
      regionNode = 'ap-southeast';
    }

    const modifiedRequest = new Request(request);
    modifiedRequest.headers.set('X-HoloKai-Edge-Region', regionNode);
    modifiedRequest.headers.set('X-HoloKai-Visitor-Country', country);

    // Normally this would fetch the origin or return a redirect.
    // For the spec, we will echo back the geo headers to prove edge logic is active.
    return new Response(JSON.stringify({
      status: 'geo_routed',
      clientLocation: { country, city, colo },
      assignedRegionNode: regionNode
    }), {
      headers: {
        'Content-Type': 'application/json',
        'X-HoloKai-Edge-Region': regionNode
      }
    });
  },
};
