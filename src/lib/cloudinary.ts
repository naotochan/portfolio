const CLOUD_NAME = "dpldgd02u";

/**
 * Cloudinary の画像URLを生成
 * @param publicId - Cloudinary にアップした画像の Public ID (例: "portfolio/photo-1")
 * @param options - 幅、高さ、フォーマットなどの変換オプション
 */
export function cloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number | "auto";
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
    crop?: "fill" | "fit" | "scale" | "thumb";
    gravity?: "auto" | "center" | "face";
  }
): string {
  const transforms: string[] = [];

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);
  if (options?.gravity) transforms.push(`g_${options.gravity}`);
  if (options?.quality) transforms.push(`q_${options.quality}`);
  if (options?.format) transforms.push(`f_${options.format}`);

  // デフォルトで自動フォーマット・自動品質
  if (!options?.format) transforms.push("f_auto");
  if (!options?.quality) transforms.push("q_auto");

  const transformStr = transforms.length > 0 ? transforms.join(",") + "/" : "";

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}${publicId}`;
}
