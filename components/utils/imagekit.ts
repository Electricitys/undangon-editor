import ImageKit from "imagekit";
import { CONSTANTS } from "../Constants";

export const imagekit = new ImageKit({
  publicKey: CONSTANTS.IMAGEKIT_PUBLIC_KEY,
  privateKey: CONSTANTS.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: CONSTANTS.IMAGEKIT_URL,
});
