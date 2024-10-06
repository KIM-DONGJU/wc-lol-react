'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import CommonButton from '@/components/common/CommonButton';
import CommonInput from '@/components/common/CommonInput';
import { routes } from '@/constants/routes';
import { signInWithOauth } from '@/apis/auth';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="h-full flex justify-center items-center">
      <div
        className="bg-white bg-opacity-10 w-150 flex flex-col items-center rounded-2xl p-8"
        style={{ backdropFilter: 'blur(28px)' }}
      >
        <div className="w-100 flex flex-col items-center">
          <header className="flex flex-col justify-center items-center">
            <Link href={routes.userList}>
              <Image
                alt="wc-lol logo"
                height={51}
                priority={true}
                src="/icons/main-logo.svg"
                width={62}
              />
            </Link>
            <p className="text-5xl font-bold">로그인</p>
          </header>
          <div className="mt-7 w-full flex flex-col items-center gap-y-4">
            <CommonInput
              clearIcon
              className="w-full max-w-full"
              placeholder="아이디"
              type="text"
              value={id}
              onChange={setId}
            />
            <CommonInput
              clearIcon
              className="w-full max-w-full"
              placeholder="비밀번호"
              type="password"
              value={password}
              onChange={setPassword}
            />
          </div>
          <Link className="w-full mt-3 text-white underline" href={'/'}>
            비밀번호를 잊으셨나요?
          </Link>
          <CommonButton
            className="mt-6 w-full rounded-4xl"
            variant="primary-light"
            onClick={() => {}}
          >
            로그인
          </CommonButton>
          <div className="mt-4 w-full flex items-center justify-center gap-x-3">
            <span className="flex-1 border-t border-white border-opacity-50" />
            <p className="font-semibold">OR</p>
            <span className="flex-1 border-t border-white border-opacity-50" />
          </div>
          <div className="mt-3 w-full flex items-center justify-center gap-x-3">
            <button onClick={() => signInWithOauth('google')}>
              <Image alt="google" height={48} src="/icons/google.svg" width={48} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
