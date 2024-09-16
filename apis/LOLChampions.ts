import { supabase } from '@/lib/supabase';

import { Position } from '@/interfaces/position';

export interface LOLChampion {
  key: number;
  id: string;
  name: string
  image_url: string;
  position: Position[]
}

export const getLOLChampions = async () => {
  const { data } = await supabase.from('LOL_champions').select<'', LOLChampion>();

  return data || [];
};
