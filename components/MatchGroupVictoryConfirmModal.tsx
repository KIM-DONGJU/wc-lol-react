import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type Match } from '@/apis/matches';
import { fixedMatchGroup, type MatchGroup } from '@/apis/matchGroups';
import { useAsyncLoadingSpinner, useToastMessage } from '@/stores/useCommon';
import { matchGroupsQueryKey } from '@/queries/matchGroupsQueryKey';
import { getUser } from '@/apis/auth';
import { authQueryKey } from '@/queries/authQueryKey';
import { ONE_HOUR } from '@/constants/date';

import CommonModal from '@/components/common/CommonModal';
import { GroupMember } from '@/apis/groupMembers';
import { Position } from '@/interfaces/position';

interface MatchGroupVictoryConfirmModalProps {
  matchGroup: MatchGroup;
  matches: Match[];
  onClose: () => void;
}
export default function MatchGroupVictoryConfirmModal({
  matchGroup,
  matches,
  onClose,
}: MatchGroupVictoryConfirmModalProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToastMessage();
  const { showLoadingSpinner, hideLoadingSpinner } = useAsyncLoadingSpinner();

  const { data: userData } = useQuery({
    queryFn: getUser,
    queryKey: authQueryKey.getUser(),
    staleTime: ONE_HOUR,
    gcTime: 5 * ONE_HOUR,
  });

  interface OnFixedMatchGroupParams {
    winnerGroupMembers: number[];
    loserGroupMembers: number[];
  }
  const { mutate: onFixedMatchGroup } = useMutation({
    mutationFn: ({ winnerGroupMembers, loserGroupMembers }: OnFixedMatchGroupParams) => {
      showLoadingSpinner();
      return fixedMatchGroup({
        groupId: matchGroup.id,
        loserGroupMemberIds: loserGroupMembers,
        winnerGroupMemberIds: winnerGroupMembers,
      });
    },
    onSuccess: (matchGroupsRes) => {
      if (matchGroupsRes) {
        queryClient.setQueryData<MatchGroup[]>(
          matchGroupsQueryKey.getMatchGroupsThreeDaysAgo(),
          (oldData) => {
            if (!oldData) {
              return;
            }

            return oldData.map((oldMatchGroup) => {
              if (oldMatchGroup.id === matchGroup.id) {
                return matchGroupsRes[0];
              }
              return oldMatchGroup;
            });
          }
        );

        showToast({
          color: 'success',
          message: '승리팀이 확정되었습니다.',
        });
        onClose();
      }
    },
    onSettled: () => {
      hideLoadingSpinner();
    },
  });

  const handleOnFixedMatchGroup = () => {
    if (matchGroup.creator_id !== userData?.user?.id) {
      showToast({
        color: 'error',
        message: '대전 그룹을 생성한 유저만 승리팀을 확정할 수 있습니다.',
      });
      return;
    }

    const isEveryMatchSelectedWinner = matches.every((match) => match.wining_team_number !== null);
    if (!isEveryMatchSelectedWinner) {
      showToast({
        color: 'error',
        message: '모든 대전의 승리팀을 선택해주세요.',
      });
      return;
    }

    const getTeamMemberIds = (team: Record<Position, GroupMember>) =>
      Object.values(team).map((member) => member.id);

    const calculateWinCounts = (matches: Match[]) => {
      let firstTeamWinCount = 0;
      let secondTeamWinCount = 0;

      matches.forEach((match) => {
        if (match.wining_team_number === 0) {
          firstTeamWinCount++;
        } else {
          secondTeamWinCount++;
        }
      });

      return { firstTeamWinCount, secondTeamWinCount };
    };

    const { firstTeamWinCount, secondTeamWinCount } = calculateWinCounts(matches);
    let winnerGroupMemberIds: number[] = [];
    let loserGroupMemberIds: number[] = [];

    if (firstTeamWinCount !== secondTeamWinCount) {
      const lastMatch = matches[matches.length - 1];
      const winningTeamIndex = firstTeamWinCount > secondTeamWinCount ? 0 : 1;
      const losingTeamIndex = 1 - winningTeamIndex;

      winnerGroupMemberIds = getTeamMemberIds(lastMatch.teams[winningTeamIndex]);
      loserGroupMemberIds = getTeamMemberIds(lastMatch.teams[losingTeamIndex]);
    }

    onFixedMatchGroup({
      winnerGroupMembers: winnerGroupMemberIds,
      loserGroupMembers: loserGroupMemberIds,
    });
  };

  return (
    <CommonModal
      confirmName="확인"
      title="대전 그룹 승리 확정"
      onClose={onClose}
      onConfirm={handleOnFixedMatchGroup}
    >
      <p className="text-light-gray text-xl">
        <strong>{matchGroup.group_name}</strong> 대전 그룹의 승리팀을 확정하시겠습니까? <br />
        승리팀 확정 시 수정 및 삭제가 불가능하며, <br />
        연승/연패에 따라 유저들의 포지션 점수가 변동됩니다.
      </p>
    </CommonModal>
  );
}
