'use client';

import { useState } from 'react';
import { getMatchGroupsThreeDaysAgo } from '@/apis/matchGroups';
import { useQuery } from '@tanstack/react-query';

import { matchGroupsQueryKey } from '@/queries/matchGroupsQueryKey';

import CommonPageWrapper from '@/components/common/CommonPageWrapper';
import CommonSelect from '@/components/common/CommonSelect';

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

  return (
    <CommonPageWrapper>
      <CommonSelect
        options={parseMarchGroups}
        placeholder="대전 그룹 선택"
        value={currentMatchGroup}
        onChange={setCurrentMatchGroup}
      ></CommonSelect>
    </CommonPageWrapper>
  );
}
