'use client';

import { useState } from 'react';
import { getMatchGroupsThreeDaysAgo, type MatchGroup } from '@/apis/matchGroups';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

import { matchGroupsQueryKey } from '@/queries/matchGroupsQueryKey';
import { matchesQueryKey } from '@/queries/matchesQueryKey';
import { getMatchesByGroupId, type Match } from '@/apis/matches';
import { ONE_HOUR } from '@/constants/date';

import CommonPageWrapper from '@/components/common/CommonPageWrapper';
import CommonSelect from '@/components/common/CommonSelect';
import CommonButton from '@/components/common/CommonButton';
import MatchInfo from '@/components/MatchInfo';
import FormMatchLayer from '@/components/FormMatchLayer';
import CreateMatchGroupModal from '@/components/CreateMatchGroupModal';
import CommonLoadingSpinner from '@/components/common/CommonLoadingSpinner';
import MatchGroupVictoryConfirmModal from '@/components/MatchGroupVictoryConfirmModal';

interface MatchGroupDisplayProps {
  matches: Match[];
  isMatchGroupLoading: boolean;
  isMatchesLoading: boolean;
  currentMatchGroup?: MatchGroup;
  openFormMatchLayer: () => void;
}

// 단순히 내부에서 복잡한 조건문을 처리하기 위해 만든 컴포넌트라 따로 파일로 분리하지 않음
const MatchGroupDisplay = ({
  matches,
  currentMatchGroup,
  isMatchGroupLoading,
  isMatchesLoading,
  openFormMatchLayer,
}: MatchGroupDisplayProps) => {
  if (isMatchGroupLoading || isMatchesLoading) {
    return (
      <div className="h-full pb-29 flex justify-center items-center">
        <CommonLoadingSpinner />
      </div>
    );
  }

  // 대전 그룹이 선택되지 않은 경우
  if (!currentMatchGroup) {
    return (
      <p className="pb-29 flex-1 flex justify-center items-center text-2xl text-white text-opacity-80">
        대전 그룹을 선택해 주세요.
      </p>
    );
  }

  // 대전 그룹은 선택되었으나 생성된 대전이 없는 경우
  if (!matches || matches.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center items-center gap-y-7 pb-29">
        <p className="text-white text-opacity-80 text-2xl">대전 그룹에 생성된 대전이 없습니다.</p>
        <CommonButton
          className="w-50 shadow-md rounded-4xl text-xl"
          variant="primary-light"
          onClick={openFormMatchLayer}
        >
          대전 생성
        </CommonButton>
      </div>
    );
  }

  return (
    <>
      {matches.map((match, index) => {
        return (
          <MatchInfo
            key={match.id}
            isFixed={currentMatchGroup?.is_fixed || false}
            match={match}
            matchGroupName={currentMatchGroup.group_name}
            matchName={`${index + 1} 경기`}
          />
        );
      })}
      {!currentMatchGroup?.is_fixed && (
        <CommonButton
          className="text-primary-100 text-2xl"
          variant="secondary"
          onClick={openFormMatchLayer}
        >
          대전팀 추가 +
        </CommonButton>
      )}
    </>
  );
};

export default function CreateMatch() {
  const queryClient = useQueryClient();

  const { data: matchGroups, isLoading: isMatchGroupLoading } = useQuery({
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
  const currentMatchGroupIdToNumber = Number(currentMatchGroupId);

  const currentMatchGroup = matchGroups?.find((matchGroup) => {
    return matchGroup.id === currentMatchGroupIdToNumber;
  });

  const { data: matches, isLoading: isMatchesLoading } = useQuery({
    queryKey: matchesQueryKey.getMatchesByGroupId(currentMatchGroupIdToNumber),
    queryFn: () => getMatchesByGroupId(currentMatchGroupIdToNumber),
    gcTime: 5 * ONE_HOUR,
    staleTime: ONE_HOUR,
    enabled: currentMatchGroupId !== '',
  });

  const isVisibleWinnerConfirmButton =
    currentMatchGroup && !currentMatchGroup.is_fixed && matches && matches.length > 0;

  const [isVisibleFormMatchLayer, setIsVisibleFormMatchLayer] = useState(false);

  const [isVisibleCreateMatchGroupModal, setIsVisibleCreateMatchGroupModal] = useState(false);

  const onSuccessCreateMatchGroup = async (resMatchGroups: MatchGroup[]) => {
    queryClient.invalidateQueries({
      queryKey: matchGroupsQueryKey.getMatchGroupsThreeDaysAgo(),
    });

    setCurrentMatchGroupId(resMatchGroups[0].id);
  };

  const [isVisibleMatchGroupVictoryConfirmModal, setIsVisibleMatchGroupVictoryConfirmModal] =
    useState(false);

  return (
    <div className="pb-10 flex-1 flex flex-col">
      <CommonPageWrapper>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center gap-x-8 mb-6">
            <div className="flex items-center gap-x-8">
              <CommonSelect
                options={parseMarchGroups}
                placeholder="대전 그룹 선택"
                value={currentMatchGroupId}
                onChange={setCurrentMatchGroupId}
              />
              <CommonButton
                className="w-50 rounded"
                variant="secondary"
                onClick={() => setIsVisibleCreateMatchGroupModal(true)}
              >
                대전 그룹 +
              </CommonButton>
            </div>
            {isVisibleWinnerConfirmButton && (
              <CommonButton
                className="w-50 shadow-md rounded-4xl flex justify-center items-center gap-x-1"
                variant="primary-light"
                onClick={() => setIsVisibleMatchGroupVictoryConfirmModal(true)}
              >
                <span>승리팀 확정</span>
                <Image alt="trophy" height={18} src="/icons/trophy.svg" width={16} />
              </CommonButton>
            )}
          </div>
          <div className="h-full flex flex-col gap-y-10">
            <MatchGroupDisplay
              currentMatchGroup={currentMatchGroup}
              isMatchGroupLoading={isMatchGroupLoading}
              isMatchesLoading={isMatchesLoading}
              matches={matches || []}
              openFormMatchLayer={() => setIsVisibleFormMatchLayer(true)}
            />
          </div>
        </div>
      </CommonPageWrapper>
      {isVisibleFormMatchLayer && (
        <FormMatchLayer
          matchGroupId={currentMatchGroupIdToNumber}
          onClose={() => setIsVisibleFormMatchLayer(false)}
        />
      )}
      {isVisibleCreateMatchGroupModal && (
        <CreateMatchGroupModal
          onClose={() => setIsVisibleCreateMatchGroupModal(false)}
          onSuccess={onSuccessCreateMatchGroup}
        />
      )}
      {isVisibleMatchGroupVictoryConfirmModal && (
        <MatchGroupVictoryConfirmModal
          matchGroup={currentMatchGroup as MatchGroup}
          matches={matches as Match[]}
          onClose={() => setIsVisibleMatchGroupVictoryConfirmModal(false)}
        />
      )}
    </div>
  );
}
