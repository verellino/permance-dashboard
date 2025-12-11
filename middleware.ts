import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain } from '@/lib/utils';
import { getToken } from 'next-auth/jwt';
import { hasRole } from '@/lib/rbac';

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);
  const requestHeaders = new Headers(request.headers);
  const token =
    (await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })) || null;

  if (subdomain) {
    // Block access to admin page from subdomains
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // For the root path on a subdomain, rewrite to the subdomain page
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url), {
        request: {
          headers: requestHeaders
        }
      });
    }
  }

  const isProtectedMaster =
    pathname.startsWith('/master') || pathname.startsWith('/api/master');
  const isProtectedClient =
    pathname.startsWith('/client') || pathname.startsWith('/api/client');
  const isProtectedClipper =
    pathname.startsWith('/clipper') || pathname.startsWith('/api/clipper');

  if (isProtectedMaster || isProtectedClient || isProtectedClipper) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const memberships = (token as any).memberships as
      | { workspaceId: string; role: any; workspaceType: string }[]
      | undefined;
    const membership = memberships?.find((m) => {
      if (isProtectedMaster) return m.workspaceType === 'MASTER';
      if (isProtectedClient) return m.workspaceType === 'CLIENT';
      if (isProtectedClipper) return m.workspaceType === 'CLIPPER';
      return false;
    });

    if (!membership) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const requiresAdmin =
      (isProtectedMaster && !hasRole(membership.role, 'ADMIN')) || false;

    if (requiresAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // On the root domain, allow normal access
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|[\\w-]+\\.\\w+).*)'
  ]
};
