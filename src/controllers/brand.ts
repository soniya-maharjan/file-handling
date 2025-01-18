import { Request, Response } from "express";
import BrandModel from "../models/brandModel";
import { IBrandResponse } from "../interfaces/brand";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { processImageForBrand, revertFolder } from "../utils/fileHandle";

export class BrandController {
  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { search = "", limit = 5, page = 1, sort = "asc" } = req.query;
      const limitNumber: number = Number(limit);
      const pageNumber: number = Number(page);

      const offset = Math.max((pageNumber - 1) * limitNumber, 0);
      const filteredSearch = search
        ? {
            name: { $regex: search, $options: "i" },
          }
        : {};

      const brands = await BrandModel.find(filteredSearch)
        .skip(offset)
        .limit(limitNumber)
        .sort({ name: sort === "asc" ? 1 : -1 });
      return res.status(200).json({ success: true, brands });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const brand = await BrandModel.findById(req.params.id);
      return res.status(200).json({ success: true, brand });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    let tempImagePath = "";
    try {
      tempImagePath = req.body.image;
      const imgPath = await processImageForBrand(req.body.image, req.body?.resize || "", req.body?.type || "");
      req.body.image = imgPath;
      const brand = await BrandModel.create(req.body);
      return res
        .status(201)
        .json({ status: true, message: "Brand created successfully", brand });
    } catch (error: any) {
      //revert image back to temp folder if error occurs in creating brand
      revertFolder(tempImagePath, req.body?.resize || "", req.body?.type || "")
      return res.status(500).json({ sucess: false, message: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const brand: IBrandResponse | null = await BrandModel.findById(
        req.params.id
      );
      if (!brand) {
        return res
          .status(404)
          .json({ success: false, message: "Brand not found" });
      }

      if (req.file) {
        const imagePath = path.join("uploads", brand.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
        if (brand.image.endsWith("_md.webp")) {
          const originalImagePath = imagePath.replace("_md.webp", ".webp");
          if (fs.existsSync(originalImagePath))
            fs.unlinkSync(originalImagePath);
        }
        req.body.image = req.file.path;
      }

      const updatedBrand = await BrandModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedBrand) {
        return res
          .status(404)
          .json({ status: false, message: "Brand not found." });
      }

      return res.status(200).json({
        status: true,
        message: "Brand updated successfully",
        updatedBrand,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const brand = await BrandModel.findByIdAndDelete(req.params.id).session(
        session
      );

      if (!brand) {
        return res
          .status(404)
          .json({ success: false, message: `Brand not found` });
      }
      const imagePath = path.join(brand.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      } else {
        throw new Error("File not found");
      }
      if (brand.image.endsWith("_md.webp")) {
        const originalImagePath = imagePath.replace("_md.webp", ".webp");
        if (fs.existsSync(originalImagePath)) fs.unlinkSync(originalImagePath);
      } else {
        throw new Error("File not found");
      }

      await session.commitTransaction();
      return res
        .status(200)
        .json({ success: true, message: "Brand Deleted Successfully" });
    } catch (error: any) {
      await session.abortTransaction();
      return res.status(500).json({ success: false, message: error.message });
    } finally {
      await session.endSession();
    }
  }
}
