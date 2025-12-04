import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthProvider";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
