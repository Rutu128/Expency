import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  FiHome,
  FiTrendingUp,
  FiPieChart,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", icon: FiHome, label: "Dashboard" },
    { path: "/transactions", icon: FiTrendingUp, label: "Transactions" },
    { path: "/insights", icon: FiPieChart, label: "Insights" },
  ];

  const handleLogout = async () => {
    const isLogOut = await logout();
    if (isLogOut) {
      navigate("/login");
    }
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex items-center flex-shrink-0">
              <FaRupeeSign className="h-8 w-8 text-black" />
              <span className="ml-2 text-xl font-bold text-black">Expency</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                  location.pathname === item.path
                    ? "text-black bg-gray-300"
                    : "text-gray-600 hover:bg-gray-300 hover:text-black"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 ml-2"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn("md:hidden", isMobileMenuOpen ? "block" : "hidden")}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === item.path
                    ? "text-black bg-gray-300"
                    : "text-gray-600 hover:bg-gray-300 hover:text-black"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200"
            >
              <FiLogOut className="mr-3 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
