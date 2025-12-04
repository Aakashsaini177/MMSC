import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const SalesTrendChart = ({ data = [] }) => {
  // Format data for chart (month number to name)
  // Assuming data is sorted by month
  const formattedData = data.map((item) => ({
    name: new Date(0, item._id - 1).toLocaleString("default", {
      month: "short",
    }),
    total: item.total,
  }));

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 h-full">
      <h3 className="font-bold text-gray-800 mb-6">Sales Trend (6 Months)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value) => [`₹${value.toLocaleString()}`, "Sales"]}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesTrendChart;
