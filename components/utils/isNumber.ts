export function isNumber(value: any) {
  // If the value is already a number, or it can be parsed into a number, return true
  return (
    (typeof value === "number" && !isNaN(value)) ||
    (!isNaN(parseFloat(value)) && isFinite(value))
  );
}
