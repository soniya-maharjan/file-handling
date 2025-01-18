import { Router } from "express";
import { BrandController } from "../controllers/brand";

const brandRoutes = Router();

const brandController = new BrandController();

brandRoutes.route("/").get(brandController.getAll).post(brandController.create);
brandRoutes
  .route("/:id")
  .get(brandController.getById)
  .put(brandController.update)
  .delete(brandController.delete);

export default brandRoutes;
