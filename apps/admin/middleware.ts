import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isLoginPage = pathname === '/login';

  // Lấy token từ cookies
  const token = request.cookies.get('access-token')?.value;

  // Nếu vào route cần bảo vệ mà không có token, redirect về login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // *** BỎ ĐOẠN NÀY ĐỂ TRÁNH VÒNG LẶP ***
  // if (isLoginPage && token) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
