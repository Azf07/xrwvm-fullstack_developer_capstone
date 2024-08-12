import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dealers from "./components/Dealers/Dealers";

function App() {
  return (
    <Routes>
      {/* Route for the login page */}
      <Route path="/login" element={<LoginPanel />} />

      {/* Route for the registration page */}
      <Route path="/register" element={<Register />} />

      {/* Route for the dealers page */}
      <Route path="/dealers" element={<Dealers />} />

      {/* You can add more routes here for other components */}
    </Routes>
  );
}

export default App;

