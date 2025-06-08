export const keysResolvers = {
  Query: {
    keys: async (
      _: any,
      {
        keys,
      }: {
        keys: string[];
      },
    ) => {
      return 'ok';
    },
  },
};
