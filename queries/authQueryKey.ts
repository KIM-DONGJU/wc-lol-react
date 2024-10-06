export const authQueryKey = {
  signInWithOauth: (provider: 'google' | 'discord') => [
    'auth',
    {
      signInWithOauth: provider,
    },
  ],
  getUser: () => ['auth', 'getUser'],
};
