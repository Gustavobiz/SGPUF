import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthContainer from "../components/AuthContainer";
import Clientes from "../pages/Clientes";
import Projetos from "../pages/Projetos";
import Unidades from "../pages/Unidades";
import Vistorias from "../pages/Vistorias";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthContainer />} />
      <Route
        path="/projetos"
        element={
          <PrivateRoute>
            <Projetos />
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
        path="/unidades"
        element={
          <PrivateRoute>
            <Unidades />
          </PrivateRoute>
        }
      />
      <Route
        path="/vistorias"
        element={
          <PrivateRoute>
            <Vistorias />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
