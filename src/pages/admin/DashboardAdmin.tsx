import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardAdmin() {
  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 sm:p-6">

      <h1 className="text-3xl font-bold mb-6 text-center">Panel de Administración</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <Link to="/admin/bancos" className="bg-white p-6 rounded shadow hover:bg-blue-100">
          <h2 className="text-xl font-semibold">🏦 Cuentas/Bancos</h2>
          <p className="text-gray-600">Registrar bancos o tarjetas desde los que se pagan los gastos.</p>
        </Link>

        <Link to="/admin/proveedores" className="bg-white p-6 rounded shadow hover:bg-green-100">
          <h2 className="text-xl font-semibold">🧾 Proveedores</h2>
          <p className="text-gray-600">Administrar proveedores de servicios o refacciones.</p>
        </Link>

        <Link to="/admin/odes" className="bg-white p-6 rounded shadow hover:bg-yellow-100">
          <h2 className="text-xl font-semibold">📋 Órdenes de Servicio</h2>
          <p className="text-gray-600">Registrar y consultar OdeS, y montos a cobrar.</p>
        </Link>

        <Link to="/admin/gastos" className="bg-white p-6 rounded shadow hover:bg-red-100">
          <h2 className="text-xl font-semibold">💸 Gastos</h2>
          <p className="text-gray-600">Asignar gasto a proveedor, banco y OdeS.</p>
        </Link>

        <Link to="/admin/reportes" className="bg-white p-6 rounded shadow hover:bg-purple-100">
          <h2 className="text-xl font-semibold">📊 Reportes</h2>
          <p className="text-gray-600">Ver gastos por fecha, banco, proveedor u OdeS.</p>
        </Link>
        <Link to="/admin/gasto-form" className="bg-white p-6 rounded shadow hover:bg-indigo-100">
          <h2 className="text-xl font-semibold">📝 Nuevo Gasto</h2>
          <p className="text-gray-600">Registrar gasto con archivos y evidencia.</p>
        </Link>

      </div>
    </div>
  );
}
