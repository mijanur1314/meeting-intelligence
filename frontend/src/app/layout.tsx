'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-card/90 backdrop-blur">
              <div className="mx-auto flex h-20 max-w-7xl items-center px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                    <Sparkles className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold leading-none tracking-tight text-foreground transition-opacity group-hover:opacity-90">
                      Meeting
                    </span>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground transition-opacity group-hover:opacity-90">
                      Intelligence
                    </span>
                  </div>
                </Link>

                <nav className="ml-auto flex items-center space-x-6">
                  {isAuthenticated ? (
                    <>
                      <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
                      <Link href="/meetings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Meetings</Link>
                      <Link href="/action-items" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Action Items</Link>
                      <div className="h-4 w-px bg-border" />
                      <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                      >
                        Logout
                      </button>
                      <ThemeToggle />
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Sign In
                      </Link>
                      <Link href="/register" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
                        Get Started
                      </Link>
                      <ThemeToggle />
                    </>
                  )}
                </nav>
              </div>
            </header>
            <main className="flex-1 relative">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
