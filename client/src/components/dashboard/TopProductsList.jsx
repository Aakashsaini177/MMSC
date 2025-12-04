import { FaTrophy } from "react-icons/fa";

const TopProductsList = ({ products = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden h-full">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <FaTrophy className="text-yellow-500" /> Top Selling Products
        </h3>
      </div>
      <div className="p-4">
        {products.map((product, index) => (
          <div
            key={product._id}
            className="flex items-center p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
                index === 0
                  ? "bg-yellow-100 text-yellow-600"
                  : index === 1
                  ? "bg-gray-100 text-gray-600"
                  : index === 2
                  ? "bg-orange-100 text-orange-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              #{index + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-700 text-sm">{product._id}</h4>
              <p className="text-xs text-gray-500">
                {product.totalSold} units sold
              </p>
            </div>
            <div className="font-bold text-gray-800 text-sm">
              {product.revenue ? `₹${product.revenue.toLocaleString()}` : ""}
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No sales data yet
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProductsList;
