import { supabase } from '@/lib/supabase';

export const signInWithOauth = async (provider: 'google' | 'discord') => {
  const redirectTo =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://wc-lol.com';

  const { data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });
  return data;
};

export const getUser = async () => {
  const { data } = await supabase.auth.getUser();

  return data;
};
