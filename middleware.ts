import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  try {
    const supabase = createMiddlewareClient({ req, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ['/auth/login', '/auth/signup', '/auth/callback', '/auth/forgot-password', '/auth/reset-password'];
    const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route));

    // Se não está autenticado e tenta acessar rota protegida
    if (!session && !isPublicRoute && req.nextUrl.pathname !== '/') {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      return NextResponse.redirect(redirectUrl);
    }

    // Se está autenticado e tenta acessar página de login/signup
    if (session && (req.nextUrl.pathname.startsWith('/auth/login') || req.nextUrl.pathname.startsWith('/auth/signup'))) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/inicio';
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (error) {
    console.error('Erro no middleware:', error);
    return res;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
