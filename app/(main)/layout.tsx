'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import { routes } from '@/constants/routes';
import { ONE_HOUR } from '@/constants/date';
import { getUser } from '@/apis/auth';
import { authQueryKey } from '@/queries/authQueryKey';

import { CommonToastMessage } from '@/components/common/CommonToastMessage';

import '@/app/globals.scss';
import React from 'react';
import CommonAsyncLoadingSpinner from '@/components/common/CommonAsyncLoadingSpinner';

const queryClient = new QueryClient();

const Header = () => {
  const { data: userData } = useQuery({
    queryFn: getUser,
    queryKey: authQueryKey.getUser(),
    staleTime: ONE_HOUR,
    gcTime: 5 * ONE_HOUR,
  });

  const currentPath = usePathname();
  const navItems = [
    {
      label: '유저 목록',
      path: routes.userList,
    },
    {
      label: '유저 분석',
      path: routes.userStats,
    },
    {
      label: '대전 생성',
      path: routes.createMatch,
    },
  ];

  return (
    <header className="flex justify-between items-center">
      <Link href={routes.userList}>
        <Image
          alt="wc-lol logo"
          height={51}
          priority={true}
          src="/icons/main-logo.svg"
          width={62}
        />
      </Link>
      <div className="text-xl flex justify-between items-center gap-x-8 max-sm:gap-x-4">
        {navItems.map((navItem, index) => (
          <React.Fragment key={navItem.path}>
            <Link
              className={`hover:text-primary-100 ${currentPath === navItem.path && 'text-primary-100 font-bold'}`}
              href={navItem.path}
            >
              {navItem.label}
            </Link>
            {index !== navItems.length - 1 && <p className="h-5 border-l border-white"></p>}
          </React.Fragment>
        ))}
      </div>
      <div className="flex gap-x-3 items-center">
        {!userData?.user ? (
          <Link className="flex gap-x-3 items-center" href={routes.login}>
            <Image
              alt="person"
              className="max-sm:w-5 max-sm:h-5"
              height="30"
              src="icons/person.svg"
              width="30"
            />
            <p className="text-xl font-medium">Login</p>
          </Link>
        ) : (
          <div className="rounded-full p-1 border border-white border-opacity-80">
            <Image
              alt="person"
              className="max-sm:w-5 max-sm:h-5 cursor-pointer"
              height="30"
              src="icons/person.svg"
              width="30"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <html className="w-full max-w-screen-xl h-screen mx-auto p-4 text-white" lang="en">
        <body className="h-full flex flex-col">
          <Header />
          <div className="px-8 pb-10 flex-1 flex flex-col">{children}</div>
          <CommonToastMessage />
          <CommonAsyncLoadingSpinner />
        </body>
      </html>
    </QueryClientProvider>
  );
}
