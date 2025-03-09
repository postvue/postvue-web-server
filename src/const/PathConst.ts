import { INFO_PATH } from 'services/appApiPath';

export const INVALID_URL = '-&%@_';

export const POST_LIST_PATH = '/posts';

export const HOME_PATH = '/';
export const SEARCH_PATH = '/search';
export const MESSAGE_PATH = '/messages';
export const CONVERSTAION_PATH = '/conversation';
export const MESSAGE_INBOX_CONVERSATION_ROUTE_PATH = `${MESSAGE_PATH}${CONVERSTAION_PATH}/inbox`;
export const MESSAGE_INBOX_PATH = `${MESSAGE_PATH}/inbox`;
export const MESSAGE_CONVERSTAION_PATH = `${MESSAGE_PATH}/:user_id${CONVERSTAION_PATH}`;
export const EXPLORE_PATH = '/explores';

export const EDIT_PATH = '/edit';

export const PROFILE_LIST_PATH = '/profiles';

export const SCRAP_LIST_PATH = '/scraps';

// 알림 페이지
export const NOTIFICATION_LIST_PATH = '/notifications';

export const PROFILE_PATH = '/:user_id';
export const PROFILE_POST_LIST_PATH = `${PROFILE_PATH}/p/:post_id`;
export const PROFILE_POST_EDIT_PATH = `${EDIT_PATH}/:post_id`;
export const FOLLOW_FOR_ME_PATH = '/follow_for_me';
export const TAG_SEARCH_PATH = '/tagged';
export const TAG_LIST_PATH = '/tags';

export const SEARCH_POST_PATH = `${SEARCH_PATH}${POST_LIST_PATH}`;
export const SEARCH_PROFILE_PATH = `${SEARCH_PATH}${PROFILE_LIST_PATH}`;
export const SEARCH_SCRAP_PATH = `${SEARCH_PATH}${SCRAP_LIST_PATH}`;
export const SEARCH_POST_ROUTE_PATH = `${SEARCH_POST_PATH}/:search_word`;
export const SEARCH_PROFILE_ROUTE_PATH = `${SEARCH_PROFILE_PATH}/:search_word`;
export const SEARCH_SCRAP_ROUTE_PATH = `${SEARCH_SCRAP_PATH}/:search_word`;
export const SEARCH_TAG_POST_PATH = `${SEARCH_PATH}${TAG_LIST_PATH}${POST_LIST_PATH}`;
export const SEARCH_TAG_POST_ROUTE_PATH = `${SEARCH_TAG_POST_PATH}/:search_word`;

export const FOLLOW_LIST_PATH = '/follows';
export const PROFILE_SCRAP_LIST_PATH = `${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}`;
export const PROFILE_CLIP_LIST_PATH = `${PROFILE_LIST_PATH}/clipes`;
export const PROFILE_SCRAP_PATH = `${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}/:scrap_id`;
export const PROFILE_FOLLOW_LIST_PATH = `${PROFILE_LIST_PATH}/:username${FOLLOW_LIST_PATH}`;

// 내 계정 설정 페이지
export const PROFILE_SETTING_PATH = `${PROFILE_LIST_PATH}/settings`;
export const PROFILE_EDIT_PATH = `${PROFILE_SETTING_PATH}${EDIT_PATH}`;
export const PROFILE_MANAGE_PATH = `${PROFILE_SETTING_PATH}/manage`;
export const PROFILE_PRIVACY_POLICY_PATH = `${PROFILE_SETTING_PATH}/privacy`;
export const PROFILE_EMAIL_EDIT_PATH = `${PROFILE_SETTING_PATH}${EDIT_PATH}/email`;
export const PROFILE_BIRTHDATE_EDIT_PATH = `${PROFILE_SETTING_PATH}${EDIT_PATH}/birthdate`;
export const PROFILE_GENDER_EDIT_PATH = `${PROFILE_SETTING_PATH}${EDIT_PATH}/gender`;
export const PROFILE_PASSWORD_EDIT_PATH = `${PROFILE_SETTING_PATH}${EDIT_PATH}/password`;
export const PROFILE_DELETE_ACCOUNT_PATH = `${PROFILE_SETTING_PATH}/delete/account`;
export const PROFILE_PRIVATE_PROFILE_PATH = `${PROFILE_SETTING_PATH}/private-profile`;
export const PROFILE_PRIVATE_HELP_CENTER_PATH = `${PROFILE_SETTING_PATH}/help`;
export const PROFILE_PRIVATE_HELP_CENTER_INFO_ROUTE_PATH = `${PROFILE_PRIVATE_HELP_CENTER_PATH}${INFO_PATH}`;
export const PROFILE_BLOCKED_ACCOUNT_PATH = `${PROFILE_SETTING_PATH}/blocked-accounts`;
export const PROFILE_ACCOUNT_ROUTE_PATH = `${PROFILE_LIST_PATH}/:username`;
export const PROFILE_MY_ACCOUNT_ROUTE_PATH = `${PROFILE_LIST_PATH}/my/page`;
export const PROFILE_NEW_SCRAP_PATH = '/new/scrap';
export const PROFILE_EDIT_SCRAP_PATH = '/edit/scrap';
export const PROFILE_EDIT_SCRAP_ROUTE_PATH = `${PROFILE_EDIT_SCRAP_PATH}/:scrapId`;

export const MANAGE_PATH = '/manages';
export const BLOCK_LIST = '/blocks';
export const MSG_BLOCK_LIST_MANAGE_PATH = `${MESSAGE_PATH}${MANAGE_PATH}${BLOCK_LIST}`;
export const MSG_HIDDEN_LIST_MANAGE_PATH = `${MESSAGE_PATH}${MANAGE_PATH}/hiddens`;

export const POST_COMPOSE_PATH = '/compose/post';
export const POST_VIDEO_COMPOSE_PATH = '/compose/video/post';
export const POST_COMPOSE_SOURCE_URL_PATH = '/compose/post/source-url';

export const SEARCH_FAVORITE_LIST_PATH = `${SEARCH_PATH}-favorites`;

// 로그인
export const LOGIN_PATH = `/login`;

//회원가입
export const SIGNUP_PATH = '/signup';
export const VERIFY_EMAIL_PATH = '/verify/email';
