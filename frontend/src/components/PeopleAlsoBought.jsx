import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetch recommendations with the classic way of react fetching
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("products/recommendations");
        setRecommendations(res.data);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response.data.message || "Failed to fetch products", {
          id: "error-fetching-recommendations",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
