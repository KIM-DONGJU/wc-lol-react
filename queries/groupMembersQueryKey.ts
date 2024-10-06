export const groupMembersQueryKey = {
  getGroupMembers: (groupId: number) => ['groupMembers', { getGroupMembers: groupId }],
};
