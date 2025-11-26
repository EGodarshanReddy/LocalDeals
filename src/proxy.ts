import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_PATH_PERMISSION } from './shared/paths/ApiPathPermission';
import { PUBLIC_DYNAMIC, PUBLIC_PATHS } from './shared/paths/ApiPaths';
import ResponseBuilder from './shared/common/Helpers';
import { StatusCode } from './shared/constants/common';
import { JWTService } from './utils/jwt.service';

export default async function middleware(request: NextRequest) {
  try {
    request.headers.set('Access-Control-Allow-Origin', '*');
    request.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    request.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    request.headers.set('Access-Control-Max-Age', '86400');
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: request.headers
      });
    }
    // Get request method and pathname
    const method = request.method;
    const pathname = request.nextUrl.pathname;
    // Check if route is public
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }
    // Get Authorization header
    const header = request.headers.get("Authorization") || "";
    // Check if header is present
    if (!header) {      
      return ResponseBuilder.failure("Authorization header is required", StatusCode.UNAUTHORIZED);
    }
    // Extract token from header
    const token = header.slice(7);
    if (!token) {      
      return ResponseBuilder.failure("Token is required", StatusCode.UNAUTHORIZED);
    }
    // Verify token
    const payload = await JWTService.verifyToken(token);
    if (payload instanceof ResponseBuilder) {
      return payload;
    }
    const userRole: string = payload.role as string;
    const methodPaths: Record<string, string[]> = API_PATH_PERMISSION[method];

    if (methodPaths) {
      const matchedPath = Object.keys(methodPaths).find((routePattern) =>
        routePattern === pathname || matchRoute(routePattern, pathname)
      );

      if (matchedPath) {
        const allowedRoles = methodPaths[matchedPath];
        if (!allowedRoles.includes(userRole)) {          
          return ResponseBuilder.failure("User does not have permission for this route", StatusCode.FORBIDDEN);
        }
      }
    }
    const user_id = payload.userId.toString();
    const email = payload.email as string;
    const response = NextResponse.next();
    response.headers.set("x-user-id", user_id);
    response.headers.set("x-user-role", userRole);
    response.headers.set("x-user-email", email);
    return response;
  }
  catch (error) {
    console.error('Middleware error:', error);
    return ResponseBuilder.failure("Something went wrong.", StatusCode.INTERNALSERVERERROR);
  } 

}

function matchRoute(route: string, pathname: string): boolean {
  const routePattern = route.split("/").filter(Boolean);
  const pathPattern = pathname.split("/").filter(Boolean);

  if (routePattern.length !== pathPattern.length) return false;

  for (let i = 0; i < routePattern.length; i++) {

    if (routePattern[i].startsWith(":")) continue;
    if (routePattern[i] !== pathPattern[i]) return false;
  }
  return true;
}
// Check if route is public
function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_DYNAMIC.some(pattern => matchRoute(pattern, pathname));
}
export const config = {
  matcher: [
    '/api/:path*',
    '/openapi.yaml'
  ]
};