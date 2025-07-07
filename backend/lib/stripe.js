import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../config/config.js"; // Ensure you have the correct path to your config file

export const stripe = new Stripe(STRIPE_SECRET_KEY);
