import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import Layout from "./components/Layout"; // Fix: Import your custom Layout component
import DashboardPage from "./pages/dashboard/DashboardPage";
import TransactionsPage from "./pages/transaction/TransactionsPage";
import InsightsPage from "./pages/dashboard/InsightsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="insights" element={<InsightsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
