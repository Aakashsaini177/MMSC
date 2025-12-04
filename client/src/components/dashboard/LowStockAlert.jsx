import { FaExclamationTriangle, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const LowStockAlert = ({ products = [] }) => {
  if (!products.length) return null;

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-red-100 overflow-hidden h-full">
      <div className="p-6 border-b border-red-50 bg-red-50/30 flex justify-between items-center">
        <h3 className="font-bold text-red-600 flex items-center gap-2">
          <FaExclamationTriangle /> Low Stock Alert
        </h3>
        <Link
          to="/purchases"
          className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
        >
          Restock <FaArrowRight />
        </Link>
      </div>
      <div className="p-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0 hover:bg-red-50/10 rounded-xl transition-colors"
          >
            <span className="font-medium text-gray-700">{product.name}</span>
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
              {product.stock} left
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlert;
