export function parseNumber(str: any, defaultValue?: number) {
  const num = parseFloat(str);
  return isNaN(num) ? defaultValue || null : num;
}
