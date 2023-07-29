import { CONSTANTS } from "../Constants";

export const ParseImageUrl = (id: any, params: any) => {
  const query = new URLSearchParams({
    ...params,
    o: 1,
  });
  return `${CONSTANTS.SERVER_URL}/api/assets/image/${id}?${query.toString()}`;
};
