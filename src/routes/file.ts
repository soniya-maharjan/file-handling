import { Request, Response, Router } from "express";
import { uploadFile } from "../middlewares/multer";

const fileRoutes = Router();

fileRoutes.post(
  "/",
  uploadFile.single("image"),
  (req: Request, res: Response) => {
    try {
      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        path: req.file?.path,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default fileRoutes;
