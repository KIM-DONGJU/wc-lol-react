import { supabase } from '@/lib/supabase';

export type Position = 'top' | 'mid' | 'sup' | 'jungle' | 'adc';

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
  most_champions_main: string[];
  most_champions_sub: string[] | null;
}

export const getGroupMembers = async (groupId: number) => {
  const { data } = await supabase
    .from('groupmembers')
    .select<'', GroupMember>()
    .eq('groupId', groupId);

  console.log(data, '----');

  return JSON.parse(JSON.stringify(data ?? []));
};
