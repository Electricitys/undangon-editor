export function generateId(len = 8) {
  const rand = Math.random().toString(36);
  const length = Math.round(len / 2);
  return `${rand.substr(2, length)}_${rand.substr(4, length)}`;
}
