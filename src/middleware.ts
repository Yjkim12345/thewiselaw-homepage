import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // 환경 변수(env)가 없으면 기본값으로 admin / thewise2026 사용
    const expectedUser = process.env.ADMIN_USER || 'admin';
    const expectedPwd = process.env.ADMIN_PASSWORD || 'thewise2026';

    if (user === expectedUser && pwd === expectedPwd) {
      return NextResponse.next();
    }
  }

  // 인증 실패 시 브라우저 기본 로그인 창(Basic Auth) 띄우기
  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: [
    // Next.js 정적 리소스를 제외한 사실상 모든 라우트에 적용 (사이트 전체 폐쇄)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
