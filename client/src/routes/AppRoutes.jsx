import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Dashboard from '../pages/Dashboard';
import Projetos from '../pages/Projetos';
import Clientes from '../pages/Clientes';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/clientes" element={<Clientes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}