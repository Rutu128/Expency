import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUser } from "@/context/UserContext";
import { formatDate } from "@/utils/formatDate";
import { FiPlus, FiSmartphone, FiEdit2, FiTrash2 } from "react-icons/fi";
import { GiCash } from "react-icons/gi";
import { Skeleton } from "@/components/ui/skeleton";
import { FaRupeeSign } from "react-icons/fa";
import AddTransaction from '@/components/AddTransaction ';

const CATEGORY_COLORS = {
  FOOD: "bg-green-100 text-green-800",
  ENTERTAINMENT: "bg-purple-100 text-purple-800",
  TRANSPORT: "bg-blue-100 text-blue-800",
  SHOPPING: "bg-pink-100 text-pink-800",
  UTILITIES: "bg-yellow-100 text-yellow-800",
  OTHER: "bg-gray-100 text-gray-800",
};

const TRANSACTION_TYPE_CONFIGS = {
  ONLINE: {
    icon: FiSmartphone,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    label: "Online",
  },
  OFFLINE: {
    icon: GiCash,
    color: "text-green-500",
    bgColor: "bg-green-50",
    label: "Cash",
  },
};

const TransactionsPage = () => {
  const [recentTransactions, setRecentTransactions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const { fetchTasks, deleteTransaction } = useUser();

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tasks = await fetchTasks();
      setRecentTransactions(tasks);
    } catch (err) {
      setError("Failed to fetch transactions. Please try again later.");
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      await deleteTransaction(transactionToDelete._id);
      getTasks();
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTransaction(null);
    getTasks();
  };

  const getTransactionTypeConfig = (type) => {
    const defaultConfig = {
      icon: FaRupeeSign,
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      label: "Other",
    };
    return TRANSACTION_TYPE_CONFIGS[type?.toUpperCase()] || defaultConfig;
  };

  const getCategoryColor = (category) => {
    return CATEGORY_COLORS[category?.toUpperCase()] || CATEGORY_COLORS.OTHER;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setIsFormOpen(true)}
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {[1, 2, 3].map((index) => (
                <div key={index} className="p-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentTransactions?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No transactions found. Add your first transaction to get started.
            </div>
          ) : (
            <div className="divide-y">
              {recentTransactions?.map((transaction) => {
                const typeConfig = getTransactionTypeConfig(
                  transaction.transactionType
                );
                const Icon = typeConfig.icon;

                return (
                  <div
                    key={transaction._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-2 rounded-full ${typeConfig.bgColor} shrink-0`}
                      >
                        <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">
                            {transaction.description}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`${getCategoryColor(
                              transaction.category
                            )} text-xs`}
                          >
                            {transaction.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {typeConfig.label}
                          </Badge>
                          <span>•</span>
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0 ml-12 sm:ml-0">
                      <span className="font-medium">
                        Rs.{transaction.amount.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(transaction)}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transaction)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddTransaction
        isOpen={isFormOpen}
        onClose={handleFormClose}
        transaction={selectedTransaction}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionsPage;