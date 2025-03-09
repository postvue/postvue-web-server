import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QUERY_STATE_SEARCH_TERM_INFO } from 'const/QueryClientConst';
import { GetSearchTermRsp } from 'global/interface/search';
import { isValidString } from 'global/util/ValidUtil';
import { getSearchTermInfo } from 'services/search/getSearchTermInfo';

export const QueryStateSearchTermInfo = (
  searchTerm: string,
): UseQueryResult<GetSearchTermRsp, AxiosError<unknown, any>> => {
  return useQuery<GetSearchTermRsp, AxiosError>({
    queryKey: [QUERY_STATE_SEARCH_TERM_INFO, searchTerm],
    queryFn: () => getSearchTermInfo(searchTerm),
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    enabled: isValidString(searchTerm),
  });
};
