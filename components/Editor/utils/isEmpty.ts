export function isEmpty(value: any): boolean {
  if (value === undefined) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length === 0;
  }

  return false;
}