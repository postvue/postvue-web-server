export interface SignupInfo {
  username: string;
  nickname: string;
  birthdate: string;
  gender: string;
  favoriteTagList: string[];
  termOfService: termOfServiceInterface;
}

export interface termOfServiceInterface {
  agreeToAgeTerm: boolean;
  agreeToServieTerm: boolean;
  agreeToPrivacyPolicy: boolean;
  agreeToPrivacyPolicyToThirdPaties: boolean;
  agreeToMarketingCommunications: boolean;
}
