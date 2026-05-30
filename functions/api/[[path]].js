/**
 * Cloudflare Pages Function — API Proxy
 *
 * Routes all requests to /api/* → VPS backend at http://37.187.140.45
 * This eliminates Mixed Content errors: frontend (HTTPS) → Pages Function (HTTPS)
 * → VPS (HTTP, server-side, no browser restriction).
 */

const BACKEND_URL = 'http://37.187.140.45';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Strip the leading /api prefix and forward the rest to the VPS
  const backendPath = url.pathname.replace(/^\/api/, '') || '/';
  const targetUrl = `${BACKEND_URL}${backendPath}${url.search}`;

  // Forward headers but remove the Host header (Cloudflare sets it)
  const headers = new Headers(request.headers);
  headers.delete('host');

  const backendRequest = new Request(targetUrl, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    redirect: 'follow',
  });

  try {
    const response = await fetch(backendRequest);

    // Forward backend response but add CORS headers
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Backend unreachable', detail: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handle preflight OPTIONS requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
