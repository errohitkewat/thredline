import { Link } from "react-router";
import { formatPrice } from "../../../lib/formate";



const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`} className="group block">
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
        <img
          src={product.images[0]?.url}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="line-clamp-1 text-xs font-medium uppercase tracking-[0.15em]">
          {product.title}
        </h3>
        <p className="text-sm text-neutral-500">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;