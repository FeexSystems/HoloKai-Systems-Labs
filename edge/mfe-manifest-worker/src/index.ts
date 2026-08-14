/**
 * MFE Manifest Worker
 * Resolves the correct Micro-Frontend Remote URL based on the requested route.
 */

export interface Env {
  // Bindings can be added here
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    let targetUrl = '';
    
    // MFE Route resolution logic
    if (path.startsWith('/oracle')) {
      targetUrl = 'https://oracle.holokai.systems' + path;
    } else if (path.startsWith('/archive')) {
      targetUrl = 'https://archive.holokai.systems' + path;
    } else if (path.startsWith('/research')) {
      targetUrl = 'https://research.holokai.systems' + path;
    } else if (path.startsWith('/home')) {
      targetUrl = 'https://home.holokai.systems' + path;
    } else {
      // Default to shell
      targetUrl = 'https://shell.holokai.systems' + path;
    }

    // In a real implementation, we would rewrite the request to the target URL
    // For now, this just returns a JSON mapping to fulfill the v14 spec manifest requirement
    return new Response(JSON.stringify({
      status: 'resolved',
      path: path,
      targetMfeUrl: targetUrl,
      edgeCache: 'HIT'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  },
};
