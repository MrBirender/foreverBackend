import express from "express";
import {
  singleProduct,
  addProduct,
  removeProduct,
  listProducts,
} from "../controllers/product.controller.js";
import { upload } from "../middelwares/multer.js";
import adminAuth from "../middelwares/adminAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.get("/single", singleProduct);
productRouter.get("/list", listProducts);

export default productRouter;
