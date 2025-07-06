import Router from "express";
import { addToCart, getCartData, updateToCart } from "../controllers/cart.controller.js";
import authUser from "../middelwares/auth.js";

const cartRouter = Router();

cartRouter.post("/add",authUser, addToCart);
cartRouter.get("/get",authUser, getCartData);
cartRouter.put("/update",authUser, updateToCart); // differnt from the tutorial using put here:

export default cartRouter;