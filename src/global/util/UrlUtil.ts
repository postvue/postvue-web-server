export function getOriginFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.origin; // 'https://example.com'
  } catch (error) {
    return url;
  }
}
