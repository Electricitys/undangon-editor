export function parseIntSafe(inputString: string): number | null {
  const parsedInteger = parseInt(inputString, 10); // The second argument (10) specifies base 10.

  if (!isNaN(parsedInteger)) {
    return parsedInteger;
  } else {
    return null; // Or you can return an error message if you prefer.
  }
}

export function parseIntSafeForInput(inputString: string, defaultValue: string): string {
  const parsedInteger = parseInt(inputString, 10);
  
  if (!isNaN(parsedInteger)) {
      return parsedInteger.toString();
  } else {
      return defaultValue;
  }
}