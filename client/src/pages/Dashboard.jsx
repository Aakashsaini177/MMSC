import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StatsCard from "../components/StatsCard";
import ClientTable from "../components/ClientTable";
import DeadlineCard from "../components/DeadlineCard";
import LowStockAlert from "../components/dashboard/LowStockAlert";
import SalesTrendChart from "../components/dashboard/SalesTrendChart";
import ExpensePieChart from "../components/dashboard/ExpensePieChart";
import TopProductsList from "../components/dashboard/TopProductsList";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import StockOverview from "../components/dashboard/StockOverview";
import QuickActions from "../components/dashboard/QuickActions";
import api from "../api";

import {
  FaUserFriends,
  FaFileAlt,
  FaRupeeSign,
  FaSmile,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPendingSales: 0,
    totalPurchases: 0,
    totalExpenses: 0,
    productCount: 0,
    clientCount: 0,
    profit: 0,
    lowStockProducts: [],
    topProducts: [],
    recentActivity: [],
    allStockProducts: [],
  });

  const [chartData, setChartData] = useState({
    sales: [],
    expenses: [],
    expenseBreakdown: [],
  });

  // Dynamic Greeting based on time
  const [greeting, setGreeting] = useState("Welcome back");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: statsData } = await api.get("/dashboard/stats");
        setStats(statsData);

        const { data: chartsData } = await api.get("/dashboard/charts");
        setChartData(chartsData);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Welcome Section - 2/3 Width */}
        <div
          className="flex-1 relative overflow-hidden rounded-3xl p-8 shadow-xl text-white flex flex-col justify-center min-h-[200px]"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-primary), var(--brand-hover))",
          }}
        >
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
              {greeting}!
            </h1>
            <p className="text-lg max-w-xl font-medium opacity-90">
              Here's a comprehensive overview of your business performance
              today.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent transform skew-x-12 pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Quick Actions - 1/3 Width */}
        <div className="w-full md:w-1/3">
          <QuickActions />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Sales"
          value={`₹${stats.totalSales.toLocaleString()}`}
          icon={FaRupeeSign}
          color={
            {
              // Using theme agnostic logic inside component, passing null/defaults or specific overrides if needed
              // But for now keeping semantic intent but StatsCard will handle actual colors
            }
          }
        />
        <Link
          to="/sales?filter=pending"
          className="block h-full w-full transition-transform hover:scale-[1.02] focus:outline-none"
        >
          <StatsCard
            title="Pending Sales"
            value={`₹${stats.totalPendingSales.toLocaleString()}`}
            icon={FaFileAlt}
            color={{
              growthText: "Attention Needed",
            }}
          />
        </Link>
        <StatsCard
          title="Total Purchases"
          value={`₹${stats.totalPurchases.toLocaleString()}`}
          icon={FaShoppingCart}
        />
        <StatsCard
          title="Net Profit"
          value={`₹${stats.profit.toLocaleString()}`}
          icon={FaSmile}
          color={{
            growthText: "Healthy",
          }}
        />
      </div>

      {/* Advanced Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Row 1: Sales Trend (2/3) + Low Stock (1/3) */}
        <div className="lg:col-span-2 h-[400px]">
          <SalesTrendChart data={chartData.sales} />
        </div>
        <div className="h-[400px]">
          <LowStockAlert products={stats.lowStockProducts} />
        </div>

        {/* Row 2: Expense Breakdown + Top Products + Recent Activity */}
        <div className="h-[400px]">
          <ExpensePieChart data={chartData.expenseBreakdown} />
        </div>
        <div className="h-[400px]">
          <TopProductsList products={stats.topProducts} />
        </div>
        <div className="h-[400px]">
          <RecentActivityFeed activities={stats.recentActivity} />
        </div>
      </div>

      {/* Stock Overview Section */}
      <div className="h-[500px]">
        <StockOverview products={stats.allStockProducts} />
      </div>

      {/* Deadlines & Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div
            className="rounded-3xl shadow-lg border overflow-hidden"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--bg-accent)",
            }}
          >
            <div
              className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: "var(--bg-accent)" }}
            >
              <h3
                className="text-xl font-bold flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                <FaUserFriends style={{ color: "var(--brand-primary)" }} />{" "}
                Recent Clients
              </h3>
              <Link
                to="/clients"
                className="text-sm font-bold hover:opacity-80 transition-opacity"
                style={{ color: "var(--brand-primary)" }}
              >
                View All
              </Link>
            </div>
            <ClientTable />
          </div>
        </div>
        <div>
          <DeadlineCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
