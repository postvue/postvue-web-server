// 홈 페이지
export const TASTE_FOR_ME_TAB_NAME = '추천';
export const TASTE_FOR_ME_TAB_ID = 0;

export const FOLLOW_FOR_ME_TAB_NAME = '팔로잉';
export const FOLLOW_FOR_ME_TAB_ID = 1;

// 반응 팝업 페이지
export const POST_REACTION_COMMENT_NAME = '댓글';
export const POST_REACTION_COMMENT_ID = 1;

// export const POST_REACTION_REPOST_NAME = '리포스트';
// export const POST_REACTION_REPOST_ID = 2;

export const POST_REACTION_LIKE_NAME = '좋아요';
export const POST_REACTION_LIKE_ID = 3;

// 검색 결과 페이지
export type SearchPostFilterTabType = 'popular' | 'live' | 'near';

export const SEARCH_POST_POPULAR_FILTER_NAME = '인기';
export const SEARCH_POST_POPULAR_FILTER_ID = 1;
export const SEARCH_POST_POPULAR_QUERY_PARAM: SearchPostFilterTabType =
  'popular';

export const SEARCH_POST_LASTEST_FILTER_NAME = '최신';
export const SEARCH_POST_LASTEST_FILTER_ID = 2;
export const SEARCH_POST_LASTEST_QUERY_PARAM: SearchPostFilterTabType = 'live';

export const SEARCH_POST_MY_NEAR_FILTER_NAME = '내 주변';
export const SEARCH_POST_MY_NEAR_FILTER_ID = 3;
export const SEARCH_POST_MY_NEAR_QUERY_PARAM: SearchPostFilterTabType = 'near';

// 내 프로필 팔로우 페이지
export const PROFILE_FOLLOWING_NAME = '팔로잉';
export const PROFILE_FOLLOWING_TAB_PARAM = 'following';

export const PROFILE_FOLLOWER_NAME = '팔로워';
export const PROFILE_FOLLOWER_TAB_PARAM = 'follower';

// 내 계정 설정 페이지
export const ACCOUNT_SETTING_PROFILE_EDIT_TAB_NAME = '프로필 수정';
export const ACCOUNT_SETTING_PROFILE_MANAGE_TAB_NAME = '계정 관리';
export const ACCOUNT_SETTING_PRIVACY_SAFETY_TAB_NAME = '개인정보 보호';
export const ACCOUNT_SETTING_PROFILE_NOTIFICATIONS_TAB_NAME = '알림 설정';
export const ACCOUNT_SETTING_PRIVACY_POLICY_TAB_NAME = '개인정보보호방침';
export const ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_TAB_NAME =
  '위치정보 이용약관';
export const ACCOUNT_SETTING_TERMS_OF_SERVICE_TAB_NAME = '서비스 이용약관';
export const ACCOUNT_SETTING_HELP_CENTER_TAB_NAME = '도움말 센터';
export const ACCOUNT_SETTING_CONTACT_TAB_NAME = '문의하기';
export const ACCOUNT_SETTING_CONPANY_INFO_TAB_NAME = '서비스 정보';

export const ACCOUNT_SETTING_PRIVACY_POLICY_URL =
  'https://feelog.notion.site/1a659320aaac80ee8ff5e1b2597c7727';
export const ACCOUNT_SETTING_TERMS_OF_SERVICE_URL =
  'https://feelog.notion.site/1a659320aaac80d298b1f259e45b6862';

export const ACCOUNT_SETTING_TERMS_OF_USER_GEOLOATION_URL =
  'https://feelog.notion.site/1a659320aaac8044959ff7dc0de93fca';

export const ACCOUNT_SETTING_COMPANY_INFO_URL =
  'https://feelog.notion.site/1a659320aaac8040b96ae44f3639c06f';

//www.notion.so/feelog/1a659320aaac8040b96ae44f3639c06f

// 내 계정 설정 페이지, 계정 관리
export const ACCOUNT_SETTING_EMAIL_EDIT_TAB_NAME = '이메일';
export const ACCOUNT_SETTING_BIRTHDATE_EDIT_TAB_NAME = '생년월일';
export const ACCOUNT_SETTING_GENDER_EDIT_TAB_NAME = '성별';
export const ACCOUNT_SETTING_PASSWORD_EDIT_TAB_NAME = '비밀번호';
export const ACCOUNT_SETTING_DELETE_ACCOUNT_TAB_NAME = '계정 삭제';

