import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getGroupMembers } from '@/apis/groupMembers';
import { groupMembersQueryKey } from '@/queries/groupMembersQueryKey';
import { ONE_HOUR } from '@/constants/date';

const useGroupMembers = (groupId: number) => {
  const [searchUser, setSearchUser] = useState('');

  const {
    data: groupMembers,
    isLoading,
    error,
  } = useQuery({
    queryKey: groupMembersQueryKey.getGroupMembers(groupId),
    queryFn: () => getGroupMembers(groupId),
    gcTime: 5 * ONE_HOUR,
    staleTime: ONE_HOUR,
  });

  const filteredGroupMembers = groupMembers?.filter((groupMember) => {
    if (!searchUser) return true;
    return (
      groupMember.name.includes(searchUser.trim()) ||
      groupMember.nickname.includes(searchUser.trim())
    );
  });

  return { filteredGroupMembers, searchUser, setSearchUser, isLoading, error };
};

export default useGroupMembers;
