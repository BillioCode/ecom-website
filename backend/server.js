import express from "express";
import { PORT } from "./config/config.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import couponRouter from "./routes/coupon.route.js";
import paymentRouter from "./routes/payment.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

const __dirname = path.resolve(); // get current directory

app.use(express.json({ limit: "10mb" })); // for parsing application/json
app.use(express.static("public")); // for serving static files
app.use(cookieParser()); // for parsing cookies

// Connect to the databse
connectDB();

// routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/analytics", analyticsRouter);

// serve frontend in production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT || 5001, () => {
  console.log("Server is running on port", PORT || 5001);
});
