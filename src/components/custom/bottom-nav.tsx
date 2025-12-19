'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Languages, User } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { showBottomNav } = useNavigation();

  const navItems = [
    { href: '/inicio', icon: Home, label: 'Início' },
    { href: '/leitura', icon: BookOpen, label: 'Leitura' },
    { href: '/praticar', icon: Languages, label: 'Praticar' },
    { href: '/perfil', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-[#FAF9F6]/90 dark:bg-stone-950/90 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 safe-area-bottom z-50 transition-transform duration-300 ${
      showBottomNav ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around h-20 sm:h-16 pb-2 sm:pb-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
                            (item.href === '/leitura' && pathname?.startsWith('/leitura/'));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 group ${
                  isActive
                    ? 'text-stone-800 dark:text-stone-100'
                    : 'text-stone-400 hover:text-stone-600 dark:text-stone-600 dark:hover:text-stone-400'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-stone-100 dark:bg-stone-900' : 'bg-transparent'
                }`}>
                  <Icon className={`w-6 h-6 transition-transform duration-300 ${
                    isActive ? 'scale-110 stroke-[2.5px]' : 'stroke-[1.5px] group-hover:scale-105'
                  }`} />
                </div>
                <span className={`text-[10px] font-medium mt-1 transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
