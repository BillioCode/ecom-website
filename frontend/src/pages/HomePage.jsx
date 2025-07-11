import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore.js";
import FeaturedProducts from "../components/FeaturedProducts";

const HomePage = () => {
  // const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];
  const categories = [
    { href: "jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
    { href: "t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
    { href: "shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
    { href: "glasses", name: "Glasses", imageUrl: "/glasses.png" },
    { href: "jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
    { href: "suits", name: "Suits", imageUrl: "/suits.jpg" },
    { href: "bags", name: "Bags", imageUrl: "/bags.jpg" },
  ];

  const { fetchFeaturedProducts, loading, products } = useProductStore(); //

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  if (loading) {
    return (
      <div className="justify-center items-center flex">
        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-emerald-400 rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore the world of fashion
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends and styles in fashion
        </p>

        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {!loading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
