import { Link } from "react-router-dom";
import {
  FaFileInvoiceDollar,
  FaShoppingCart,
  FaReceipt,
  FaUserPlus,
} from "react-icons/fa";

const QuickActions = () => {
  const actions = [
    {
      title: "New Sale",
      path: "/sales", // Or a specific 'new sale' route if available, usually /sales has the "New" button or leads to a modal
      icon: FaFileInvoiceDollar,
      color: "bg-blue-600",
      desc: "Create invoice",
    },
    {
      title: "New Purchase",
      path: "/purchases",
      icon: FaShoppingCart,
      color: "bg-indigo-600",
      desc: "Add supplier bill",
    },
    {
      title: "Add Expense",
      path: "/expenses", // Assuming this route exists or will be created/mapped
      icon: FaReceipt,
      color: "bg-rose-600",
      desc: "Record spending",
    },
    {
      title: "New Client",
      path: "/clients",
      icon: FaUserPlus,
      color: "bg-emerald-600",
      desc: "Add customer",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={action.path}
          className="p-4 rounded-2xl shadow-sm border hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col items-center text-center gap-3"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--bg-accent)",
          }}
        >
          <div
            className="text-white p-3 rounded-xl shadow-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            <action.icon className="text-xl" />
          </div>
          <div>
            <h3
              className="font-bold text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              {action.title}
            </h3>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {action.desc}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
