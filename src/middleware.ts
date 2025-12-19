import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

// Rotas públicas (não requerem autenticação)
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/callback',
  '/auth/forgot-password',
  '/welcome',
  '/pricing',
];

// Rotas privadas (requerem autenticação)
const protectedRoutes = [
  '/inicio',
  '/leitura',
  '/perfil',
  '/configuracoes',
  '/exercicios',
  '/praticar',
  '/apostolos',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Verificar sessão do usuário
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Verificar se a rota é protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

  // Se é rota protegida e não está autenticado → redirecionar para welcome
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/welcome', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se está autenticado e tentando acessar welcome/login/signup → redirecionar para inicio
  if (session && (pathname === '/welcome' || pathname === '/auth/login' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/inicio', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
