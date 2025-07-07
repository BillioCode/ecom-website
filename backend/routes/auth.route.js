import { Router } from "express";
import {
  signup,
  login,
  logout,
  refreshToken,
  getProfile,
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.post("/refresh-token", refreshToken);

authRouter.get("/profile", protectRoute, getProfile);

export default authRouter;
