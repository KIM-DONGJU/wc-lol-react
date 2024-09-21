'use client';

import { useState } from 'react';
import { getMatchGroupsThreeDaysAgo } from '@/apis/matchGroups';
import { useQuery } from '@tanstack/react-query';

import { matchGroupsQueryKey } from '@/queries/matchGroupsQueryKey';

import CommonPageWrapper from '@/components/common/CommonPageWrapper';
import CommonSelect from '@/components/common/CommonSelect';
import CommonButton from '@/components/common/CommonButton';

export default function CreateMatch() {
  const { data: matchGroups } = useQuery({
    queryKey: matchGroupsQueryKey.getMatchGroupsThreeDaysAgo(),
    queryFn: getMatchGroupsThreeDaysAgo,
  });

  const parseMarchGroups =
    matchGroups?.map((matchGroup) => {
      return {
        label: matchGroup.group_name,
        value: matchGroup.id,
      };
    }) || [];

  const [currentMatchGroup, setCurrentMatchGroup] = useState<string | number>('');

  const onCreateMatch = () => {
    console.log('onCreateMatch');
  };

  return (
    <CommonPageWrapper>
      <div className="flex items-center gap-x-8">
        <CommonSelect
          options={parseMarchGroups}
          placeholder="대전 그룹 선택"
          value={currentMatchGroup}
          onChange={setCurrentMatchGroup}
        />
        <CommonButton variant="secondary" onClick={onCreateMatch}>
          대전 생성 +
        </CommonButton>
      </div>
    </CommonPageWrapper>
  );
}
