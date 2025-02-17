import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Plus, Banknote, PieChart, BarChart2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/UserContext";
import AddTransaction from "@/components/AddTransaction ";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const CATEGORY_COLORS = {
  FOOD: { bg: "bg-green-100", text: "text-green-800", chart: "#22c55e" },
  ENTERTAINMENT: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    chart: "#a855f7",
  },
  TRANSPORT: { bg: "bg-blue-100", text: "text-blue-800", chart: "#3b82f6" },
  SHOPPING: { bg: "bg-pink-100", text: "text-pink-800", chart: "#ec4899" },
  UTILITIES: { bg: "bg-yellow-100", text: "text-yellow-800", chart: "#eab308" },
  OTHER: { bg: "bg-gray-100", text: "text-gray-800", chart: "#6b7280" },
};

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const { getDashboardStats, getDashboardCategoryStats } = useUser();
  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      console.log("object",user);
      setIsLoading(true);
      const [stats, catStats] = await Promise.all([
        getDashboardStats(),
        getDashboardCategoryStats(),
      ]);
      setDashboardData(stats);
      setCategoryStats(catStats);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({
    title,
    value,
    subtext,
    loading,
    icon: Icon,
    category,
  }) => {
    const colorClass = category
      ? CATEGORY_COLORS[category.toUpperCase()]
      : CATEGORY_COLORS.OTHER;

    if (loading) {
      return (
        <Card className="bg-white shadow-lg rounded-xl">
          <CardHeader className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-6 px-6">
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="bg-white shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-200">
        <CardHeader className="p-6">
          <div className="flex items-center space-x-4">
            {Icon && (
              <div className={`p-3 rounded-lg ${colorClass.bg}`}>
                <Icon className={`h-6 w-6 ${colorClass.text}`} />
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {title}
              </CardTitle>
              <div className={`text-2xl font-bold mt-2 ${colorClass.text}`}>
                {value}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-6 px-6">
          <p className="text-sm text-gray-600">{subtext}</p>
        </CardContent>
      </Card>
    );
  };

  const TransactionItem = ({ transaction }) => {
    const categoryColor =
      CATEGORY_COLORS[transaction.category?.toUpperCase()] ||
      CATEGORY_COLORS.OTHER;

    return (
      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-green-200">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg ${categoryColor.bg}`}>
            <Banknote className={`h-4 w-4 ${categoryColor.text}`} />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {transaction.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className={`${categoryColor.bg} ${categoryColor.text}`}
              >
                {transaction.category}
              </Badge>
              <span className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <span className="font-medium text-green-800">
          ₹{transaction.amount.toFixed(2)}
        </span>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-green-800 font-bold">
            ₹{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || "User"}! 👋
          </h1>
          <p className="text-gray-500">Here's your financial overview</p>
        </div>
        <Button
          onClick={() => setIsAddTransactionOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Expenses"
          value={
            isLoading
              ? "Loading..."
              : `₹${dashboardData?.totalExpenses.toFixed(2) || "0.00"}`
          }
          subtext="Last 30 days"
          loading={isLoading}
          icon={Banknote}
          category="SHOPPING"
        />
        <StatCard
          title="Monthly Budget"
          value={
            isLoading
              ? "Loading..."
              : `₹${dashboardData?.monthlyBudget.total.toFixed(2) || "0.00"}`
          }
          subtext={`${
            isLoading
              ? "Loading..."
              : `${dashboardData?.monthlyBudget.percentage || 0}%`
          } used`}
          loading={isLoading}
          icon={Banknote}
          category="UTILITIES"
        />
        <StatCard
          title="Top Category"
          value={
            isLoading
              ? "Loading..."
              : dashboardData?.topCategory.category || "N/A"
          }
          subtext={
            isLoading
              ? "Loading..."
              : `₹${
                  dashboardData?.topCategory.amount.toFixed(2) || "0.00"
                } spent`
          }
          loading={isLoading}
          icon={PieChart}
          category="FOOD"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <CardHeader className="p-6 border-b border-gray-200">
            <CardTitle className="flex items-center text-gray-900">
              <BarChart2 className="h-6 w-6 text-purple-600 mr-3" />
              Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData?.monthlyExpenses}>
                  <XAxis dataKey="month" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="amount"
                    fill="url(#gradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                      <stop
                        offset="100%"
                        stopColor="#d8b4fe"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-gray-200">
            <CardTitle className="flex items-center text-gray-900">
              <Calendar className="h-6 w-6 text-blue-600 mr-3" />
              Recent Transactions
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-blue-50"
              onClick={() => setIsAddTransactionOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))
              ) : dashboardData?.recentTransactions?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No transactions found. Add your first transaction to get
                  started.
                </div>
              ) : (
                dashboardData?.recentTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction._id}
                    transaction={transaction}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddTransaction
        isOpen={isAddTransactionOpen}
        onClose={() => {
          setIsAddTransactionOpen(false);
          fetchDashboardData();
        }}
      />
    </div>
  );
};

export default DashboardPage;
