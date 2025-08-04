import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import MaramesaLogoTransparent from './MaramesaLogoTransparent';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const active = (path: string) =>
    location.pathname === path
      ? 'bg-maramesa-dark text-white'
      : 'text-maramesa-text hover:bg-maramesa-light';

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleLinkClick = () => {
    // Solo cierra el menú en móvil
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };
  
  return (
    <>
      {/* Botón menú solo en móvil */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleSidebar} className="text-white bg-blue-900 p-2 rounded">
          ☰
        </button>
      </div>

      {/* Sidebar permanente en escritorio, toggle en móvil */}
      <div
        className={`fixed top-0 left-0 h-full w-[220px] bg-gradient-to-b from-blue-900/80 via-blue-950/80 to-black/80 backdrop-blur-sm text-white shadow-lg z-40 transition-transform duration-300 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block`}
      >
        <div className="flex justify-center m-6 p-6">
          <MaramesaLogoTransparent />
        </div>

        <nav className="flex flex-col gap-2 px-4">
          <Link to="/admin" onClick={handleLinkClick} className={`rounded px-4 py-2 ${active('/admin')}`}>🏠 Dashboard</Link>
          <Link to="/admin/bancos" onClick={handleLinkClick} className={`rounded px-4 py-2 ${active('/admin/bancos')}`}>🏦 Bancos</Link>
          <Link to="/admin/proveedores" onClick={handleLinkClick} className={`rounded px-4 py-2 ${active('/admin/proveedores')}`}>🚚 Proveedores</Link>
          <Link to="/admin/odes" onClick={handleLinkClick} className={`rounded px-4 py-2 ${active('/admin/odes')}`}>📁 Órdenes de Servicio</Link>
          <Link to="/admin/gastos" onClick={handleLinkClick} className={`rounded px-4 py-2 ${active('/admin/gastos')}`}>💰 Gastos</Link>
          <Link to="/admin/reportes" onClick={handleLinkClick} className={`rounded px-4 py-2 ${active('/admin/reportes')}`}>📈 Reportes</Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
