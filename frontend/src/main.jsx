import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import AuthContextProvider from "./context/AuthContext";
import UserContextProvider from "./context/UserContext";

createRoot(document.getElementById("root")).render(
  <>
    <AuthContextProvider>
      <UserContextProvider>
        <BrowserRouter>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <App />
        </BrowserRouter>
      </UserContextProvider>
    </AuthContextProvider>
  </>
);
