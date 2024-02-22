export const transformMessage = (raw: string, opt: { [key: string]: string }) => {
  let text = raw;
  let data: any = {
    to: "",
    url: "",
    ...opt,
  };

  for (let key in data) {
    text = text.replace(`{{${key}}}`, data[key]);
  }

  return { text, keys: Object.keys(data) };
};
