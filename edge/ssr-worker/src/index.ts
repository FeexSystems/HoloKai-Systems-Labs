export interface Env {}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Edge Streaming SSR Execution Proxy
    const originResponse = await fetch(request);

    const headers = new Headers(originResponse.headers);
    headers.set('x-holokai-edge-ssr', 'true');
    headers.set('transfer-encoding', 'chunked');

    return new Response(originResponse.body, {
      status: originResponse.status,
      headers,
    });
  },
};
