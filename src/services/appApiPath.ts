export const POST_LIST_PATH = '/posts';
export const TASTE_FOR_ME_PATH = '/taste_for_me';
export const NEAR_FOR_ME_API_PATH = `${POST_LIST_PATH}/near_for_me`;
export const LIKE_PATH = '/like';
export const CLIP_PATH = '/clip';
export const COMMENT_LIST_PATH = '/comments';
export const REPOST_LIST_PATH = '/reposts';
export const LIKE_LIST_PATH = '/likes';
export const SEARCH_PATH = '/search';
export const MESSAGE_PATH = '/messages';
export const MSG_INBOX_PATH = '/inbox';
export const MSG_CONVERSATION_LIST_PATH = '/conversations';
export const MSG_DIREACT_CONVERSATION_API_PATH = `${MESSAGE_PATH}/direct-message`;
export const MSG_CONVERATION_INBOX_LIST_API_PATH = `${MESSAGE_PATH}${MSG_INBOX_PATH}/conversations`;
export const BLOCK_LIST_PATH = '/blocks';
export const MSG_UNBLOCK_USER_LIST_PATH = '/unblocks';
export const MSG_HIDDEN_USER_LIST_PATH = '/hiddens';
export const MSG_UNHIDDEN_USER_LIST_PATH = '/unhiddens';
export const PROFILE_LIST_PATH = '/profiles';
export const FOLLOW_PATH = '/follows';
export const FOLLOWING_PATH = '/followings';
export const FOLLOWER_PATH = '/followers';
export const MY_PATH = '/me';
export const INFO_PATH = '/info';
export const SCRAP_LIST_PATH = '/scraps';
export const CLIP_LIST_PATH = '/clips';
export const RECOMM_PATH = '/recomm';
export const PREVIEW_LIST_PATH = '/previews';
export const RELATION_PATH = '/relations';
export const INTERESTED = '/interested';
export const NOT_INTERESTED = `/not${INTERESTED}`;
export const REPLY_LIST_PATH = '/replies';
export const TAG_LIST_PATH = '/tags';
export const FAVORITE_PATH = '/favorite';
export const TERM_LIST_PATH = '/terms';
export const POPULAR_PATH = '/popular';
export const NEAR_PATH = '/near';
export const LIVE_PATH = '/live';
export const DOCUMENT_RESOURCE_LIST = '/resources/documents';
export const DOC_IMAGE_RESOURCE_LIST = `${DOCUMENT_RESOURCE_LIST}/images`;
export const POST_UPLOAD_RESOURCE_LINK = '/resource-link';
export const EXISTENCE_API_PATH = '/existence';

// 포스트
export const POST_MAP_POST_API_PATH = `${POST_LIST_PATH}/map_posts`;

// 로그인
export const AUTH_APTH = '/auth';
export const AUTH_RENEWAL_TOKEN_API_PATH = `${AUTH_APTH}/renewal/tokens`;
export const KAKAO_LOGIN_API_PATH = `${AUTH_APTH}/login/kakao`;
export const NAVER_LOGIN_API_PATH = `${AUTH_APTH}/login/naver`;
export const APPLE_LOGIN_API_PATH = `${AUTH_APTH}/login/apple`;
export const GOOGLE_LOGIN_API_PATH = `${AUTH_APTH}/login/google`;
export const EMAIL_LOGIN_API_PATH = `${AUTH_APTH}/login/email`;
export const AUTH_MEMBER_WITHDRAWAL_API_PATH = `${AUTH_APTH}/member-withdrawal`;
export const AUTH_CHECK_SIGNUP_QUAL_API_PATH = `${AUTH_APTH}/check/signup/qual`;
export const SIGNUP_TYPE_API_PATH = `${AUTH_APTH}/signup/type`;

// 회원 가입
export const PROFILE_EXISTENCE_API_PATH = `${PROFILE_LIST_PATH}${EXISTENCE_API_PATH}`;
export const PROFILE_EXISTENCE_EMAIL_API_PATH = `${PROFILE_LIST_PATH}${EXISTENCE_API_PATH}/emails`;
export const SIGNUP_API_PATH = `${AUTH_APTH}/signup`;
export const LOGOUT_API_PATH = `${AUTH_APTH}/logout`;
export const SIGNUP_EMAIL_API_PATH = `${AUTH_APTH}/signup/email`;
export const SIGNUP_VERIFY_EMAIL_API_PATH = `${AUTH_APTH}/verify/signup/email`;

//설정
export const PROFILE_EMAIL_EDIT_API_PATH = `${PROFILE_LIST_PATH}${MY_PATH}${INFO_PATH}/email`;
export const PROFILE_BIRTHDATE_EDIT_API_PATH = `${PROFILE_LIST_PATH}${MY_PATH}${INFO_PATH}/birthdate`;
export const PROFILE_GENDER_EDIT_API_PATH = `${PROFILE_LIST_PATH}${MY_PATH}${INFO_PATH}/gender`;
export const PROFILE_PASSWORD_EDIT_API_PATH = `${PROFILE_LIST_PATH}${MY_PATH}${INFO_PATH}/password`;
export const PROFILE_PRIVATE_PROFILE_API_PATH = `${PROFILE_LIST_PATH}${MY_PATH}${INFO_PATH}/private-profile`;
export const PROFILE_PROFILE_BLOCKED_USER_LIST_API_PATH = `${PROFILE_LIST_PATH}/blocked-users`;

// 알림
export const NOTIFICATION_API_PATH = `/notifications`;
export const NOTIFICATION_MSG_LIST_API_PATH = `${NOTIFICATION_API_PATH}/messages`;

// 지도
export const MAP_API_PATH = '/maps';

export const MAP_ADDRESS_PATH = `${MAP_API_PATH}/addresses`;
export const MAP_ADDRESS_UNIQUENESS_PATH = `${MAP_ADDRESS_PATH}/uniqueness`;

export const MAP_LOCATION_PATH = `${MAP_API_PATH}/location`;

export const MAP_ADDRESS_REPLATION_PATH = `${MAP_API_PATH}/addresses/relations`;

export const MAP_LOCAL_SEARCH_PATH = `${MAP_API_PATH}${SEARCH_PATH}/local`;

export const MAP_POST_SEARCH_PATH = `${MAP_API_PATH}${SEARCH_PATH}/post`;

export const MAP_RECOMM_SEARCH_PATH = `${MAP_API_PATH}${SEARCH_PATH}/recomm`;

export const MAP_MY_POST_PATH = `${MAP_API_PATH}/posts/me`;

// 공유
export const PROFILE_SEARCH_USERS_API_PATH = `/profiles${SEARCH_PATH}/users`;

// 포스트 게시
export const POST_COMPOSE = '/compose';

//
export const REPORT_PATH = '/report';

//
export const EDIT_API_PATH = '/edit';
