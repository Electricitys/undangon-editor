export function autoAppendZero(input: string) {
  // Regular expression to find decimal numbers without a fractional part
  var regex = /(\d+\.\b)/g;
  
  // Replace decimal numbers without fractional part with ".0"
  var result = input.replace(regex, "$10");
  
  return result;
}