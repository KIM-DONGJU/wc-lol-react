export const matchesQueryKey = {
  getMatchesByGroupId: (groupId: number) => ['matches', { getMatchesByGroupId: groupId }],
  createMatch: () => ['matches', 'createMatch'],
};
