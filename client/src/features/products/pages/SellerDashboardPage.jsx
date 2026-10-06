import { useEffect, useState } from "react";
import { deleteProductById, getSellerProducts, publishProductById, unPublishProductById } from "../api/productApi";
import { Link } from "react-router";
import { formatPrice } from "../../../lib/formate";


const SellerDashboardPage = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await getSellerProducts();
        setProducts(response.data.products);
      }
      catch (error) {
        setError(error?.response?.data?.message || "Something went wrong");
      }
      finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);



  const handleTogglePublish = async (product) => { 
    try {
      if (product.published) {
        await unPublishProductById(product._id);
      }
      else { 
        await publishProductById(product._id);
      }

      setProducts(
        products.map((p) => {
            return p._id === product._id ? { ...p, published: !p.published } : p
          }
        )
      );
    }
    catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  }


  const handleDelete = async (id) => { 
    const isSure = window.confirm("Delete this product? This cannot be undone.");

    try {
      if (isSure) { 
        await deleteProductById(id);
        setProducts(products.filter((p) => {
          return p._id !== id;
        }));
      }
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || "Something went wrong")
    }
  }


  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Heading + Add button */}
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-xl font-semibold uppercase tracking-[0.25em] sm:text-2xl">
            Dashboard
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
            {!loading && !error && `${products.length} products`}
          </p>
        </div>

        <Link
          to="/seller/products/new"
          className="shrink-0 bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
        >
          + Add
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-neutral-500">Loading products...</p>
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
          You have no products yet
        </p>
      )}

      {/* List */}
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col gap-4 border border-neutral-200 p-4 sm:flex-row sm:items-center"
          >
            {/* Image + info */}
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <img
                src={product.images[0]?.url}
                alt={product.title}
                className="h-20 w-16 shrink-0 bg-neutral-100 object-cover"
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-medium uppercase tracking-[0.1em]">
                  {product.title}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  {formatPrice(product.price)}
                </p>
                <span
                  className={`mt-2 inline-block border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                    product.published
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 text-neutral-500"
                  }`}
                >
                  {product.published ? "Published" : "Unlisted"}
                </span>
              </div>
            </div>

            {/* Buttons (abhi sirf UI) */}
            <div className="flex gap-2">
              <button onClick={() => handleTogglePublish(product)} className="flex-1 border border-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition hover:bg-black hover:text-white sm:flex-none">
                {product.published ? "Unlist" : "Publish"}
              </button>

              <Link
                to={`/seller/products/${product._id}/edit`}
                className="flex-1 border border-black px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.15em] transition hover:bg-black hover:text-white sm:flex-none"
              >
                Edit
              </Link>

              <button onClick={() => handleDelete(product._id)} className="flex-1 border border-neutral-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500 transition hover:border-red-600 hover:text-red-600 sm:flex-none">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerDashboardPage




