import React from "react";
import ReactDOM from "react-dom/client"; // React 18 için createRoot API'si
import SolanaWalletHealth from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <SolanaWalletHealth />
  </React.StrictMode>
);
