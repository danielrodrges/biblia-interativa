import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Rotas públicas que não requerem autenticação
const publicRoutes = [
  '/',
  '/welcome',
  '/pricing',
  '/auth/login',
  '/auth/signup',
  '/auth/callback',
  '/auth/confirm',
  '/auth/forgot-password',
  '/termos',
  '/privacidade',
  '/api/stripe/webhook', // Webhook do Stripe não precisa de auth
];

// Rotas protegidas que requerem autenticação
const protectedRoutes = [
  '/inicio',
  '/leitura',
  '/perfil',
  '/configuracoes',
  '/exercicios',
  '/praticar',
  '/apostolos',
  '/checkout',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso a todos os arquivos estáticos sem processar
  if (
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|json|js|css|woff|woff2|ttf|eot|map)$/) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/audio/')
  ) {
    return NextResponse.next();
  }

  // Criar cliente Supabase
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Verificar sessão do usuário
  const { data: { session } } = await supabase.auth.getSession();

  // Se está em rota pública, permitir acesso
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    // Se está logado e tentando acessar páginas de auth, redirecionar para /inicio
    if (session && pathname.startsWith('/auth/') && pathname !== '/auth/callback') {
      const redirectUrl = new URL('/inicio', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // Se está em rota protegida e não está autenticado, redirecionar para login
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirecionar raiz para welcome ou inicio baseado em autenticação
  if (pathname === '/') {
    const redirectUrl = new URL(session ? '/inicio' : '/welcome', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - All files with extensions (manifest.json, sw.js, images, fonts, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
