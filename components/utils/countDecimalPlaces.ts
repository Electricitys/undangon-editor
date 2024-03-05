export function countDecimalPlaces(number: number): number {
  // Convert the number to a string
  let numStr: string = number.toString();

  // Use a regular expression to find the decimal places
  let decimalIndex: number = numStr.indexOf(".");

  // If there are no decimal places, return 0
  if (decimalIndex === -1) {
    return 0;
  } else {
    // Return the number of characters after the decimal point
    return numStr.length - decimalIndex - 1;
  }
}
