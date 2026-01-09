import { FaArrowUp } from "react-icons/fa";

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div
      className="rounded-2xl shadow-sm border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--bg-accent)",
      }}
    >
      <div
        className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-150 duration-500`}
      >
        <Icon className="text-8xl" style={{ color: "var(--text-primary)" }} />
      </div>

      <div className="relative z-10 flex items-center justifies-between mb-4">
        <div
          className="p-3 rounded-xl transition-all group-hover:scale-110 duration-300 shadow-sm"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <Icon
            className="text-2xl"
            style={{ color: "var(--brand-primary)" }}
          />
        </div>
        {color?.growth && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ml-auto border"
            style={{
              backgroundColor: "var(--bg-accent)",
              color: "var(--brand-primary)",
              borderColor: "var(--brand-primary)",
            }}
          >
            <FaArrowUp className="text-[10px]" /> {color.growth}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <h3
          className="text-3xl font-extrabold mb-1 tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </h3>
        <p
          className="text-sm font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-secondary)" }}
        >
          {title}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
