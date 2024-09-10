'use client';

import Image from 'next/image';
import Link from 'next/link';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { routes } from '@/constants/routes';

import '@/app/globals.scss';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <html className="w-full max-w-screen-xl mx-auto p-4 text-white" lang="en">
        <body>
          <header className="flex justify-between">
            <p className="text-xl text-primary">WC-LOL</p>
            <div className="text-xl flex justify-between items-center gap-x-8">
              <Link className="hover:text-primary" href={routes.userList}>
                유저 목록
              </Link>
              <p className="h-5 border-l border-white"></p>
              <Link className="hover:text-primary" href={routes.userList}>
                유저 분석
              </Link>
              <p className="h-5 border-l border-white"></p>
              <Link className="hover:text-primary" href={routes.userList}>
                대전 생성
              </Link>
            </div>
            <div className="flex gap-x-3 items-center">
              <Link className="flex gap-x-3 items-center" href={routes.userList}>
                <Image alt="person" height="30" src="icons/person.svg" width="30" />
                <p className="text-xl font-medium">LOGIN</p>
              </Link>
            </div>
          </header>
          <div className="px-8">{children}</div>
        </body>
      </html>
    </QueryClientProvider>
  );
}
