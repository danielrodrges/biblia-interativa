import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware neutro: só deixa tudo passar
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

// Desativamos o matcher para não interferir em nenhuma rota
export const config = {
  matcher: [],
};
