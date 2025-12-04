import { FaCalendarAlt, FaClock } from "react-icons/fa";

// ==================================================================================
// 📢 CLIENT CONFIGURATION: DEADLINE SETTINGS
// You can manually update the due dates below.
//
// 💡 HOW TO CHANGE DATES:
// 1. To use a fixed date, replace the function call (e.g., getNextGSTDate())
//    with a specific string like "25 Dec 2025".
// 2. Example: date: "31 March 2026"
// ==================================================================================

// Helper to format date
const formatDate = (date) => {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// 🗓️ Dynamic Date Calculators (Auto-updates based on today)
const getNextGSTDate = () => {
  const d = new Date();
  // GST is usually due on the 20th of the next month
  if (d.getDate() > 20) {
    d.setMonth(d.getMonth() + 1);
  }
  d.setDate(20);
  return formatDate(d);
};

const getNextTDSDate = () => {
  const d = new Date();
  // TDS is usually due on the 7th of the next month
  if (d.getDate() > 7) {
    d.setMonth(d.getMonth() + 1);
  }
  d.setDate(7);
  return formatDate(d);
};

const getITRDate = () => {
  const d = new Date();
  const year = d.getMonth() > 6 ? d.getFullYear() + 1 : d.getFullYear();
  return `31 July ${year}`;
};

const getAuditDate = () => {
  const d = new Date();
  const year = d.getMonth() > 8 ? d.getFullYear() + 1 : d.getFullYear();
  return `30 Sep ${year}`;
};

const deadlines = [
  {
    title: "GST Return (GSTR-3B)",
    // 👇 YOU CAN CHANGE THIS DATE HERE
    date: getNextGSTDate(), // Currently: Auto-calculated (20th)
    type: "GST",
    color: "border-green-500",
  },
  {
    title: "TDS Payment",
    // 👇 YOU CAN CHANGE THIS DATE HERE
    date: getNextTDSDate(), // Currently: Auto-calculated (7th)
    type: "TDS",
    color: "border-orange-500",
  },
  {
    title: "ITR Filing (Non-Audit)",
    // 👇 YOU CAN CHANGE THIS DATE HERE
    date: getITRDate(), // Currently: 31st July
    type: "Income Tax",
    color: "border-blue-500",
  },
  {
    title: "Tax Audit Report",
    // 👇 YOU CAN CHANGE THIS DATE HERE
    date: getAuditDate(), // Currently: 30th Sep
    type: "Compliance",
    color: "border-purple-500",
  },
];

const DeadlineCard = () => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600" /> Upcoming Deadlines
        </h2>
        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
          Auto-Updated
        </span>
      </div>
      <div className="space-y-4">
        {deadlines.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-4 bg-gray-50/50 rounded-lg border-l-4 ${item.color} hover:bg-white hover:shadow-md transition-all duration-200 group`}
          >
            <div>
              <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">{item.type}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-700 block">
                {item.date}
              </span>
              <span className="text-[10px] text-gray-400 flex items-center justify-end gap-1 mt-1">
                <FaClock /> Due soon
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlineCard;
