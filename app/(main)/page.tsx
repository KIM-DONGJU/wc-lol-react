'use client';

import { useQuery } from '@tanstack/react-query';
import { groupMembersQueryKey } from '@/queries/groupMembersQueryKey';
import { getGroupMembers, GroupMember } from '@/apis/groupMembers';

export default function Home() {
  const { data, error, isLoading } = useQuery<GroupMember[]>({
    queryKey: groupMembersQueryKey.getGroupMembers(1),
    queryFn: () => getGroupMembers(1),
    staleTime: 1000 * 60 * 60,
  });

  return <div></div>;
}
