import { FaShoppingCart, FaFileInvoiceDollar, FaClock } from "react-icons/fa";

const RecentActivityFeed = ({ activities = [] }) => {
  return (
    <div
      className="rounded-3xl shadow-lg border overflow-hidden h-full"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--bg-accent)",
      }}
    >
      <div className="p-6 border-b" style={{ borderColor: "var(--bg-accent)" }}>
        <h3
          className="font-bold flex items-center gap-2"
          style={{ color: "var(--text-primary)" }}
        >
          <FaClock style={{ color: "var(--brand-primary)" }} /> Recent Activity
        </h3>
      </div>
      <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-4 mb-6 last:mb-0 relative">
            {/* Timeline Line */}
            {index !== activities.length - 1 && (
              <div
                className="absolute left-[19px] top-10 bottom-[-24px] w-0.5"
                style={{ backgroundColor: "var(--bg-accent)" }}
              ></div>
            )}

            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--brand-primary)",
              }}
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
                  <h4
                    className="font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {activity.type === "sale" ? "New Sale" : "New Purchase"}
                  </h4>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {activity.type === "sale"
                      ? `To: ${activity.customerName}`
                      : `From: ${activity.supplierName}`}
                  </p>
                </div>
                <span
                  className="font-bold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  ₹{activity.totalAmount?.toLocaleString()}
                </span>
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div
            className="text-center py-8"
            style={{ color: "var(--text-secondary)" }}
          >
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;
