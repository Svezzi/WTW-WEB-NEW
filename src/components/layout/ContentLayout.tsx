'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href: string;
}

interface ContentLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  showBreadcrumbs?: boolean;
}

export default function ContentLayout({
  children,
  sidebar,
  breadcrumbs = [],
  showBreadcrumbs = true,
}: ContentLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {showBreadcrumbs && (
        <nav className="mb-8 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                href="/"
                className="text-gray-500 hover:text-[#4CAF50]"
              >
                <Home className="h-4 w-4" />
              </Link>
            </li>
            {breadcrumbs.map((item, index) => (
              <li key={item.href} className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <Link
                  href={item.href}
                  className={`ml-2 text-sm ${
                    index === breadcrumbs.length - 1
                      ? 'font-medium text-[#1B4965]'
                      : 'text-gray-500 hover:text-[#4CAF50]'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        <main className={`flex-1 ${sidebar ? 'lg:order-2' : ''}`}>
          {children}
        </main>
        
        {sidebar && (
          <aside className="w-full lg:order-1 lg:w-64">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
} 