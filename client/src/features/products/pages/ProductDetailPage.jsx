import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getProductById } from "../api/productApi";
import { formatPrice } from "../../../lib/formate";


const ProductDetailPage = () => {

    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeImage, setActiveImage] = useState(0);


    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await getProductById(id);
                setProduct(response.data.product);
            }
            catch (error) {
                setError(error.response?.data?.message || "Something went wrong");
            }
            finally {
                setLoading(false);
            }
        }
        getProduct()
    }, [id]);



      // 1. Loading handle
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm text-neutral-500">
          Loading product...
        </p>
      </div>
    );
  }

  // 2. Error handle
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm text-red-500">
          {error}
        </p>

        <Link
          to="/"
          className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-black"
        >
          &larr; Back to shop
        </Link>
      </div>
    );
  }

  // 3. Product nahi mila
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm text-neutral-500">
          Product not found.
        </p>

        <Link
          to="/"
          className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-black"
        >
          &larr; Back to shop
        </Link>
      </div>
    );
  }




    return (
        
        
        <div className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to="/"
        className="text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-black"
      >
        &larr; Back to shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* LEFT: images */}
        <div>
          <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
            <img
              src={product?.images[activeImage]?.url}
              alt={product?.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-3 flex gap-3 overflow-x-auto">
            {product?.images?.map((img, index) => (
              <img
                key={img.fileId}
                src={img.url}
                alt=""
                onClick={() => setActiveImage(index)}
                className={`h-20 w-16 shrink-0 cursor-pointer object-cover border-2 ${
                  index === activeImage
                    ? "border-black"
                    : "border-transparent opacity-60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: info */}
        <div>
          <h1 className="text-2xl font-semibold uppercase tracking-[0.15em]">
            {product?.title}
          </h1>
          <p className="mt-3 text-xl">{formatPrice(product?.price)}</p>

          <p className="mt-6 text-sm leading-relaxed text-neutral-600">
            {product?.description}
          </p>

          <h2 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.2em]">
            Sizes
          </h2>
          <div className="flex flex-wrap gap-3">
            {product?.sizes.map((s) => (
              <div
                key={s._id}
                className={`min-w-14 border px-4 py-3 text-center text-sm ${
                  s.stock > 0
                    ? "border-black"
                    : "border-neutral-200 text-neutral-300 line-through"
                }`}
              >
                {s.size}
              </div>
            ))}
          </div>
        </div>
      </div>
        </div>
    );
}

export default ProductDetailPage


