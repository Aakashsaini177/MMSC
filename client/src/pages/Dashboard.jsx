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
    topProducts: [],
    recentActivity: [],
    allStockProducts: [],
  });

  const [chartData, setChartData] = useState({
    sales: [],
    expenses: [],
    expenseBreakdown: [],
  });

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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-primary to-brand-dark p-8 shadow-xl text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold mb-2">Dashboard Overview</h1>
          <p className="text-brand-lightest/80 text-lg max-w-2xl">
            Welcome back! Here's a comprehensive overview of your business
            performance, financial stats, and upcoming deadlines.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent transform skew-x-12"></div>
        <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-brand-light/20 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Sales"
          value={`₹${stats.totalSales.toLocaleString()}`}
          icon={FaRupeeSign}
          color={{
            bg: "bg-brand-lightest",
            text: "text-brand-primary",
            growthText: "text-brand-primary",
          }}
        />
        <Link
          to="/sales?filter=pending"
          className="block h-full w-full transition-transform hover:scale-[1.02]"
        >
          <StatsCard
            title="Pending Sales"
            value={`₹${stats.totalPendingSales.toLocaleString()}`}
            icon={FaFileAlt}
            color={{
              bg: "bg-orange-50",
              text: "text-orange-600",
              growthText: "text-red-500",
            }}
          />
        </Link>
        <StatsCard
          title="Total Purchases"
          value={`₹${stats.totalPurchases.toLocaleString()}`}
          icon={FaShoppingCart}
          color={{
            bg: "bg-blue-50",
            text: "text-blue-600",
            growthText: "text-blue-600",
          }}
        />
        <StatsCard
          title="Net Profit"
          value={`₹${stats.profit.toLocaleString()}`}
          icon={FaSmile}
          color={{
            bg: "bg-green-50",
            text: "text-green-600",
            growthText: "text-green-600",
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
          <div className="bg-brand-surface/80 backdrop-blur-xl rounded-3xl shadow-lg border border-brand-light/20 overflow-hidden">
            <div className="p-6 border-b border-brand-light/20">
              <h3 className="text-xl font-bold text-brand-dark">
                Recent Clients
              </h3>
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
