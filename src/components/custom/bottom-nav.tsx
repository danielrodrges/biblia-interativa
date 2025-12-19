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
    <nav className={`fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 safe-area-bottom z-50 transition-transform duration-300 ${
      showBottomNav ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around h-16 sm:h-14">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
                            (item.href === '/leitura' && pathname?.startsWith('/leitura/'));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? 'text-[#3B82F6]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
