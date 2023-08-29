export const fromEntries = (pairs: any[]) => {
  if (Object.fromEntries) {
    return Object.fromEntries(pairs);
  }
  return pairs.reduce(
    (accum: any, [id, value]: any) => ({
      ...accum,
      [id]: value,
    }),
    {}
  );
};
