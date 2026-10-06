import { useEffect, useState } from "react";
import { getPublishedProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";


const HomePage = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await getPublishedProducts();
        setProducts(response.data.products);
      }
      catch (error) {
        setError(error.response?.data?.message || "Something went wrong");
      }
      finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);



  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* Heading */}
      <div className="mb-10 border-b border-neutral-200 pb-6">
        <h1 className="text-2xl font-semibold uppercase tracking-[0.3em]">
          New Arrivals
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
          {!loading && !error && `${products.length} products`}
        </p>
      </div>

      {/* Loading: grey boxes jo card jaise dikhte hain */}
      {loading && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="animate-pulse">
              <div className="aspect-[3/4] bg-neutral-200" />
              <div className="mt-3 h-3 w-3/4 bg-neutral-200" />
              <div className="mt-2 h-3 w-1/3 bg-neutral-200" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="border border-black bg-neutral-100 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      {/* Khaali */}
      {!loading && !error && products.length === 0 && (
        <p className="py-20 text-center text-xs uppercase tracking-[0.25em] text-neutral-500">
          No products available yet
        </p>
      )}

      {/* Products grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage