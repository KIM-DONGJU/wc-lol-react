'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { groupMembersQueryKey } from '@/queries/groupMembersQueryKey';
import { getGroupMembers, GroupMember, Position } from '@/apis/groupMembers';

import CommonInput from '@/components/common/CommonInput';

export default function Home() {
  const { data } = useQuery<GroupMember[]>({
    queryKey: groupMembersQueryKey.getGroupMembers(1),
    queryFn: () => getGroupMembers(1),
    staleTime: 1000 * 60 * 60,
  });

  const [searchUser, setSearchUser] = useState('');
  const searchData = data?.filter((groupMember) => {
    if (!searchUser) return true;
    return (
      groupMember.name.includes(searchUser.trim()) ||
      groupMember.nickname.includes(searchUser.trim())
    );
  });

  const userListTableHeader = ['이름', '닉네임', '탑', '정글', '미드', '원딜', '서폿'];
  const getPositionClass = (member: GroupMember, position: Position) => {
    if (member.mainPosition === position) return 'text-primary';
    if (member.subPosition === position) return 'text-secondary';
    return '';
  };

  return (
    <div className="mt-6 py-8 px-5 w-full h-screen max-h-[calc(100vh-138px)] bg-opacity-white rounded-3xl">
      <div className="w-full flex justify-center items-center">
        <CommonInput placeholder="이름, 닉네임 검색" value={searchUser} onChange={setSearchUser} />
      </div>
      <div className="h-full flex flex-col mt-8">
        <header className="w-full h-15 grid grid-cols-user-list-table text-xl items-center gap-x-2 bg-zinc-900">
          {userListTableHeader.map((header) => (
            <p key={header} className="text-center">
              {header}
            </p>
          ))}
        </header>
        <div className="h-full max-h-[calc(100%-138px)] overflow-auto">
          {searchData &&
            searchData.map((groupMember) => (
              <div
                key={groupMember.id}
                className="w-full h-15 grid grid-cols-user-list-table text-xl text-center items-center gap-x-2 border-b border-opacity-white"
              >
                <p>{groupMember.name}</p>
                <p>{groupMember.nickname}</p>
                {Object.entries(groupMember.positionScore).map(([key, value]) => (
                  <p key={`${key}`} className={getPositionClass(groupMember, key as Position)}>
                    {value}
                  </p>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
