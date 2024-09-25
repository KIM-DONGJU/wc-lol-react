'use client';

import Image from 'next/image';

import useGroupMembers from '@/hooks/useGroupMembers';
import type { Position } from '@/interfaces/position';
import { type GroupMember } from '@/apis/groupMembers';

import CommonButton from '@/components/common/CommonButton';
import CommonInput from '@/components/common/CommonInput';
import { useState } from 'react';

export default function CreateMatchLayer() {
  const { searchUser, setSearchUser, filteredGroupMembers } = useGroupMembers(1);

  interface MatchTable {
    label: string;
    value: Position;
  }

  const matchTables: MatchTable[] = [
    {
      label: '탑',
      value: 'top',
    },
    {
      label: '정글',
      value: 'jungle',
    },
    {
      label: '미드',
      value: 'mid',
    },
    {
      label: '원딜',
      value: 'adc',
    },
    {
      label: '서폿',
      value: 'sup',
    },
  ];

  const [matchTeams, setMatchTeams] = useState<Record<Position, GroupMember>[]>([]);
  const sumTeamsScore = matchTeams.map((team) => {
    return Object.entries<GroupMember>(team).reduce(
      (acc, [position, groupMember]) => acc + groupMember.positionScore[position as Position],
      0
    );
  });

  return (
    <div className="common-layer fixed w-screen h-screen top-0 left-0 z-10 py-6 px-8">
      <div className="w-full max-w-screen-xl h-full mx-auto flex flex-col">
        <div className="flex justify-between items-center">
          <header className="text-2xl text-opacity-white-80">그룹 참가자 검색 및 등록</header>
          <div className="flex items-center gap-x-3">
            <CommonButton
              height="h-12.5"
              radius="rounded-full"
              variant="secondary-tonal"
              width="w-30"
              onClick={() => {}}
            >
              전체 삭제
            </CommonButton>
            <CommonButton
              height="h-12.5"
              radius="rounded-full"
              variant="secondary-tonal"
              width="w-12.5"
              onClick={() => {}}
            >
              <div className="flex justify-center items-center">
                <Image
                  alt="close"
                  className="w-[18px] h-[18px]"
                  height="18"
                  src="/icons/close.svg"
                  width="18"
                />
              </div>
            </CommonButton>
          </div>
        </div>
        <div className="mt-4 flex-1 w-full flex items-center gap-x-5 overflow-y-hidden overflow-x-auto">
          <div className="h-full flex-1 min-w-[400px] bg-opacity-white-8 rounded-3xl flex flex-col items-center py-8 overflow-auto">
            <CommonInput
              placeholder="이름, 닉네임 검색"
              value={searchUser}
              width="w-full"
              onChange={setSearchUser}
            />
            <div className="mt-5 w-full max-w-[90%] grid grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-5">
              {filteredGroupMembers?.map((member) => (
                <div
                  key={member.id}
                  className="bg-opacity-white-5 flex flex-col justify-center items-center gap-1 p-3 rounded cursor-pointer"
                >
                  <p className="text-xl text-white font-semibold">{member.name}</p>
                  <p className="text-sm text-opacity-white-80">{member.nickname}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-[660px] h-full bg-opacity-white-8 rounded-3xl flex flex-col items-center py-8 px-9">
            <header className="mt-8 flex items-center gap-x-6">
              <span className="text-primary-100 text-[2rem] font-medium">1 경기</span>
              <span className="text-opacity-gold-80 text-2xl">그룹 참가자 목록</span>
            </header>
            <div className="mt-6 w-full grid grid-cols-match-user-table items-center">
              <div />
              <div className="bg-gradient-primary-100 h-15 text-gold text-xl border border-opacity-gold-40 flex justify-center items-center rounded-tl-sm">
                1팀
              </div>
              <div className="bg-gradient-primary-300 h-15 text-gold text-xl border border-opacity-gold-40 border-l-0 flex justify-center items-center rounded-tr-sm">
                2팀
              </div>
              {matchTables.map((table, index) => {
                return (
                  <>
                    <div
                      className={`flex justify-center items-center text-lg text-opacity-white-80 rounded h-[3.625rem] ${index % 2 === 0 ? 'bg-gradient-primary-400' : 'bg-gradient-primary-500'}`}
                    >
                      {table.label}
                    </div>
                    <div className="h-15 border border-opacity-gold-40 border-t-0 flex flex-col justify-center items-center">
                      <p className="text-lg text-white font-semibold">
                        {matchTeams?.[0]?.[table.value].name}
                      </p>
                      <p className="text-sm text-opacity-white-50">
                        {matchTeams?.[0]?.[table.value].nickname}
                      </p>
                    </div>
                    <div className="h-15 border border-opacity-gold-40 border-t-0 border-l-0 flex flex-col justify-center items-center">
                      <p className="text-lg text-white font-semibold">
                        {matchTeams?.[1]?.[table.value].name}
                      </p>
                      <p className="text-sm text-opacity-white-50">
                        {matchTeams?.[1]?.[table.value].nickname}
                      </p>
                    </div>
                  </>
                );
              })}
              <div className="flex justify-center items-center text-lg text-opacity-white-80 rounded h-[3.625rem] bg-gradient-primary-500">
                합
              </div>
              <div className="h-15 border border-opacity-gold-40 border-t-0 flex flex-col justify-center items-center">
                <p className="text-lg text-white font-semibold">{sumTeamsScore[0]}</p>
              </div>
              <div className="h-15 border border-opacity-gold-40 border-t-0 border-l-0 flex flex-col justify-center items-center">
                <p className="text-lg text-white font-semibold">{sumTeamsScore[1]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
