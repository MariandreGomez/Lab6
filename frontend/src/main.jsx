import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css"; // si usas la paleta; créalo en src/theme.css

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);