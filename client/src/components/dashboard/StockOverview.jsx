import React from "react";
import { FaBoxOpen } from "react-icons/fa";

const StockOverview = ({ products = [] }) => {
  return (
    <div className="bg-brand-surface/80 backdrop-blur-xl rounded-3xl shadow-lg border border-brand-light/20 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-brand-light/20 bg-brand-lightest/30 flex justify-between items-center">
        <h3 className="font-extrabold text-brand-dark flex items-center gap-2">
          <FaBoxOpen className="text-brand-primary" />
          Stock Overview
        </h3>
        <span className="text-xs font-bold bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full">
          {products.length} Items
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {products.length === 0 ? (
          <div className="text-center text-brand-dark/40 py-12">
            <p className="font-medium">No products found</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between p-4 rounded-2xl border border-brand-light/20 bg-white/30 hover:bg-brand-lightest/50 transition-all group"
            >
              <div className="flex-1">
                <p className="font-bold text-brand-dark text-sm">
                  {product.name}
                </p>
                <div className="mt-1 w-full bg-brand-dark/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      product.stock < 10
                        ? "bg-red-500"
                        : product.stock < 50
                        ? "bg-orange-400"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${Math.min((product.stock / 100) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-right">
                <span
                  className={`text-lg font-extrabold ${
                    product.stock < 10
                      ? "text-red-600"
                      : product.stock < 50
                      ? "text-orange-600"
                      : "text-emerald-600"
                  }`}
                >
                  {product.stock}
                </span>
                <p className="text-xs text-brand-dark/50 font-medium uppercase">
                  {product.unit || "Units"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StockOverview;
