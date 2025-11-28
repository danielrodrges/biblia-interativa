import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Se o Supabase não estiver configurado (como na Lasy),
    // o middleware não bloqueia nenhuma rota
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn(
        '⚠️ Supabase não configurado. Middleware liberando rotas sem autenticação.'
      );
      return response;
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
          });

          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const publicRoutes = [
      '/auth/login',
      '/auth/signup',
      '/auth/callback',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/',
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );

    if (!session && !isPublicRoute) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      return NextResponse.redirect(redirectUrl);
    }

    if (
      session &&
      (req.nextUrl.pathname.startsWith('/auth/login') ||
        req.nextUrl.pathname.startsWith('/auth/signup'))
    ) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/inicio';
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (error) {
    console.error('Erro no middleware:', error);
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
