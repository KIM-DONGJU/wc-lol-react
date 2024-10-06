'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

import { selectWinningTeam, type Match } from '@/apis/matches';
import { useAsyncLoadingSpinner, useToastMessage } from '@/stores/useCommon';

import CommonButton from '@/components/common/CommonButton';
import { matchesQueryKey } from '@/queries/matchesQueryKey';
import FormMatchLayer from './FormMatchLayer';
import DeleteMatchModal from './DeleteMatchModal';

interface MatchInfoProps {
  matchGroupName: string;
  match: Match;
  matchName: string;
  isFixed: boolean;
}

export default function MatchInfo({ matchGroupName, match, matchName, isFixed }: MatchInfoProps) {
  const queryClient = useQueryClient();
  const [winningSelectingTeam, setWinningSelectingTeam] = useState<boolean>(false);
  const { showLoadingSpinner, hideLoadingSpinner } = useAsyncLoadingSpinner();
  const { showToast } = useToastMessage();

  const { mutate: onSelectWinningTeam } = useMutation({
    mutationFn: (teamNumber: number) => {
      showLoadingSpinner();
      return selectWinningTeam({ matchId: match.id, teamNumber });
    },
    onSuccess: (matchesRes) => {
      if (matchesRes) {
        const matchRes = matchesRes[0];

        queryClient.setQueryData<Match[]>(
          matchesQueryKey.getMatchesByGroupId(matchRes.group_id),
          (oldData) => {
            if (!oldData) {
              return;
            }

            return oldData.map((oldMatch: Match) => {
              if (oldMatch.id === matchRes.id) {
                return { ...oldMatch, wining_team_number: matchRes.wining_team_number };
              }
              return oldMatch;
            });
          }
        );

        showToast({
          color: 'success',
          message: '승리팀이 선택되었습니다.',
        });
      }
    },
    onSettled: () => {
      setWinningSelectingTeam(false);
      hideLoadingSpinner();
    },
  });

  const handleSelectWinningTeam = (teamNumber: number) => {
    if (!winningSelectingTeam) {
      return;
    }

    if (match.wining_team_number === teamNumber) {
      setWinningSelectingTeam(false);
      return;
    }

    onSelectWinningTeam(teamNumber);
  };

  const [isVisibleFormMatchLayer, setIsVisibleFormMatchLayer] = useState<boolean>(false);
  const positionList = [
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
  ] as const;

  const [isVisibleDeleteMatchModal, setIsVisibleDeleteMatchModal] = useState<boolean>(false);

  return (
    match && (
      <div>
        <div className="h-15 px-4 flex justify-between items-center bg-white bg-opacity-5 border-gold border-b">
          <div className="flex items-center gap-x-6">
            <p className="text-2xl font-bold text-gold">{matchName}</p>
            {match.wining_team_number !== null ? (
              <p className="flex items-center text-primary-100 gap-x-2">
                <span className="font-thin text-xl">승리팀 선택 완료</span>
                <Image
                  alt="check"
                  className="w-6 h-6"
                  height="24"
                  src="/icons/material-symbols-light_check.svg"
                  width="24"
                />
              </p>
            ) : (
              <span className="text-xl text-white text-opacity-80">승리팀을 선택해 주세요.</span>
            )}
          </div>
          {!isFixed && (
            <div className="flex items-center gap-x-[10px]">
              <CommonButton
                className="w-30 h-7.5 rounded-full text-[1.125rem]" // text-lg가 있지만 CommonButton의 기본 값인 text-xl이 tailwind css에서 빌드될 때 lg보다 xl이 더 뒤에 있게 렌더링 되어서(이름순) rem으로 직접 선언
                variant={`${match.wining_team_number !== null ? 'secondary-tonal' : 'primary-light'}`}
                onClick={() => setWinningSelectingTeam(true)}
              >
                승리팀 {match.wining_team_number !== null ? '수정' : '선택'}
              </CommonButton>
              <CommonButton
                className="w-18 h-7.5 rounded-full text-[1.125rem]"
                variant="secondary-tonal"
                onClick={() => setIsVisibleFormMatchLayer(true)}
              >
                수정
              </CommonButton>
              <CommonButton
                className="w-8 h-8 rounded-full"
                variant="secondary-tonal"
                onClick={() => setIsVisibleDeleteMatchModal(true)}
              >
                <div className="flex justify-center items-center">
                  <Image
                    alt="close"
                    className="w-3 h-3"
                    height="12"
                    src="/icons/close.svg"
                    width="12"
                  />
                </div>
              </CommonButton>
            </div>
          )}
        </div>
        <div className={`relative mt-6 flex flex-col gap-6 ${winningSelectingTeam && 'z-20'}`}>
          {match.teams?.map((team, index) => (
            <button
              key={`${index}`}
              className={`grid grid-cols-5 gap-6 ${winningSelectingTeam ? 'group cursor-pointer' : 'cursor-default'}`}
              onClick={() => handleSelectWinningTeam(index)}
            >
              {positionList.map((position, memberIndex) => {
                const member = team[position.value];
                return (
                  <div
                    key={`${index}-${memberIndex}`}
                    className={`h-20 flex flex-col justify-center items-center rounded gap-1 ${!winningSelectingTeam && match.wining_team_number === index ? 'bg-gradient-primary-200 border border-primary-100' : 'bg-white bg-opacity-5 border shadow-md'} group-hover:bg-gradient-primary-200 group-hover:border group-hover:border-primary-100`}
                  >
                    <p
                      className={`text-xl font-semibold ${!winningSelectingTeam && match.wining_team_number === index && 'text-primary-100'}`}
                    >
                      {member.name}
                    </p>
                    <p
                      className={`text-primary-300 ${!winningSelectingTeam && match.wining_team_number === index ? 'text-primary-300' : 'text-white text-opacity-80'}`}
                    >
                      {member.nickname}
                    </p>
                  </div>
                );
              })}
            </button>
          ))}
        </div>
        {winningSelectingTeam && (
          <button
            className="dim fixed top-0 left-0 w-screen h-screen z-10 bg-black bg-opacity-50 cursor-default"
            onClick={() => setWinningSelectingTeam(false)}
          />
        )}
        {isVisibleFormMatchLayer && (
          <FormMatchLayer
            isEdit
            matchGroupId={match.group_id}
            matchId={match.id}
            onClose={() => setIsVisibleFormMatchLayer(false)}
          />
        )}
        {isVisibleDeleteMatchModal && (
          <DeleteMatchModal
            matchGroupId={match.group_id}
            matchGroupName={matchGroupName}
            matchId={match.id}
            matchName={matchName}
            onClose={() => setIsVisibleDeleteMatchModal(false)}
          />
        )}
      </div>
    )
  );
}
