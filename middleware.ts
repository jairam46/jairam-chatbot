export const config = {
  matcher: '/api/:path*',
}

export default async function middleware(request: Request) {
  const url = new URL(request.url)
  const { pathname } = url

  if (!pathname.startsWith('/api/')) return

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT,DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  // Forward the request to the origin (Vercel will route to your API function)
  const originResponse = await fetch(request)

  // Copy response and inject CORS headers
  const headers = new Headers(originResponse.headers)
  Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v))

  return new Response(originResponse.body, {
    status: originResponse.status,
    statusText: originResponse.statusText,
    headers,
  })
}
