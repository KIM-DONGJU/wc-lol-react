import type { Position } from '@/interfaces/position';
import { type GroupMember } from './groupMembers';
import { supabase } from '@/lib/supabase';

export interface Match {
  id: number;
  group_id: number;
  created_at: string;
  wining_team_number: number | null;
  teams: Record<Position, GroupMember>[];
}

// matchGroupId로 supabase db도 변경할 예정
export const getMatchesByGroupId = async (matchGroupId: number) => {
  const { data } = await supabase
    .from('matches')
    .select<'', Match>()
    .eq('group_id', matchGroupId)
    .order('created_at', { ascending: false });

  return data || [];
};
