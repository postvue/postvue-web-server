export const MAP_EXPLORE_INIT_POSITION = 'map-init-position';
export const MAP_EXPLORE_INIT_POSITION_EMPTY_LIST = [];

export const MAP_EXPLORE_INIT_LATITUDE = 37.580103;
export const MAP_EXPLORE_INIT_LONGITUDE = 126.983113;

export const POPUP_FULL_SIZE_POSITION = 0;
export const POPUP_MIDDLE_SIZE_POSITION = 300;
export const POPUP_SMALL_SIZE_POSITION = 500;

export type MapContentType = 'POST_TYPE' | 'LOCATION_TYPE';
export const MAP_CONTENT_LOCATION_TYPE: MapContentType = 'LOCATION_TYPE';
export const MAP_CONTENT_POST_TYPE = 'POST_TYPE';

export const APPLE_MAP_ACCESS_TOKEN =
  process.env.REACT_APP_APPLE_MAPKIT_JS_ACCESS_TOKEN || '';

export type MapExplorePostPopupStateType = 'top' | 'middle' | 'bottom';

export const MAP_EXPLORE_POST_POPUP_TOP_STATE_TYPE: MapExplorePostPopupStateType =
  'top';

export const MAP_EXPLORE_POST_POPUP_MIDDLE_STATE_TYPE: MapExplorePostPopupStateType =
  'middle';

export const MAP_EXPLORE_POST_POPUP_BOTTOM_STATE_TYPE: MapExplorePostPopupStateType =
  'bottom';

export const APPLE_SEARCH_AUTO_COMPLETE_LIMIT_COURTRY_LIST =
  'AD, AE, AF, AG, AI, AL, AM, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BQ, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CW, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KP,  KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, SS, ST, SV, SX, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, YE, YT, ZA, ZM, ZW';

export const MAP_POSITION_ICON_PATH =
  '/assets/images/icon/svg/MapPositionIcon.svg';

export const MAPKIT_CLIENT_MANAGER_KEY = 'MAPKIT_CLIENT_MANAGER';

export const POS_CONTROL_GAP_NUM = 0.01;

export const MAX_NEAR_POST_REQUEST_NUM = 3;

export const MAPKIT_SELECT_ANNOTASTION_MOVE_LISTENER_EVENT =
  'SELECT_ANNOTATION_MOVE';

export const MAP_EXPLORE_IS_SHARE_PARAM = 'isShare';
export const MAP_EXPLORE_SEARCH_WORD_PARAM = 'searchWord';

export const MAP_EXPLORE_LATITUDE_PARAM = 'lat';
export const MAP_EXPLORE_LONGITUDE_PARAM = 'lon';
