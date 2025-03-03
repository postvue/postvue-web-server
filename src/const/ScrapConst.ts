import { TargetAudienceInterface } from '../global/interface/profile';

const PUBLIC_TARGET_AUDIENCE_VALUE: TargetAudienceInterface = {
  displayPhrase: '모든 사람',
  targetAudienceValue: 'PUBLIC_AUDIENCE',
};

const PRIVATE_TARGET_AUDIENCE_VALUE: TargetAudienceInterface = {
  displayPhrase: '비공개',
  targetAudienceValue: 'PRIVATE_AUDIENCE',
};

const PROTECTED_TARGET_AUDIENCE_VALUE: TargetAudienceInterface = {
  displayPhrase: '팔로우에게만',
  targetAudienceValue: 'PROTECTED_AUDIENCE',
};

export const TargetAudienceCategory = {
  PUBLIC_TARGET_AUDIENCE: PUBLIC_TARGET_AUDIENCE_VALUE,
  PROTECTED_TARGET_AUDIENCE: PROTECTED_TARGET_AUDIENCE_VALUE,
  PRIVATE_TARGET_AUDIENCE: PRIVATE_TARGET_AUDIENCE_VALUE,
};

export const targetAudienceList = [
  TargetAudienceCategory.PUBLIC_TARGET_AUDIENCE,
  TargetAudienceCategory.PROTECTED_TARGET_AUDIENCE,
  TargetAudienceCategory.PRIVATE_TARGET_AUDIENCE,
];
