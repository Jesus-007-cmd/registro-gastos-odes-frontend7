import { Link, useLocation } from 'react-router-dom';
import MaramesaLogoTransparent from './MaramesaLogoTransparent';

const Sidebar = () => {
  const location = useLocation();

  const active = (path: string) =>
    location.pathname === path
      ? 'bg-maramesa-dark text-white'
      : 'text-maramesa-text hover:bg-maramesa-light';

  return (
    <div className="fixed top-0 left-0 h-full w-[220px] bg-gradient-to-b from-blue-900/80 via-blue-950/80 to-black/80 backdrop-blur-sm text-white shadow-lg z-50">
      <div className="flex justify-center m-6 p-6">
        <MaramesaLogoTransparent />
      </div>

      <nav className="flex flex-col gap-2 px-4">
        <Link to="/admin" className={`rounded px-4 py-2 ${active('/admin')}`}>🏠 Dashboard</Link>
        <Link to="/admin/bancos" className={`rounded px-4 py-2 ${active('/admin/bancos')}`}>🏦 Bancos</Link>
        <Link to="/admin/proveedores" className={`rounded px-4 py-2 ${active('/admin/proveedores')}`}>🚚 Proveedores</Link>
        <Link to="/admin/odes" className={`rounded px-4 py-2 ${active('/admin/odes')}`}>📁 Ordenes de Servicio</Link>
        <Link to="/admin/gastos" className={`rounded px-4 py-2 ${active('/admin/gastos')}`}>💰 Gastos</Link>
        <Link to="/admin/reportes" className={`rounded px-4 py-2 ${active('/admin/reportes')}`}>📈 Reportes</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
