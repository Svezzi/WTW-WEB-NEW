'use client';

import Link from "next/link";
import Image from "next/image";
import UserMenu from "@/components/layout/UserMenu";
import { AuthProvider } from "@/contexts/AuthContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#111827]/95 backdrop-blur-sm">
          <div className="mx-auto flex h-20 items-center px-4 w-full max-w-7xl">
            <div className="flex-1 flex items-center">
              <Link href="/" className="flex items-center gap-2 -ml-64">
                <Image
                  src="/images/LOGO2_ALPHA.png"
                  alt="Walk This Way Logo"
                  width={140}
                  height={140}
                  className="object-contain h-16 w-auto translate-y-1"
                />
                <span className="text-white text-3xl font-street">Walk This Way</span>
              </Link>
            </div>

            <div className="flex-[2] flex items-center justify-center gap-12 -ml-64">
              <div className="flex items-center gap-8 -ml-8">
                <Link href="/cities" className="text-gray-200 hover:text-white text-base font-medium">
                  All Cities
                </Link>
                <Link href="/about" className="text-gray-200 hover:text-white text-base font-medium">
                  About Us
                </Link>
              </div>
              <Link href="/join" className="text-gray-200 hover:text-white text-base font-medium">
                Become A Route Creator
              </Link>
            </div>

            <div className="flex-1 flex items-center justify-end">
              <Link 
                href="/auth/signin" 
                className="text-base font-medium text-gray-200 hover:text-white border border-gray-200 hover:border-white rounded-full px-4 py-1.5 transition-colors mr-[-192px]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-gray-800 bg-[#0F172A]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-100">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link href="/about" className="text-gray-400 hover:text-[#4CAF50]">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-[#4CAF50]">Contact</Link></li>
                  <li><Link href="/careers" className="text-gray-400 hover:text-[#4CAF50]">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100">Resources</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link href="/blog" className="text-gray-400 hover:text-[#4CAF50]">Blog</Link></li>
                  <li><Link href="/guides" className="text-gray-400 hover:text-[#4CAF50]">Local Guides</Link></li>
                  <li><Link href="/faq" className="text-gray-400 hover:text-[#4CAF50]">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link href="/privacy" className="text-gray-400 hover:text-[#4CAF50]">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-gray-400 hover:text-[#4CAF50]">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100">Connect</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-[#4CAF50]">Twitter</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-[#4CAF50]">Instagram</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-[#4CAF50]">Facebook</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-8 text-center">
              <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} WALK THIS WAY. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
} 