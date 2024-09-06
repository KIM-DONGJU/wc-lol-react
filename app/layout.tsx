import type { Metadata } from 'next';
import './globals.scss';
import Link from 'next/link';
import { routes } from '@/constants/routes';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'WC-LOL',
  description: 'A League of Legends custom game record site',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="flex justify-between">
          <p className="text-xl text-primary">WC-LOL</p>
          <div className="text-xl flex justify-between items-center gap-x-8">
            <Link href={routes.userList}>유저 목록</Link>
            <p className="h-5 border-l border-white"></p>
            <Link href={routes.userList}>유저 분석</Link>
            <p className="h-5 border-l border-white"></p>
            <Link href={routes.userList}>대전 생성</Link>
          </div>
          <div className="flex gap-x-3 items-center">
            <Image alt="person" height="30" src="icons/person.svg" width="30" />
            <p className="text-xl font-medium">LOGIN</p>
          </div>
        </header>
        <div>{children}</div>
      </body>
    </html>
  );
}
