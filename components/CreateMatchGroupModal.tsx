'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { matchGroupsQueryKey } from '@/queries/matchGroupsQueryKey';
import { createMatchGroup, MatchGroup } from '@/apis/matchGroups';
import { useToastMessage } from '@/stores/useCommon';
import { getUser } from '@/apis/auth';
import { authQueryKey } from '@/queries/authQueryKey';
import { ONE_HOUR } from '@/constants/date';

import CommonInput from '@/components/common/CommonInput';
import CommonModal from '@/components/common/CommonModal';

interface CreateMatchGroupModalProps {
  onClose: () => void;
  // 매치 그룹 생성 성공 시 호출되는 콜백 함수
  onSuccess: (matchGroups: MatchGroup[]) => void;
}

export default function CreateMatchGroupModal({ onClose, onSuccess }: CreateMatchGroupModalProps) {
  const { showToast } = useToastMessage();
  const [inputValue, setInputValue] = useState('');
  const { data: userData } = useQuery({
    queryFn: getUser,
    queryKey: authQueryKey.getUser(),
    staleTime: ONE_HOUR,
    gcTime: 5 * ONE_HOUR,
  });

  const { mutate: onCreateMatchGroup } = useMutation({
    mutationFn: () =>
      createMatchGroup({
        creatorId: userData?.user?.id as string,
        groupName: inputValue,
      }),
    mutationKey: matchGroupsQueryKey.createMatchGroup(),
    onSuccess: (matchGroups) => {
      onSuccess(matchGroups as MatchGroup[]);
      showToast({
        message: '대전 그룹이 생성되었습니다.',
        color: 'success',
      });
      onClose();
    },
  });

  const handleCreateMatchGroup = () => {
    if (!inputValue) {
      showToast({
        message: '대전 그룹 이름을 입력해주세요.',
        color: 'error',
      });
      return;
    }

    if (!userData?.user?.id) {
      showToast({
        message: '로그인이 필요합니다.',
        color: 'error',
      });
      return;
    }

    onCreateMatchGroup();
  };

  return (
    <CommonModal
      className="w-150"
      title="대전 그룹 생성"
      onClose={onClose}
      onConfirm={handleCreateMatchGroup}
    >
      <div className="flex items-center gap-x-4">
        <p className="text-light-black text-xl">대전 그룹 이름</p>
        <CommonInput
          clearIcon
          className="border-gray border rounded-lg pl-0 focus-within:outline-light-black flex-1"
          fontColor="black"
          placeholder="대전 그룹 생성"
          type="text"
          value={inputValue}
          onChange={setInputValue}
        />
      </div>
    </CommonModal>
  );
}