// 내 계정 설정 페이지, 개인정보
export const ACCOUNT_SETTING_PRIVATE_PROFILE_TAB_NAME = '비공개 프로필';
export const ACCOUNT_SETTING_PROFILE_BLOCK_LIST_TAB_NAME = '차단 관리';

// 새 게시물 작성 페이지
export const POST_COMPOSE_LOCATION_TAB_NAME = '위치';
export const POST_COMPOSE__TARGET_AUDIENCE_TAB_NAME = '공개 대상';
export const POST_COMPOSE__SCRAP_SELECT_TAB_NAME = '스크랩';

// 새 게시물 작성 페이지, 공개 여부
export const POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_NAME = '모든 공개';
export const POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID = 0;
export const POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_NAME = '팔로우 공개';
export const POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_ID = 1;
export const POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_NAME = '비공개';
export const POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_ID = 2;

// 로그인 페이지
export const KAKAO_LOGIN_TITLE_NAME = '카카오로 로그인';
export const NAVER_LOGIN_TITLE_NAME = '네이버로 로그인';
export const GOOGLE_LOGIN_TITLE_NAME = 'Google로 로그인';
export const APPLE_LOGIN_TITLE_NAME = 'Apple로 로그인';

// 메시지 페이지
export const MSG_BLOCK_LIST_TAB_NAME = '차단 목록';
export const MSG_HIDDEN_LIST_TAB_NAME = '숨긴 목록';

// 지도 페이지
export type MapExploreTabType =
  | 'all'
  | 'good_places'
  | 'cafes'
  | 'attractions'
  | 'parks'
  | 'daily';

export const MAP_EXPLORE_ALL_TAB_NAME = '전체';
export const MAP_EXPLORE_ALL_TAB_ID = 1;
export const MAP_EXPLORE_ALL_TAB_PARAM: MapExploreTabType = 'all';

export const MAP_EXPLORE_GOOD_FOOE_PLACE_TAB_NAME = '맛집';
export const MAP_EXPLORE_GOOD_FOOE_PLACE_TAB_ID = 2;
export const MAP_EXPLORE_GOOD_FOOE_PLACE_TAB_PARAM: MapExploreTabType =
  'good_places';

export const MAP_EXPLORE_CAFE_TAB_NAME = '카페';
export const MAP_EXPLORE_CAFE_TAB_ID = 3;
export const MAP_EXPLORE_CAFE_TAB_PARAM: MapExploreTabType = 'cafes';

export const MAP_EXPLORE_ATTRACTION_TAB_NAME = '볼거리';
export const MAP_EXPLORE_ATTRACTION_TAB_ID = 4;
export const MAP_EXPLORE_ATTRACTION_TAB_PARAM: MapExploreTabType =
  'attractions';

export const MAP_EXPLORE_PARK_TAB_NAME = '공원';
export const MAP_EXPLORE_PARK_TAB_ID = 5;
export const MAP_EXPLORE_PARK_TAB_PARAM: MapExploreTabType = 'parks';

export const MAP_EXPLORE_DAILY_TAB_NAME = '일상';
export const MAP_EXPLORE_DAILY_TAB_ID = 6;
export const MAP_EXPLORE_DAILY_TAB_PARAM: MapExploreTabType = 'daily';

export const MAP_EXPLORE_SEARCH_TASTE_TAB_NAME = '추천';
export const MAP_EXPLORE_SEARCH_RECOMM_TAB_ID = 1;

export const MAP_EXPLORE_SEARCH_POST_TAB_NAME = '게시물';
export const MAP_EXPLORE_SEARCH_POST_TAB_ID = 2;

export const MAP_EXPLORE_SEARCH_LOCATION_TAB_NAME = '위치';
export const MAP_EXPLORE_SEARCH_LOCATION_TAB_ID = 3;

// 홈 페이지
export const PROFILE_CLIP_TAB_NAME = '저장';
export const PROFILE_CLIP_TAB_ID = 0;

export const PROFILE_SCRAP_TAB_NAME = '스크랩';
export const PROFILE_SCRAP_TAB_ID = 1;
