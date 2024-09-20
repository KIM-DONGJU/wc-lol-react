import { supabase } from '@/lib/supabase';

import type { Position } from '@/interfaces/position';
import { type GroupMember } from './groupMembers';

interface MatchGroup {
  id: number;
  group_name: string;
  created_at: string;
  creator_id: string;
  is_fixed: boolean;
  win_members: number[];
  lose_members: number[];
}

export interface Match {
  id: number;
  group_id: number;
  created_at: string;
  wining_team_number: number;
  teams: Record<Position, GroupMember>[];
}

export const getMatchGroupsThreeDaysAgo = async () => {
  const threeDaysAgoUTC = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('match_groups')
    .select<'', MatchGroup>()
    .gte('created_at', threeDaysAgoUTC)
    .order('created_at', { ascending: false });

  return data || [];
};
