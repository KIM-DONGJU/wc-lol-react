'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import Image from 'next/image';

import { groupMembersQueryKey } from '@/queries/groupMembersQueryKey';
import { LOLChampionsQueryKey } from '@/queries/LOLChampionsQueryKey';
import { getGroupMembers } from '@/apis/groupMembers';
import { getLOLChampions } from '@/apis/LOLChampions';
import { ONE_HOUR } from '@/constants/date';
import type { SearchPosition, SearchPositionKR } from '@/interfaces/position';

import CommonInput from '@/components/common/CommonInput';
import CommonPageWrapper from '@/components/common/CommonPageWrapper';

export default function UserStats() {
  const { data } = useQuery({
    queryKey: groupMembersQueryKey.getGroupMembers(1),
    queryFn: () => getGroupMembers(1),
    gcTime: 5 * ONE_HOUR,
    staleTime: ONE_HOUR,
  });

  const [searchUser, setSearchUser] = useState('');

  interface SearchPositionType {
    label: SearchPositionKR;
    value: SearchPosition;
  }

  const searchPositionTypeList: SearchPositionType[] = [
    {
      label: '전체',
      value: 'all',
    },
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

  const userListTableHeader = ['이름', '닉네임', '포인트', '포지션', '모스트 챔피언'];
  const [selectPosition, setSelectPosition] = useState<SearchPosition>('all');

  const mainAndSubPositionMembers = data
    ?.flatMap((groupMember) => {
      const mainAndSubPositionMembersWithScore = [
        {
          ...groupMember,
          position: groupMember.mainPosition,
          score: groupMember.positionScore[groupMember.mainPosition],
        },
      ];

      if (groupMember.subPosition) {
        mainAndSubPositionMembersWithScore.push({
          ...groupMember,
          position: groupMember.subPosition,
          score: groupMember.positionScore[groupMember.subPosition],
        });
      }

      return mainAndSubPositionMembersWithScore;
    })
    ?.filter((groupMember) => {
      if (selectPosition !== 'all' && groupMember.position !== selectPosition) {
        return false;
      }

      const trimmedSearchUser = searchUser.trim();
      if (
        trimmedSearchUser &&
        !groupMember.nickname.includes(trimmedSearchUser) &&
        !groupMember.name.includes(trimmedSearchUser)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => b.score - a.score);

  const { data: champions } = useQuery({
    queryKey: LOLChampionsQueryKey.getLOLChampions(),
    queryFn: () => getLOLChampions(),
    gcTime: 5 * ONE_HOUR,
    staleTime: ONE_HOUR,
  });

  // useMemo를 사용하기에는 적은 데이터지만, 이름/닉네임 검색을 할 때마다 불필요하게 re-rendering이 발생되는 것을 방지하기 위해 사용
  const championImageUrls = useMemo(() => {
    if (!champions) return {}; // champions가 falsy일 때 빈 객체 반환

    return champions.reduce(
      (acc, champion) => {
        acc[champion.id] = champion.image_url;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [champions]);

  return (
    <CommonPageWrapper>
      <div className="w-full flex justify-center items-center">
        <CommonInput placeholder="이름, 닉네임 검색" value={searchUser} onChange={setSearchUser} />
      </div>
      <div className="mt-8 w-full border border-white border-opacity-50 rounded overflow-hidden">
        <table className="w-full h-15 border-spacing-0">
          <tbody>
            <tr className="divide-x divide-white divide-opacity-50">
              {searchPositionTypeList.map((position) => (
                <td key={position.value} className="w-1/6 text-center">
                  <button
                    className={`w-full h-full text-center ${
                      selectPosition === position.value ? 'bg-gradient-primary-100' : ''
                    }`}
                    onClick={() => setSelectPosition(position.value)}
                  >
                    {position.label}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex-1 flex flex-col">
        <header className="w-full h-15 grid grid-cols-user-stats-table text-xl items-center gap-x-2 bg-white bg-opacity-5 border-b border-white">
          {userListTableHeader.map((header) => (
            <p key={header} className="text-center">
              {header}
            </p>
          ))}
        </header>
        <div className="flex-1 overflow-auto">
          {mainAndSubPositionMembers &&
            mainAndSubPositionMembers.map((groupMember) => (
              <div
                key={`${groupMember.id}-${groupMember.position}`}
                className="w-full h-15 grid grid-cols-user-stats-table grid- text-xl text-center items-center gap-x-2 border-b border-white border-opacity-25"
              >
                <p>{groupMember.name}</p>
                <p>{groupMember.nickname}</p>
                <p>{groupMember.score}</p>
                <div className="flex justify-center items-center">
                  <Image
                    alt="top"
                    className="w-7 h-7"
                    height={28}
                    src={`/icons/position-${groupMember.position}.svg`}
                    width={28}
                  />
                </div>
                <div className="flex gap-x-3 items-center overflow-x-auto">
                  {groupMember.most_champions?.map((champion) => {
                    return (
                      championImageUrls[champion] && (
                        <Image
                          key={`${groupMember.id}-${champion}`}
                          alt={champion}
                          className="w-10 h-10 shadow-md"
                          height={40}
                          src={`${championImageUrls[champion]}`}
                          width={40}
                        />
                      )
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </CommonPageWrapper>
  );
}
