// app/api/debug/route.ts
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const headersList = headers()
  const allHeaders: Record<string, string> = {}
  headersList.forEach((value, key) => {
    allHeaders[key] = value
  })

  const url = new URL(request.url)

  const debug = {
    // What host does Next.js think it's on?
    seen_host: allHeaders['host'],
    seen_x_forwarded_host: allHeaders['x-forwarded-host'],
    seen_x_forwarded_proto: allHeaders['x-forwarded-proto'],
    seen_x_real_ip: allHeaders['x-real-ip'],

    // What URL does Next.js reconstruct?
    request_url: request.url,
    url_origin: url.origin,
    url_pathname: url.pathname,

    // All headers (for full picture)
    all_headers: allHeaders,
  }

  return NextResponse.json(debug, {
    headers: { 'Cache-Control': 'no-store' }
  })
}