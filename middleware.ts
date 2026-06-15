import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const fwdHost  = request.headers.get('x-forwarded-host')
  const fwdProto = request.headers.get('x-forwarded-proto') ?? 'https'
  const realHost = request.headers.get('host')

  if (!fwdHost || fwdHost === realHost) {
    return NextResponse.next()   // direct access — no patch needed
  }

  // Rebuild the URL with the public-facing host
  const publicUrl      = request.nextUrl.clone()
  publicUrl.protocol   = fwdProto
  publicUrl.host       = fwdHost  // tpc.iitbhu.ac.in

  // Forward the request internally, but attach the corrected URL
  // as a header so page.tsx / layout.tsx can build correct redirects
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-public-url', publicUrl.toString())
  requestHeaders.set('x-public-host', fwdHost)
  requestHeaders.set('x-public-proto', fwdProto)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/recruiter/:path*'],
}