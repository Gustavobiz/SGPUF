// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Clientes from "../pages/Clientes";
import Projetos from "../pages/Projetos";

const tipo = localStorage.getItem("tipo");
const token = localStorage.getItem("token");

const isAuthenticated = () => !!token;

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <Clientes />
            </PrivateRoute>
          }
        />
        <Route
          path="/projetos"
          element={
            <PrivateRoute>
              <Projetos />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
