import { Position } from '@/interfaces/position';
import { supabase } from '@/lib/supabase';

export interface User {
  name: string;
  nickname: string;
  point: number;
  position: Position;
}

interface PositionScore {
  top: number;
  mid: number;
  sup: number;
  jungle: number;
  adc: number;
}

export interface GroupMember {
  groupId: number;
  id: number;
  joinedAt: string;
  name: string;
  nickname: string;
  mainPosition: Position;
  subPosition: Position | null;
  userId: string | null;
  positionScore: PositionScore;
  role: 'member' | 'admin';
  most_champions_main: string[] | null;
  most_champions_sub: string[] | null;
  most_champions: string[] | null;
}

export const getGroupMembers = async (groupId: number) => {
  const { data } = await supabase
    .from('groupmembers')
    .select<'', GroupMember>()
    .eq('groupId', groupId);

  return data || [];
};
