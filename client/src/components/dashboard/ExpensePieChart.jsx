import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const ExpensePieChart = ({ data = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 h-full">
      <h3 className="font-bold text-gray-800 mb-6">Expense Breakdown</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="total"
              nameKey="_id"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpensePieChart;
