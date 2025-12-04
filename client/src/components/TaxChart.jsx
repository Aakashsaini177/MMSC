import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Income Tax", value: 55000 },
  { name: "GST", value: 35000 },
  { name: "Other Taxes", value: 10000 },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b"]; // Indigo, Emerald, Amber

const TaxChart = () => {
  return (
    <div className="w-full bg-white shadow-sm rounded-xl border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Tax Breakdown</h2>
        <select className="text-xs border-gray-200 rounded-lg text-gray-500 focus:ring-blue-500">
          <option>This Year</option>
          <option>Last Year</option>
        </select>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-gray-600 font-medium ml-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaxChart;
