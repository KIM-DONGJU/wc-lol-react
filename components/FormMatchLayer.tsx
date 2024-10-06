'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

import useGroupMembers from '@/hooks/useGroupMembers';
import type { Position } from '@/interfaces/position';
import { type GroupMember } from '@/apis/groupMembers';
import { createMatch, getMatchesByGroupId, Match, updateMatchTeams } from '@/apis/matches';
import { useAsyncLoadingSpinner, useToastMessage } from '@/stores/useCommon';
import { getUser } from '@/apis/auth';
import { authQueryKey } from '@/queries/authQueryKey';
import { ONE_HOUR } from '@/constants/date';
import { matchesQueryKey } from '@/queries/matchesQueryKey';

import CommonButton from '@/components/common/CommonButton';
import CommonInput from '@/components/common/CommonInput';
import CommonLoadingSpinner from '@/components/common/CommonLoadingSpinner';

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

interface DraggableGroupMemberProps {
  groupMember: GroupMember;
  isSelectedMatchTeams: boolean;
}

function DraggableGroupMember({ groupMember, isSelectedMatchTeams }: DraggableGroupMemberProps) {
  const groupMemberRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = groupMemberRef.current;
    invariant(element);

    return draggable({
      element,
      canDrag: () => !isSelectedMatchTeams,
      getInitialData: () => ({ groupMember }),
    });
  }, [groupMember, isSelectedMatchTeams]);

  return (
    <div
      ref={groupMemberRef}
      className={`group h-18 ${isSelectedMatchTeams ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div
        className={`${isSelectedMatchTeams ? 'bg-gradient-primary-600' : 'bg-white bg-opacity-5'} h-full flex flex-col justify-center items-center gap-[0.125rem] p-3 rounded shadow-md group-hover:hidden`}
      >
        <p className="text-xl text-white font-semibold">{groupMember.name}</p>
        <p className="text-sm text-white text-opacity-80">{groupMember.nickname}</p>
      </div>
      <div
        className={`px-2 h-full hidden group-hover:flex justify-center items-center text-center bg-white bg-opacity-5 rounded shadow-md  ${isSelectedMatchTeams && 'border border-primary-100 border-opacity-50'}`}
      >
        {matchTables.map((table) => {
          return (
            <div key={table.value} className="flex-1 flex flex-col gap-y-1">
              <p className="text-xs text-white">{table.label}</p>
              <p className="text-xs">{groupMember.positionScore[table.value]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SwapMatchTeamInfo {
  table: MatchTable;
  teamIndex: 0 | 1;
  groupMember: GroupMember;
}
interface OnSwapMatchTeamParams {
  before: SwapMatchTeamInfo;
  after: SwapMatchTeamInfo;
}

interface DragAndDropMatchTableGroupMemberProps {
  table: MatchTable;
  tableIndex: number;
  matchTeams: Record<Position, GroupMember>[];
  onSetMatchTeam: (table: MatchTable, index: number, groupMember: GroupMember) => void;
  onSwapMatchTeam: (params: OnSwapMatchTeamParams) => void;
}

function DragAndDropMatchTableGroupMember({
  table,
  tableIndex,
  matchTeams,
  onSetMatchTeam,
  onSwapMatchTeam,
}: DragAndDropMatchTableGroupMemberProps) {
  const matchTableFirstTeamGroupMemberRef = useRef<HTMLDivElement | null>(null);
  const firstTeamGroupMember = matchTeams[0]?.[table.value];
  const secondTeamGroupMember = matchTeams[1]?.[table.value];

  useEffect(() => {
    const element = matchTableFirstTeamGroupMemberRef.current;
    invariant(element);

    return combine(
      draggable({
        element,
        canDrag: () => !!firstTeamGroupMember,
        getInitialData: () => ({
          swapGroupMember: {
            table,
            teamIndex: 0,
            groupMember: firstTeamGroupMember,
          },
        }),
      }),
      dropTargetForElements({
        element,
        onDrop: (data) => {
          const groupMember = data.source.data.groupMember as GroupMember;
          if (groupMember) {
            onSetMatchTeam(table, 0, groupMember);
            return;
          }

          if (element === data.source.element) {
            return;
          }

          const swapGroupMember = data.source.data.swapGroupMember as SwapMatchTeamInfo;
          if (swapGroupMember) {
            onSwapMatchTeam({
              before: swapGroupMember,
              after: {
                table,
                teamIndex: 0,
                groupMember: firstTeamGroupMember,
              },
            });
          }
        },
      })
    );
  }, [matchTeams]);

  const matchTableSecondTeamGroupMemberRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = matchTableSecondTeamGroupMemberRef.current;
    invariant(element);

    return combine(
      draggable({
        element,
        canDrag: () => !!secondTeamGroupMember,
        getInitialData: () => ({
          swapGroupMember: {
            table,
            teamIndex: 1,
            groupMember: secondTeamGroupMember,
          },
        }),
      }),
      dropTargetForElements({
        element,
        onDrop: (data) => {
          const groupMember = data.source.data.groupMember as GroupMember;
          if (groupMember) {
            onSetMatchTeam(table, 1, groupMember);
            return;
          }

          if (element === data.source.element) {
            return;
          }

          const swapGroupMember = data.source.data.swapGroupMember as SwapMatchTeamInfo;
          if (swapGroupMember) {
            onSwapMatchTeam({
              before: swapGroupMember,
              after: {
                table,
                teamIndex: 1,
                groupMember: secondTeamGroupMember,
              },
            });
          }
        },
      })
    );
  }, [matchTeams]);

  return (
    <>
      <div
        className={`flex justify-center items-center text-lg text-white text-opacity-80 rounded h-[3.625rem] ${tableIndex % 2 === 0 ? 'bg-gradient-primary-400' : 'bg-gradient-primary-500'}`}
      >
        {table.label}
      </div>
      <div
        ref={matchTableFirstTeamGroupMemberRef}
        className={`h-15 border border-gold border-opacity-40 border-t-0 flex ${firstTeamGroupMember && 'cursor-pointer'}`}
      >
        {firstTeamGroupMember.id && (
          <>
            <div className="flex flex-col justify-center items-center flex-1">
              <p className="text-lg text-white font-semibold">{firstTeamGroupMember?.name}</p>
              <p className="text-sm text-white text-opacity-50">{firstTeamGroupMember?.nickname}</p>
            </div>
            <p className="w-[45%] flex justify-center items-center border-l border-gold border-opacity-40">
              {firstTeamGroupMember?.positionScore?.[table.value as Position]}점
            </p>
          </>
        )}
      </div>
      <div
        ref={matchTableSecondTeamGroupMemberRef}
        className={`h-15 border border-gold border-opacity-40 border-t-0 border-l-0 flex ${secondTeamGroupMember && 'cursor-pointer'}`}
      >
        {secondTeamGroupMember.id && (
          <>
            <div className="flex flex-col justify-center items-center flex-1">
              <p className="text-lg text-white font-semibold">{secondTeamGroupMember?.name}</p>
              <p className="text-sm text-white text-opacity-50">
                {secondTeamGroupMember?.nickname}
              </p>
            </div>
            <p className="w-[45%] flex justify-center items-center border-l border-gold border-opacity-40">
              {secondTeamGroupMember?.positionScore?.[table.value as Position]}점
            </p>
          </>
        )}
      </div>
    </>
  );
}

interface FormMatchLayerProps {
  matchGroupId: number;
  isEdit?: boolean;
  matchId?: number;
  onClose: () => void;
}
export default function FormMatchLayer({
  matchGroupId,
  isEdit = false,
  matchId,
  onClose,
}: FormMatchLayerProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToastMessage();
  const { showLoadingSpinner, hideLoadingSpinner } = useAsyncLoadingSpinner();
  const { data: userData } = useQuery({
    queryFn: getUser,
    queryKey: authQueryKey.getUser(),
    staleTime: ONE_HOUR,
    gcTime: 5 * ONE_HOUR,
  });

  const { searchUser, setSearchUser, filteredGroupMembers, isLoading } = useGroupMembers(1);

  const { data: matches } = useQuery({
    queryFn: () => getMatchesByGroupId(matchGroupId),
    queryKey: matchesQueryKey.getMatchesByGroupId(matchGroupId),
    staleTime: ONE_HOUR,
    gcTime: 5 * ONE_HOUR,
  });

  const [matchTeams, setMatchTeams] = useState<Record<Position, GroupMember>[]>([
    {
      top: {},
      jungle: {},
      mid: {},
      adc: {},
      sup: {},
    } as Record<Position, GroupMember>,
    {
      top: {},
      jungle: {},
      mid: {},
      adc: {},
      sup: {},
    } as Record<Position, GroupMember>,
  ]);

  const findMatch = matches?.find((match) => match.id === matchId);
  useEffect(() => {
    if (isEdit && matchId && findMatch) {
      setMatchTeams(findMatch.teams);
    }
  }, []);

  const sumTeamsScore = matchTeams.map((team) => {
    return (
      Object.entries<GroupMember>(team).reduce(
        (acc, [position, groupMember]) =>
          acc + (groupMember?.positionScore?.[position as Position] || 0),
        0
      ) || undefined
    );
  });

  const onSetMatchTeam = (table: MatchTable, teamIndex: number, groupMember: GroupMember) => {
    setMatchTeams((prev) => {
      const newMatchTeams = [...prev];
      newMatchTeams[teamIndex] = {
        ...newMatchTeams[teamIndex],
        [table.value]: groupMember,
      };
      return newMatchTeams;
    });
  };

  const onSwapMatchTeam = (params: OnSwapMatchTeamParams) => {
    const { before, after } = params;

    const updatedMatchTeams = [...matchTeams];

    const beforeGroupMember = updatedMatchTeams[before.teamIndex][before.table.value];
    const afterGroupMember = updatedMatchTeams[after.teamIndex][after.table.value];

    updatedMatchTeams[before.teamIndex][before.table.value] = afterGroupMember || {};
    updatedMatchTeams[after.teamIndex][after.table.value] = beforeGroupMember || {};

    setMatchTeams(updatedMatchTeams);
  };

  const resetMatchTeams = () => {
    if (isEdit && findMatch) {
      setMatchTeams(findMatch.teams);
      return;
    }

    setMatchTeams([
      {
        top: {},
        jungle: {},
        mid: {},
        adc: {},
        sup: {},
      } as Record<Position, GroupMember>,
      {
        top: {},
        jungle: {},
        mid: {},
        adc: {},
        sup: {},
      } as Record<Position, GroupMember>,
    ]);
  };

  const selectedGroupMembers: Record<number, boolean> = matchTeams.reduce(
    (acc, cur) => {
      Object.values(cur).forEach((groupMember) => {
        if (groupMember.id) {
          acc[groupMember.id] = true;
        }
      });
      return acc;
    },
    {} as Record<number, boolean>
  );

  const { mutate: onCreateMatch } = useMutation({
    mutationFn: () => {
      showLoadingSpinner();
      return createMatch({
        groupId: matchGroupId,
        teams: matchTeams,
      });
    },
    onSuccess: (matchesRes) => {
      if (matchesRes) {
        queryClient.setQueryData<Match[]>(
          matchesQueryKey.getMatchesByGroupId(matchGroupId),
          (oldData) => {
            if (!oldData) {
              return matchesRes;
            }

            return [...oldData, matchesRes[0]];
          }
        );
        showToast({
          message: '대전이 생성되었습니다.',
          color: 'success',
        });
        onClose();
      }
    },
    onSettled: () => {
      hideLoadingSpinner();
    },
  });

  const { mutate: onUpdateMatch } = useMutation({
    mutationFn: () => {
      showLoadingSpinner();
      return updateMatchTeams({
        matchId: matchId as number,
        teams: matchTeams,
      });
    },
    onSuccess: (matchesRes) => {
      if (matchesRes) {
        queryClient.setQueryData<Match[]>(
          matchesQueryKey.getMatchesByGroupId(matchGroupId),
          (oldData) => {
            if (!oldData) {
              return;
            }

            return oldData.map((oldMatch: Match) => {
              if (oldMatch.id === matchId) {
                return { ...oldMatch, teams: matchTeams };
              }
              return oldMatch;
            });
          }
        );
        showToast({
          message: '대전이 수정되었습니다.',
          color: 'success',
        });
        onClose();
      }
    },
    onSettled: () => {
      hideLoadingSpinner();
    },
  });

  const handleFormMatch = async () => {
    if (!userData?.user?.id) {
      showToast({
        message: '로그인이 필요합니다.',
        color: 'error',
      });
      return;
    }

    if (matchTeams.some((team) => Object.values(team).some((user) => !user))) {
      showToast({
        message: '팀원을 모두 배치해주세요.',
        color: 'error',
      });
      return;
    }

    if (isEdit) {
      onUpdateMatch();
      return;
    }

    onCreateMatch();
  };

  const loadPreviousMatch = () => {
    if (!matches || matches.length === 0) return;

    const lastMatch = matches[matches.length - 1];
    setMatchTeams(lastMatch.teams);
  };

  return (
    <div className="common-layer fixed w-screen h-screen top-0 left-0 z-10 py-6 px-8 select-none">
      <div className="w-full max-w-screen-xl h-full mx-auto flex flex-col">
        <div className="flex justify-between items-center">
          <header className="text-2xl text-white text-opacity-80">
            그룹 참가자 검색 및 {isEdit ? '수정' : '등록'}
          </header>
          <div className="flex items-center gap-x-3">
            {!isEdit && !!matches?.length && (
              <CommonButton
                className="rounded-3xl px-3 h-[3.125rem]"
                variant="primary-light"
                onClick={loadPreviousMatch}
              >
                이전 대전 불러오기
              </CommonButton>
            )}
            <CommonButton
              className="w-30 h-[3.125rem] rounded-full"
              variant="secondary-tonal"
              onClick={resetMatchTeams}
            >
              초기화
            </CommonButton>
            <CommonButton
              className="w-[3.125rem] h-[3.125rem] rounded-full"
              variant="secondary-tonal"
              onClick={onClose}
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
          <div className="h-full flex-1 min-w-[25rem] bg-white bg-opacity-8 rounded-3xl flex flex-col items-center py-8 overflow-auto">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <CommonLoadingSpinner />
              </div>
            ) : (
              <>
                <CommonInput
                  className="w-full"
                  placeholder="이름, 닉네임 검색"
                  value={searchUser}
                  onChange={setSearchUser}
                />
                <div className="mt-5 w-full max-w-[90%] grid grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-5">
                  {filteredGroupMembers?.map((member) => (
                    <DraggableGroupMember
                      key={member.id}
                      groupMember={member}
                      isSelectedMatchTeams={selectedGroupMembers[member.id]}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="min-w-[660px] h-full bg-white bg-opacity-8 rounded-3xl flex flex-col items-center py-8 px-9">
            <header className="mt-8 flex items-center gap-x-6">
              <span className="text-primary-100 text-[2rem] font-medium">
                {!isEdit
                  ? (matches?.length || 0) + 1
                  : (matches?.findIndex((match) => match.id === matchId) || 0) + 1}{' '}
                경기
              </span>
              <span className="text-gold text-opacity-80 text-2xl font-light">
                그룹 참가자 목록
              </span>
            </header>
            <div className="mt-6 w-full grid grid-cols-match-user-table items-center">
              <div />
              <div className="bg-gradient-primary-100 h-15 text-gold text-xl border border-gold border-opacity-40 flex justify-center items-center rounded-tl-sm">
                1팀
              </div>
              <div className="bg-gradient-primary-300 h-15 text-gold text-xl border border-gold border-opacity-40 border-l-0 flex justify-center items-center rounded-tr-sm">
                2팀
              </div>
              {matchTables.map((table, index) => {
                return (
                  <DragAndDropMatchTableGroupMember
                    key={index}
                    matchTeams={matchTeams}
                    table={table}
                    tableIndex={index}
                    onSetMatchTeam={onSetMatchTeam}
                    onSwapMatchTeam={onSwapMatchTeam}
                  />
                );
              })}
              <div className="flex justify-center items-center text-lg text-white text-opacity-80 rounded h-[3.625rem] bg-gradient-primary-500">
                합
              </div>
              <div className="h-15 border border-gold border-opacity-40 border-t-0 flex flex-col justify-center items-center">
                <p className="text-lg text-white font-semibold">{sumTeamsScore[0]}</p>
              </div>
              <div className="h-15 border border-gold border-opacity-40 border-t-0 border-l-0 flex flex-col justify-center items-center">
                <p className="text-lg text-white font-semibold">{sumTeamsScore[1]}</p>
              </div>
            </div>
            <div className="pl-[3.625rem] mt-[1.125rem] w-full">
              <CommonButton className="w-full" variant="primary" onClick={handleFormMatch}>
                {isEdit ? '수정' : '완료'}
              </CommonButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
