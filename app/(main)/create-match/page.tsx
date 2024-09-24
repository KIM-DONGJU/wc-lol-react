'use client';

import { useState } from 'react';
import { getMatchGroupsThreeDaysAgo } from '@/apis/matchGroups';
import { useQuery } from '@tanstack/react-query';

import { matchGroupsQueryKey } from '@/queries/matchGroupsQueryKey';
import { matchesQueryKey } from '@/queries/matchesQueryKey';
import { getMatchesByGroupId } from '@/apis/matches';
import { ONE_HOUR } from '@/constants/date';

import CommonPageWrapper from '@/components/common/CommonPageWrapper';
import CommonSelect from '@/components/common/CommonSelect';
import CommonButton from '@/components/common/CommonButton';
import MatchInfo from '@/components/MatchInfo';

export default function CreateMatch() {
  const { data: matchGroups } = useQuery({
    queryKey: matchGroupsQueryKey.getMatchGroupsThreeDaysAgo(),
    queryFn: getMatchGroupsThreeDaysAgo,
    staleTime: ONE_HOUR,
    gcTime: 5 * ONE_HOUR,
  });

  const parseMarchGroups =
    matchGroups?.map((matchGroup) => {
      return {
        label: matchGroup.group_name,
        value: matchGroup.id,
      };
    }) || [];

  const [currentMatchGroupId, setCurrentMatchGroupId] = useState<string | number>('');
  const currentMatchGroup = matchGroups?.find((matchGroup) => {
    return matchGroup.id === Number(currentMatchGroupId);
  });

  const { data: matches } = useQuery({
    queryKey: matchesQueryKey.getMatchesByGroupId(currentMatchGroupId as number),
    queryFn: () => getMatchesByGroupId(currentMatchGroupId as number),
    gcTime: 5 * ONE_HOUR,
    staleTime: ONE_HOUR,
    enabled: currentMatchGroupId !== '',
  });

  const onCreateMatch = () => {
    console.log('onCreateMatch');
  };

  return (
    <CommonPageWrapper>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-x-8 mb-6">
          <CommonSelect
            options={parseMarchGroups}
            placeholder="대전 그룹 선택"
            value={currentMatchGroupId}
            onChange={setCurrentMatchGroupId}
          />
          <CommonButton variant="secondary" onClick={onCreateMatch}>
            대전 생성 +
          </CommonButton>
        </div>
        <div className="h-full flex flex-col gap-y-10">
          {currentMatchGroupId && matches ? (
            matches.map((match, index) => {
              return (
                <MatchInfo
                  key={match.id}
                  isFixed={currentMatchGroup?.is_fixed || false}
                  match={match}
                  matchName={`${matches.length - index} 경기`}
                />
              );
            })
          ) : (
            <p className="pb-[60px] flex-1 flex justify-center items-center text-2xl text-opacity-white-80">
              대전 그룹을 선택해 주세요.
            </p>
          )}
        </div>
      </div>
    </CommonPageWrapper>
  );
}
