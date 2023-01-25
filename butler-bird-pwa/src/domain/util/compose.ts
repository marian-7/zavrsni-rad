export const compose = (...fns: { (arg: any): any }[]) => async (arg: any) => {
  const results = await Promise.all(fns.map((f: (arg0: any) => any) => f(arg)));
  return results.reduce((obj, result) => {
    return { ...obj, ...result };
  }, {});
};
