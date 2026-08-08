export interface Env {}

interface MFEManifest {
  version: string;
  remotes: Record<string, { entry: string; version: string; priority: number }>;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/mfe/manifest') {
      const manifest: MFEManifest = {
        version: '2.0.0',
        remotes: {
          shell: { entry: 'http://localhost:3000/_next/static/chunks/remoteEntry.js', version: '2.0.0', priority: 1 },
          webOracle: { entry: 'http://localhost:3001/_next/static/chunks/remoteEntry.js', version: '2.0.0', priority: 2 },
          webArchive: { entry: 'http://localhost:3002/_next/static/chunks/remoteEntry.js', version: '2.0.0', priority: 3 },
          webResearch: { entry: 'http://localhost:3003/_next/static/chunks/remoteEntry.js', version: '2.0.0', priority: 4 },
          webAccount: { entry: 'http://localhost:3004/_next/static/chunks/remoteEntry.js', version: '2.0.0', priority: 5 },
        },
      };

      return new Response(JSON.stringify(manifest), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=300',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
