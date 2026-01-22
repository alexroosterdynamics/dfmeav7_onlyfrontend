import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DFMEAProvider } from "./contexts/DFMEAContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DFMEAProvider>
      <App />
    </DFMEAProvider>
  </React.StrictMode>
);
