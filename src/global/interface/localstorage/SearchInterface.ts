export interface SearchRecentKeywordInterface {
  name: string;
  searchWordType: string;
  isExposed: boolean;
}

export interface MapSearchRecentKeywordInterface {
  name: string;
  searchWordType: string;
  isExposed: boolean;
  isLocation: boolean;
  latitude: number;
  longitude: number;
  roadAddr: string;
}
