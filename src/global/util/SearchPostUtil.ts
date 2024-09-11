const query_join_string = '_';

export const encodeSearhWordAndFilterKey = (
  searchWordText: string,
  filterQueryParam: string,
): string => {
  return searchWordText
    ? filterQueryParam
      ? searchWordText + query_join_string + filterQueryParam
      : searchWordText
    : '';
};

export const decodeSearhWordAndFilterKey = (
  searchWordAndFilterKey: string,
): string[] => {
  return searchWordAndFilterKey.split(query_join_string);
};

export const isValidSearchWordAndFilterKey = (
  searchWordAndFilterKey: string,
): boolean => {
  const regex = /^.+_.+$/;
  return regex.test(searchWordAndFilterKey);
};
