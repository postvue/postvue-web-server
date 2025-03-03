import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QUERY_STATE_RECOMM_TAG_LIST } from 'const/QueryClientConst';
import { RecommTagInfo } from 'global/interface/recomm';
import { getRecommTagList } from 'services/recomm/getRecommTagList';

export const QueryStateRecommTagList = (): UseQueryResult<
  RecommTagInfo[],
  AxiosError<unknown, any>
> => {
  return useQuery<RecommTagInfo[], AxiosError>({
    queryKey: [QUERY_STATE_RECOMM_TAG_LIST],
    queryFn: () => getRecommTagList(),
    // refetchOnMount: 'always',
    // refetchOnWindowFocus: 'always',
  });
};
