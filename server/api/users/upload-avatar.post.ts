import formidable, { Files, File } from "formidable";
import path from "path";
import fs from "fs";

export default defineEventHandler(async (event) => {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

 const { files } = await new Promise<{ files: Files }>((resolve, reject) => {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
    uploadDir,
  });

  form.parse(event.node.req, (err, _fields, files) => {
    if (err) reject(err);
    else resolve({ files });
  });
});

  const avatarFile = files.avatar?.[0];

  if (!avatarFile) {
    event.node.res.statusCode = 400;
    return { success: false, message: "No file uploaded" };
  }

  const avatarUrl = `/uploads/${avatarFile.newFilename}`;

  return { success: true, avatarUrl };
});
