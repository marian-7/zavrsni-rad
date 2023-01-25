import { Image } from "domain/types/Image";
import { get } from "lodash";

export enum ImageFormat {
  Thumbnail = "thumbnail",
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export function getImage(image: Image, format: string) {
  const formattedImage = get(image, `formats[${format}].url`);
  if (!formattedImage) {
    return image.url;
  }
  return formattedImage;
}
