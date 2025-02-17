import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Settings } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

const InsightsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryInsights, setCategoryInsights] = useState([]);
  const [monthlyInsights, setMonthlyInsights] = useState({
    monthlyData: [],
    annualTotal: 0,
    annualBudget: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const { getCategoryInsights, getMonthlyInsights, setMonthlyBudget } =
    useUser();

  // Dialog state
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

  useEffect(() => {
    fetchInsights();
  }, [selectedPeriod]);

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [categoryData, monthlyData] = await Promise.all([
        getCategoryInsights(selectedPeriod),
        getMonthlyInsights(),
      ]);

      // Ensure we have valid data with defaults if necessary
      setCategoryInsights(categoryData || []);
      setMonthlyInsights({
        monthlyData: monthlyData?.monthlyData || [],
        annualTotal: monthlyData?.annualTotal || 0,
        annualBudget: monthlyData?.annualBudget || 0,
      });
    } catch (error) {
      console.error("Failed to fetch insights:", error);
      setError("Failed to load insights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Functions to handle budget setting
  const handleSetBudget = (category) => {
    setSelectedCategory(category);
    setNewBudgetAmount(
      categoryInsights
        .find((item) => item.category === category)
        ?.budget?.toString() || ""
    );
    setIsBudgetDialogOpen(true);
  };
  const handleSetAnnualBudget = () => {
    console.log("set budget");
  };

  const handleSaveBudget = async () => {
    try {
      if (
        !selectedCategory ||
        !newBudgetAmount ||
        isNaN(Number(newBudgetAmount))
      ) {
        return;
      }

      await setMonthlyBudget(selectedCategory, Number(newBudgetAmount));
      setIsBudgetDialogOpen(false);
      fetchInsights();
    } catch (error) {
      console.error(`Failed to set budget for ${selectedCategory}:`, error);
    }
  };

  // Prepare data for pie chart with defensive coding
  const pieChartData = (categoryInsights || []).map((item) => ({
    name: item.category || "Unknown",
    value: item.spent || 0,
    color: CATEGORY_COLORS[item.category]?.chart || CATEGORY_COLORS.OTHER.chart,
  }));

  const getBudgetPercentage = () => {
    if (!monthlyInsights.annualBudget || monthlyInsights.annualBudget === 0)
      return 0;
    return (
      (monthlyInsights.annualTotal / monthlyInsights.annualBudget) *
      100
    ).toFixed(1);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-green-800 font-bold">
            ₹{(payload[0].value || 0).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={fetchInsights}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Spending Insights
          </h1>
          <p className="text-gray-500">Analyze your spending patterns</p>
        </div>
        <Tabs
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-lg" />
            ) : (pieChartData || []).length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                No spending data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900">Budget vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : (categoryInsights || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No budget data available
              </div>
            ) : (
              <div className="space-y-6">
                {(categoryInsights || []).map((item, index) => {
                  const colorClass =
                    CATEGORY_COLORS[item.category] || CATEGORY_COLORS.OTHER;
                  return (
                    <div key={item.category || index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {item.category || "Unknown"}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            ₹{(item.spent || 0).toFixed(2)} of ₹
                            {(item.budget || 0).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSetBudget(item.category)}
                            className="h-6 w-6"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Progress
                        value={item.percentage || 0}
                        className="h-2"
                        style={{
                          backgroundColor: `${colorClass.chart}33`,
                        }}
                        indicatorClassName={`bg-[${colorClass.chart}]`}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="w-full h-[200px] rounded-lg" />
          ) : (monthlyInsights?.monthlyData || []).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No monthly data available
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-green-800 text-lg font-semibold">
                      Annual Budget
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSetAnnualBudget}
                      className="text-green-700 border-green-200 hover:bg-green-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Set Budget
                    </Button>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-2">
                    ₹{(monthlyInsights?.annualBudget || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-blue-800 text-lg font-semibold">
                    Total Spent
                  </h3>
                  <p className="text-2xl font-bold text-blue-900 mt-2">
                    ₹{(monthlyInsights?.annualTotal || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    {getBudgetPercentage()}% of annual budget
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {(monthlyInsights?.monthlyData || []).map((item, index) => (
                  <div
                    key={item.month || index}
                    className="bg-gray-50 rounded-xl p-4"
                  >
                    <h4 className="text-gray-700 font-medium">
                      {item.month || "Unknown"}
                    </h4>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      ₹{(item.spent || 0).toFixed(0)}
                    </p>
                    <Progress
                      value={item.percentage || 0}
                      className="h-1 mt-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Budget</DialogTitle>
            <DialogDescription>
              Set budget for {selectedCategory || "selected category"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Amount (₹)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter budget amount"
                value={newBudgetAmount}
                onChange={(e) => setNewBudgetAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBudgetDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveBudget}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InsightsPage;
