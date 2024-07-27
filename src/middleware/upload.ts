import { Request, Response, NextFunction } from "express";
import util from "util";
import multer, { StorageEngine } from "multer";
import path from "path";

const maxSize = 2 * 1024 * 1024;

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../src/assets/uploads/")); 
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

const uploadFileMiddleware = util.promisify(uploadFile);

export default uploadFileMiddleware;
