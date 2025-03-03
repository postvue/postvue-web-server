export const MAX_POST_TITLE_NUM = 50;
export const MAX_POST_BODY_TEXT_NUM = 700;

export type POST_RELATION_SEARCH_TYPE = 'recomm' | 'live' | 'distance';

export function isPostRelationSearchType(
  value: string,
): value is POST_RELATION_SEARCH_TYPE {
  return ['recomm', 'live', 'distance'].includes(value);
}
