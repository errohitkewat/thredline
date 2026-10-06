import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getProductById } from "../api/productApi";
import { formatPrice } from "../../../lib/formate";

const BackLink = () => (
  <Link
    to="/"
    className="inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-black"
  >
    &larr; Back to shop
  </Link>
);

const ProductDetailPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setActiveImage(0);

        const response = await getProductById(id);
        setProduct(response.data.product);
      } catch (error) {
        setError(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  // 1. Loading
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-sm text-neutral-500">Loading product...</p>
      </div>
    );
  }

  // 2. Error
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-4 border border-black bg-neutral-100 px-4 py-3 text-sm">
          {error}
        </p>
        <BackLink />
      </div>
    );
  }

  // 3. Product nahi mila
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-4 text-sm text-neutral-500">Product not found.</p>
        <BackLink />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <BackLink />

      <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-10">

        {/* LEFT: images */}
        <div className="min-w-0 md:sticky md:top-24 md:self-start">
          <div className="aspect-[4/5] overflow-hidden bg-neutral-100 md:aspect-[3/4]">
            <img
              src={product.images[activeImage]?.url}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, index) => (
                <img
                  key={img.fileId}
                  src={img.url}
                  alt=""
                  onClick={() => setActiveImage(index)}
                  className={`h-20 w-16 shrink-0 cursor-pointer border-2 object-cover ${
                    index === activeImage
                      ? "border-black"
                      : "border-transparent opacity-60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: info */}
        <div className="min-w-0">
          <h1 className="break-words text-xl font-semibold uppercase tracking-[0.12em] sm:text-2xl sm:tracking-[0.15em]">
            {product.title}
          </h1>

          <p className="mt-3 text-xl">{formatPrice(product.price)}</p>

          <p className="mt-6 break-words text-sm leading-relaxed text-neutral-600">
            {product.description}
          </p>

          <h2 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.2em]">
            Sizes
          </h2>

          <div className="flex flex-wrap gap-3">
            {product.sizes.map((s) => (
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
};

export default ProductDetailPage;