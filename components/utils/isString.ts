export function isString(str: string | null | undefined): boolean {
  // Check if the input is a string and not null or undefined
  if (typeof str === "string" && str.trim() !== "") {
    // Convert the input string to lowercase and compare it to "true"
    return str.trim().toLowerCase() === "true";
  }
  return false; // Return false for all other cases
}
