import fs from "fs/promises";
import { constants } from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { UploadError } from "../config/errors.js";
import config from "../config/main.js";

const storage = multer.diskStorage({
  async destination(req, file, cb) {
    const userDir = `${config.storage.directory}/${req.params.user_id}/`;
    try {
      await fs.access(userDir, constants.W_OK | constants.R_OK);
    } catch (error) {
      try {
        await fs.mkdir(userDir, { recursive: true });
      } catch (error) {
        cb(error);
      }
    }
    cb(null, userDir);
  },
  filename(req, file, cb) {
    const uniqueId = uuidv4();
    const extension = config.storage.allowedFormats[file.mimetype];
    cb(null, `${uniqueId}.${extension}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (Object.keys(config.storage.allowedFormats).includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new UploadError("MIMETYPE", file.fieldname, file.originalname), false);
    }
  },
  limits: {
    files: config.storage.maxFiles,
    fileSize: config.storage.maxFileSizeMB * 1000000,
  },
});

export const handleFiles = upload.array(config.storage.fieldName);
