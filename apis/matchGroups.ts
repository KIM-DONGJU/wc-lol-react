import { ONE_DAY } from '@/constants/date';
import { supabase } from '@/lib/supabase';

export interface MatchGroup {
  id: number;
  group_name: string;
  created_at: string;
  creator_id: string;
  is_fixed: boolean;
  win_members: number[];
  lose_members: number[];
}

export const getMatchGroupsThreeDaysAgo = async () => {
  const threeDaysAgoUTC = new Date(Date.now() - 3 * ONE_DAY).toISOString();

  const { data } = await supabase
    .from('match_groups')
    .select<'', MatchGroup>()
    .gte('created_at', threeDaysAgoUTC)
    .order('created_at', { ascending: false });

  return data || [];
};

interface CreateMatchGroupParams {
  creatorId: string;
  groupName: string;
}

export const createMatchGroup = async ({ creatorId, groupName }: CreateMatchGroupParams) => {
  const { data, error } = await supabase
    .from('match_groups')
    .insert([
      {
        creator_id: creatorId,
        group_name: groupName,
      },
    ])
    .select<'', MatchGroup>();

  return data;
};

interface FixedMatchGroupParams {
  groupId: number;
  winnerGroupMemberIds: number[];
  loserGroupMemberIds: number[];
}
export const fixedMatchGroup = async ({
  groupId,
  winnerGroupMemberIds,
  loserGroupMemberIds,
}: FixedMatchGroupParams) => {
  const { data } = await supabase
    .from('match_groups')
    .update({
      win_members: winnerGroupMemberIds,
      lose_members: loserGroupMemberIds,
      is_fixed: true,
    })
    .eq('id', groupId)
    .select<'', MatchGroup>();

  return data;
};
