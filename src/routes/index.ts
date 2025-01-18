import { Router } from "express";
import brandRoutes from "./brand";
import fileRoutes from "./file";

const routes = Router();

routes.use("/brand", brandRoutes);
routes.use("/upload", fileRoutes);

export default routes;