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
export const getMatchesByGroupId = async (matchGroupId: number | string) => {
  const { data } = await supabase
    .from('matches')
    .select<'', Match>()
    .eq('group_id', matchGroupId)
    .order('created_at', { ascending: true });

  return data || [];
};

interface CreateMatchParams {
  groupId: string | number;
  teams: Record<Position, GroupMember>[];
}
export const createMatch = async (params: CreateMatchParams) => {
  const { data, error } = await supabase
    .from('matches')
    .insert([
      {
        group_id: params.groupId,
        teams: params.teams,
      },
    ])
    .select<'', Match>();

  return data;
};

interface selectWinningTeamParams {
  matchId: number;
  teamNumber: number;
}
export const selectWinningTeam = async ({ matchId, teamNumber }: selectWinningTeamParams) => {
  const { data, error } = await supabase
    .from('matches')
    .update({ wining_team_number: teamNumber })
    .eq('id', matchId)
    .select<'', Match>();

  return data;
};

interface UpdateMatchTeamsParams {
  matchId: number;
  teams: Record<Position, GroupMember>[];
}
export const updateMatchTeams = async ({ matchId, teams }: UpdateMatchTeamsParams) => {
  const { data, error } = await supabase
    .from('matches')
    .update({ teams })
    .eq('id', matchId)
    .select<'', Match>();

  return data;
};

export const deleteMatch = async (matchId: number) => {
  const { data, error } = await supabase.from('matches').delete().eq('id', matchId);

  return data;
};
