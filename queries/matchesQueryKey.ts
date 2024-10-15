export const matchesQueryKey = {
  getMatchesByGroupId: (groupId: number | string) => ['matches', { getMatchesByGroupId: groupId }],
  createMatch: () => ['matches', 'createMatch'],
};
