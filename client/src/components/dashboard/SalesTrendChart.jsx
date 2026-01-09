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
  const formattedData = data.map((item) => ({
    name: new Date(0, item._id - 1).toLocaleString("default", {
      month: "short",
    }),
    total: item.total,
  }));

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-xl text-gray-800">Sales Trend</h3>
          <p className="text-sm text-gray-400 font-medium">Last 6 Months</p>
        </div>
        <div className="bg-brand-lightest/50 p-2 rounded-xl">
          <span className="text-brand-primary font-bold text-xs uppercase tracking-wider">
            +12.5% Growth
          </span>
        </div>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 600 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "16px",
                border: "none",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                padding: "12px 16px",
              }}
              formatter={(value) => [
                <span className="font-bold text-brand-primary text-lg">
                  ₹{value.toLocaleString()}
                </span>,
                <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                  Sales
                </span>,
              ]}
              labelStyle={{
                color: "#6B7280",
                marginBottom: "4px",
                fontWeight: "600",
              }}
              cursor={{
                stroke: "#8B5CF6",
                strokeWidth: 2,
                strokeDasharray: "5 5",
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8B5CF6"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorSales)"
              style={{
                filter: "drop-shadow(0px 10px 10px rgba(139, 92, 246, 0.2))",
              }}
              activeDot={{
                r: 8,
                fill: "#fff",
                stroke: "#8B5CF6",
                strokeWidth: 4,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesTrendChart;
