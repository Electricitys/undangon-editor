export function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    window.navigator.maxTouchPoints > 0 ||
    (window.navigator as any).msMaxTouchPoints > 0
  );
}
