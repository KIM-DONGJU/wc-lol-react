'use client';

import useGroupMembers from '@/hooks/useGroupMembers';
import type { Position } from '@/interfaces/position';
import { type GroupMember } from '@/apis/groupMembers';

import CommonInput from '@/components/common/CommonInput';
import CommonPageWrapper from '@/components/common/CommonPageWrapper';

export default function Home() {
  const { searchUser, setSearchUser, filteredGroupMembers } = useGroupMembers(1);

  const userListTableHeader = ['이름', '닉네임', '탑', '정글', '미드', '원딜', '서폿'];
  const getPositionClass = (member: GroupMember, position: Position) => {
    if (member.mainPosition === position) return 'text-primary-100';
    if (member.subPosition === position) return 'text-secondary';
    return '';
  };

  return (
    <CommonPageWrapper>
      <div className="w-full flex justify-center items-center">
        <CommonInput placeholder="이름, 닉네임 검색" value={searchUser} onChange={setSearchUser} />
      </div>
      <div className="flex-1 flex flex-col mt-8">
        <header className="w-full h-15 grid grid-cols-user-list-table text-xl items-center gap-x-2 bg-opacity-white-5 border-b border-white">
          {userListTableHeader.map((header) => (
            <p key={header} className="text-center">
              {header}
            </p>
          ))}
        </header>
        <div className="flex-1 overflow-auto">
          {filteredGroupMembers &&
            filteredGroupMembers.map((groupMember) => (
              <div
                key={groupMember.id}
                className="w-full h-15 grid grid-cols-user-list-table text-xl text-center items-center gap-x-2 border-b border-opacity-white-50"
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
    </CommonPageWrapper>
  );
}
