import { deleteApi, getApi, postApi, putApi } from "@/utils/api";
import { createContext, useContext } from "react";
import { toast } from "react-toastify";
// import { useAuth } from "./AuthContext";

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
const UserContextProvider = ({ children }) => {
  const fetchTasks = async () => {
    const response = await getApi("/transactions/");
    if (response.status === 200) {
      console.log(response.data);
      return response.data.data;
    } else {
      toast.error("Failed to retrieve transactions");
    }
  };

  const addTransaction = async (data) => {
    const response = await postApi("/transactions", data);
    if (response.status === 200) {
      console.log(response.data);
      toast.success("Transaction added successfully");
      return response.data.data;
    }
    toast.error("Failed to add transaction");
  };
  
  const updateTransaction = async (data) => {
    const response = await putApi(`/transactions/${data._id}`, data);
    if (response.status === 200) {
      console.log(response.data);
      toast.success("Transaction updated successfully");
      return response.data.data;
    }
    toast.error("Failed to update transaction");
  };
  
  const deleteTransaction = async (id) => {
    const response = await deleteApi(`/transactions/${id}`);
    if (response.status === 200) {
      console.log(response.data);
      toast.success("Transaction deleted successfully");
      return true;
    } else {
      toast.error("Failed to delete transaction");
      return false;
    }
  };

  const getDashboardStats = async () => {
    const response = await getApi("/dashboard/stats");
    if (response.status === 200) {
      console.log(response.data);
      return response.data.data;
    } else {
      toast.error("Failed to retrieve dashboard stats");
    }
  };

  const getDashboardCategoryStats = async () => {
    const response = await getApi("/dashboard/category-stats");
    if (response.status === 200) {
      console.log(response.data);
      return response.data.data;
    } else {
      toast.error("Failed to retrieve dashboard category stats");
    }
  };

  // New insights API functions
  const getCategoryInsights = async (period) => {
    const response = await getApi(`/insight/category${period ? `?period=${period}` : ''}`);
    if (response.status === 200) {
      console.log(response.data);
      return response.data.data;
    } else {
      toast.error("Failed to retrieve category insights");
    }
  };

  const getMonthlyInsights = async (year) => {
    const response = await getApi(`/insight/monthly${year ? `?year=${year}` : ''}`);
    if (response.status === 200) {
      console.log(response.data);
      return response.data.data;
    } else {
      toast.error("Failed to retrieve monthly insights");
    }
  };

  const setMonthlyBudget = async (category, amount) => {
    const response = await postApi('/insight/budget', { category, amount });
    if (response.status === 200 || response.status === 201) {
      console.log(response.data);
      toast.success("Budget set successfully");
      return response.data.data;
    } else {
      toast.error("Failed to set monthly budget");
    }
  };

  const ctxValue = {
    fetchTasks,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getDashboardStats,
    getDashboardCategoryStats,
    getCategoryInsights,
    getMonthlyInsights,
    setMonthlyBudget
  };
  
  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default UserContextProvider;