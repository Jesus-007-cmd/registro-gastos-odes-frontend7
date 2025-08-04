import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import BancosPage from './pages/admin/BancosPage';
import ProveedoresPage from './pages/admin/ProveedoresPage';
import OdesPage from './pages/admin/OdesPage';
import GastosPage from './pages/admin/GastosPage';
import ReportesPage from './pages/admin/ReportesPage';
import SidebarResponsive from './components/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/main-background.webp')" }}>
        <SidebarResponsive />
        <main className="w-full md:ml-[220px] p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/bancos" element={<BancosPage />} />
            <Route path="/admin/odes" element={<OdesPage />} />
            <Route path="/admin/proveedores" element={<ProveedoresPage />} />
            <Route path="/admin/gastos" element={<GastosPage />} />
            <Route path="/admin/reportes" element={<ReportesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
