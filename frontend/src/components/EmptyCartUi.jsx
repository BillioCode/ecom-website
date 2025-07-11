import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
const EmptyCartUi = () => {
  return (
    <motion.div
      className=" flex flex-col items-center justify-center space-y-4 py-16 "
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      <ShoppingCart className="h-24 w-24 text-gray-300" />
      <h3 className="text-2xl font-semibold">Your cart is empty</h3>
      <p className="text-gray-400">
        Looks like you {"have't"} added anything to your cart yet.
      </p>
      <Link
        to="/"
        className="mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600"
      >
        Start Shopping
      </Link>
    </motion.div>
  );
};

export default EmptyCartUi;
