import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

const CATEGORIES = [
  { id: "FOOD", label: "Food & Dining", icon: "🍕", color: "bg-green-100 text-green-800" },
  { id: "ENTERTAINMENT", label: "Entertainment", icon: "🎬", color: "bg-purple-100 text-purple-800" },
  { id: "TRANSPORT", label: "Transport", icon: "🚗", color: "bg-blue-100 text-blue-800" },
  { id: "SHOPPING", label: "Shopping", icon: "🛍️", color: "bg-pink-100 text-pink-800" },
  { id: "UTILITIES", label: "Utilities", icon: "💡", color: "bg-yellow-100 text-yellow-800" },
  { id: "OTHER", label: "Other", icon: "📦", color: "bg-gray-100 text-gray-800" }
];

const TRANSACTION_TYPES = [
  { id: "ONLINE", label: "Online Payment", icon: CreditCard, color: "bg-blue-50 text-blue-700" },
  { id: "OFFLINE", label: "Cash Payment", icon: Wallet, color: "bg-green-50 text-green-700" }
];

const AddTransaction = ({ isOpen, onClose, transaction = null }) => {
  const { addTransaction, updateTransaction } = useUser();
  const [date, setDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("ONLINE");
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    transactionType: "ONLINE",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        amount: transaction.amount.toString(),
      });
      setDate(new Date(transaction.date));
      setSelectedCategory(transaction.category);
      setSelectedType(transaction.transactionType);
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        ...formData,
        date: date.toISOString(),
        category: selectedCategory,
        transactionType: selectedType,
      };

      if (transaction) {
        await updateTransaction({ ...transactionData, _id: transaction._id });
      } else {
        await addTransaction(transactionData);
      }
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      category: "",
      transactionType: "ONLINE",
    });
    setDate(new Date());
    setSelectedCategory("");
    setSelectedType("ONLINE");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {transaction ? "Edit Transaction" : "Add New Transaction"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center space-x-2 p-2 rounded-lg border transition-all",
                    selectedCategory === category.id
                      ? `${category.color} border-current`
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                  {selectedCategory === category.id && (
                    <Check className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-2">
              {TRANSACTION_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-lg border transition-all",
                      selectedType === type.id
                        ? type.color
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{type.label}</span>
                    {selectedType === type.id && (
                      <Check className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {transaction ? "Update" : "Add"} Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;