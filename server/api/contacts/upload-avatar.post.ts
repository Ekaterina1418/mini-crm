import formidable, { type Files } from "formidable";
import path from "path";
import { createError } from "h3";
import fs from "fs";
import { requireAuth } from "~/server/utils/requireAuth";

const MAX_FILE_SIZE = 100 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  let files: Files;
  try {
    const result = await new Promise<{ files: Files }>((resolve, reject) => {
      const form = formidable({
        multiples: false,
        maxFiles: 1,
        maxFileSize: MAX_FILE_SIZE,
        maxTotalFileSize: MAX_FILE_SIZE,
        uploadDir,
        keepExtensions: true,
      });
      form.parse(event.node.req, (error, _fields, parsedFiles) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ files: parsedFiles });
      });
    });
    files = result.files;
  } catch (error) {
    const httpCode =
      error && typeof error === "object" && "httpCode" in error
        ? Number(error.httpCode)
        : undefined;

    if (httpCode === 413) {
      throw createError({
        statusCode: 413,
        statusMessage: "File is too large",
        message: "Размер изображения не должен превышать 100 КБ",
      });
    }

    throw createError({
      statusCode: 400,
      statusMessage: "File upload failed",
      message: "Не удалось загрузить изображение",
    });
  }

  const avatarFile = files.avatar?.[0];

  if (!avatarFile) {
    throw createError({
      statusCode: 400,
      statusMessage: "No file uploaded",
      message: "Файл не выбран",
    });
  }

  const extension = path
    .extname(avatarFile.originalFilename ?? "")
    .toLowerCase();

  const hasAllowedMimeType =
    avatarFile.mimetype !== null &&
    ALLOWED_MIME_TYPES.has(avatarFile.mimetype);

  const hasAllowedExtension = ALLOWED_EXTENSIONS.has(extension);

  if (!hasAllowedMimeType || !hasAllowedExtension) {
    fs.rmSync(avatarFile.filepath, { force: true });

    throw createError({
      statusCode: 415,
      statusMessage: "Unsupported file type",
      message: "Разрешены только изображения JPEG, PNG и WebP",
    });
  }

  return {
    success: true,
    avatarUrl: `/uploads/${avatarFile.newFilename}`,
  };
});
