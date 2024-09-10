'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { groupMembersQueryKey } from '@/queries/groupMembersQueryKey';
import { getGroupMembers, GroupMember } from '@/apis/groupMembers';

import CommonInput from '@/components/common/CommonInput';

export default function Home() {
  const { data, error, isLoading } = useQuery<GroupMember[]>({
    queryKey: groupMembersQueryKey.getGroupMembers(1),
    queryFn: () => getGroupMembers(1),
    staleTime: 1000 * 60 * 60,
  });

  const [searchUser, setSearchUser] = useState('');

  return (
    <div className="mt-6 py-8 px-5 w-full h-screen max-h-[calc(100vh-138px)] bg-opacity-white rounded-3xl">
      <div className="w-full flex justify-center items-center">
        <CommonInput
          placeholder="이름, 닉네임 검색"
          value={searchUser}
          onChange={setSearchUser}
        ></CommonInput>
      </div>
    </div>
  );
}
