export const PostReportType = {
  DISLIKE: 'DISLIKE',
  INACCURATE_LOCATION: 'INACCURATE_LOCATION',
  SPAM_OR_SCAM: 'SPAM_OR_SCAM',
  SENSITIVE_CONTENT: 'SENSITIVE_CONTENT',
  HARMFUL_OR_ABUSIVE: 'HARMFUL_OR_ABUSIVE',
  OTHER: 'OTHER',
} as const;
type PostReportType = (typeof PostReportType)[keyof typeof PostReportType];
