import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteMatch, Match } from '@/apis/matches';
import { useAsyncLoadingSpinner, useToastMessage } from '@/stores/useCommon';

import CommonModal from '@/components/common/CommonModal';
import { matchesQueryKey } from '@/queries/matchesQueryKey';

interface DeleteMatchModalProps {
  matchGroupId: number;
  matchGroupName: string;
  matchId: number;
  matchName: string;
  onClose: () => void;
}
export default function DeleteMatchModal({
  matchGroupId,
  matchGroupName,
  matchName,
  matchId,
  onClose,
}: DeleteMatchModalProps) {
  const queryClient = useQueryClient();

  const { showToast } = useToastMessage();
  const { showLoadingSpinner, hideLoadingSpinner } = useAsyncLoadingSpinner();
  const { mutate: onDeleteMatch } = useMutation({
    mutationFn: () => {
      showLoadingSpinner();
      return deleteMatch(matchId);
    },
    onSuccess: () => {
      queryClient.setQueryData<Match[]>(
        matchesQueryKey.getMatchesByGroupId(matchGroupId),
        (oldData) => {
          if (!oldData) {
            return;
          }
          return oldData.filter((match) => match.id !== matchId);
        }
      );
      showToast({
        color: 'success',
        message: '대전이 삭제되었습니다.',
      });
      onClose();
    },
    onSettled: () => {
      hideLoadingSpinner();
    },
  });
  return (
    <CommonModal
      className="text-center"
      confirmName="확인"
      title="대전 삭제"
      onClose={onClose}
      onConfirm={onDeleteMatch}
    >
      <p className="text-light-gray text-xl text-center">{`${matchGroupName} 대전그룹의 ${matchName}를 삭제하시겠습니까?`}</p>
    </CommonModal>
  );
}
