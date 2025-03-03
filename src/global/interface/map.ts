export interface MapAddressByGeoRsp {
  address: string;
  buildName: string;
  zipcode: string;
  latitude: number;
  longitude: number;
}

export interface MapLocationRsp {
  address: string;
  latitude: number;
  longitude: number;
}

export interface MapAddressRelation {
  roadAddr: string;
  buildName: string;
  latitude: number;
  longitude: number;
}

export interface MapLocalSrchRsp {
  roadAddr: string;
  hasLocation: boolean;
  placeName: string;
  latitude: number;
  longitude: number;
}

export interface MapPostSrchRsp {
  searchQueryName: string;
}

export interface MapRecommSrchRsp {
  isPlace: boolean;
  roadAddr: string;
  placeName: string;
  hasLocation: boolean;
  latitude: number;
  longitude: number;
  searchQueryName: string;
}
