export function isEmptyObject<T extends Record<string, any>>(obj: T): boolean {
  try {
    return Object.values(obj).every(
      (value) =>
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0),
    );
  } catch (e) {
    return true;
  }
}
