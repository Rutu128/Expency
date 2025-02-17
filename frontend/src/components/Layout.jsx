import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Layout = () => {
  const { ping } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    handlePing();
  }, []);

  const handlePing = async () => {
    console.log("object");
    const isAuthenticated = await ping();
    if (!isAuthenticated) {
      toast.error("Authentication failed");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
