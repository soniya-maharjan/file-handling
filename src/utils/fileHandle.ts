import path from "path";
import fs from "fs";
import sharp from "sharp";

export const processImageForBrand = async (
  tempImagePath: string,
  resize: string,
  type: string
) => {
  const resizeFlag = resize === "true";
  const filename = path.basename(tempImagePath, path.extname(tempImagePath)); // Get the base filename
  const uploadDir = path.join("./uploads", type || "");
  const resizedImagePath = path.join(uploadDir, `${filename}_md.webp`);
  const originalImagePath = path.join(uploadDir, `${filename}.webp`);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  sharp.cache(false);

  if (resizeFlag) {
    await sharp(tempImagePath)
      .resize({ width: 500 })
      .toFormat("webp")
      .toFile(resizedImagePath);
  }

  await sharp(tempImagePath).toFormat("webp").toFile(originalImagePath);

  // Clean up the temp file
  fs.unlinkSync(tempImagePath);

  return resize === "true" ? resizedImagePath : originalImagePath;
};

export const revertFolder = async (
  tempImagePath: string,
  resize: string,
  type: string
) => {
  const resizeFlag = resize === "true";
  const filename = path.basename(tempImagePath, path.extname(tempImagePath));
  const ext = path.extname(tempImagePath);

  // If the image was resized, delete the resized version
  if (resizeFlag) {
    fs.unlinkSync(path.join("uploads", type, `${filename}_md.webp`));
  }

  // Convert the .webp image back to its original format (from webp to the original format)
  await sharp(path.join("uploads", type, `${filename}.webp`))
    .toFormat(
      ext.slice(1) as keyof sharp.FormatEnum | sharp.AvailableFormatInfo
    ) // Get the original extension without the dot
    .toFile(tempImagePath);

  // Remove the original .webp file
  if (fs.existsSync(path.join("uploads", type, `${filename}.webp`))) {
    fs.unlinkSync(path.join("uploads", type, `${filename}.webp`));
  }
};
