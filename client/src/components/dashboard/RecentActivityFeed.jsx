import { FaShoppingCart, FaFileInvoiceDollar, FaClock } from "react-icons/fa";

const RecentActivityFeed = ({ activities = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden h-full">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <FaClock className="text-blue-500" /> Recent Activity
        </h3>
      </div>
      <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-4 mb-6 last:mb-0 relative">
            {/* Timeline Line */}
            {index !== activities.length - 1 && (
              <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-gray-100"></div>
            )}

            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                activity.type === "sale"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {activity.type === "sale" ? (
                <FaFileInvoiceDollar />
              ) : (
                <FaShoppingCart />
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800">
                    {activity.type === "sale" ? "New Sale" : "New Purchase"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {activity.type === "sale"
                      ? `To: ${activity.customerName}`
                      : `From: ${activity.supplierName}`}
                  </p>
                </div>
                <span className="font-bold text-gray-800">
                  ₹{activity.totalAmount?.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;
