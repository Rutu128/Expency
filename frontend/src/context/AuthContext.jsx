import { getApi, postApi } from "@/utils/api";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loding, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    const response = await postApi("/auth/login", {
      email,
      password,
    });
    setIsLoading(false);
    if (response.status === 200) {
      toast.success("Login successful");
      return true;
    }
    toast.error("Login failed");
    return false;
  };

  const register = async (data) => {
    setIsLoading(true);
    const response = await postApi("/auth/signup", data);
    setIsLoading(false);
    if (response.status === 200) {
      toast.success("Registration successful");
      return true;
    }

    toast.error("Registration failed");
    return false;
  };

  const ping = async () => {
    setIsLoading(true);
    const response = await getApi("/auth/");
    setIsLoading(false);
    if (response.status === 200) {
      setUser(response.data.data);
      console.log("user", user);
      return true;
    }
    setUser(null);
    return false;
  };

  const logout = async () => {
    setIsLoading(true);
    const response = await getApi("/auth/logout");
    setIsLoading(false);
    if (response.status === 200) {
      setUser(null);
      toast.success("Logout successful");
      return true;
    }
    toast.error("Logout failed");
    return false;
  };
  const ctxValue = {
    user,
    login,
    register,
    ping,
    logout,
    loding,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContextProvider;
