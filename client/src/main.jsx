import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  </React.StrictMode>
);
