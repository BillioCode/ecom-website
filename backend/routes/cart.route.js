import { Router } from "express";
import {
  getCartProducts,
  addToCart,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cart.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const cartRouter = Router();

cartRouter.get("/", protectRoute, getCartProducts);
cartRouter.post("/", protectRoute, addToCart);
cartRouter.delete("/", protectRoute, removeAllFromCart);
cartRouter.put("/:id", protectRoute, updateQuantity);

export default cartRouter;
