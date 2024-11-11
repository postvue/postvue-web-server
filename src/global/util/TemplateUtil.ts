export const convertQueryTemplate = (
  stateName: string,
  stateValue: string,
): string => {
  return stateName + '_' + stateValue;
};
