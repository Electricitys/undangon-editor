export const htmlFormat = [
  { symbol: "*", open: "<b>", close: "</b>" },
  { symbol: "_", open: "<em>", close: "</em>" },
  { symbol: "~", open: "<del>", close: "</del>" },
];

export const transformMessagePreview = (raw: string) => {
  let text = raw;
  try {
    for (let { symbol, open, close } of htmlFormat) {
      if (!text) return text;

      const rx = `\\${symbol}([^\\${symbol}~]+)\\${symbol}`;
      const regex = new RegExp(rx, "g");
      const match = text.match(regex);

      if (!match) return text;

      match.forEach((m) => {
        let formatted = m;
        for (let i = 0; i < 2; i++) {
          formatted = formatted.replace(symbol, i > 0 ? close : open);
        }
        text = text.replace(m, formatted);
      });
    }
  } catch (err) {
    console.error(err);
  }
  return text;
};