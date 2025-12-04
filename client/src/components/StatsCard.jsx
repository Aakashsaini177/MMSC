import { FaArrowUp } from "react-icons/fa";

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-brand-surface rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-lg ${
            color?.bg || "bg-blue-50"
          } transition-colors group-hover:scale-110 duration-300`}
        >
          <Icon className={`text-xl ${color?.text || "text-blue-600"}`} />
        </div>
        {color?.growth && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600 flex items-center gap-1`}
          >
            <FaArrowUp className="text-[10px]" /> {color.growth}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
