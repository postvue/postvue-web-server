export const getRoundedNumber = (num: number, factor = 1e9): number => {
  return Math.round(num * factor) / factor;
};
