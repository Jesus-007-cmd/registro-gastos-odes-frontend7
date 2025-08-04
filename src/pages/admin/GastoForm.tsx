import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// 🔧 Comentarios importantes:
// - Los select deberían obtener sus opciones desde endpoints como:
//   - GET /api/odes
//   - GET /api/bancos
//   - GET /api/proveedores
// - El formulario debería enviarse a:
//   - POST /api/gastos

const GastoForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    odeS: '',
    banco: '',
    proveedor: '',
    fecha: '',
    cantidadGasto: '',
    cantidadCobrar: '',
  });

  const [archivos, setArchivos] = useState({
    factura: null as File | null,
    comprobante: null as File | null,
    evidencia: null as File | null,
  });

  const facturaRef = useRef<HTMLInputElement>(null);
  const comprobanteRef = useRef<HTMLInputElement>(null);
  const evidenciaRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setArchivos(prev => ({ ...prev, [name]: files?.[0] || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    Object.entries(archivos).forEach(([key, file]) => {
      if (file) form.append(key, file);
    });

    try {
      // await fetch('/api/gastos', { method: 'POST', body: form });
      alert('✅ Gasto registrado (mock)');
      navigate('/admin');
    } catch (error) {
      alert('❌ Error al registrar gasto');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-blue-700 text-center">🧾 Nuevo Gasto</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="odeS" value={formData.odeS} onChange={handleChange} required className="border rounded-lg p-2">
            <option value="">Seleccionar OdeS</option>
            <option value="1000">OdeS 1000</option>
            <option value="1001">OdeS 1001</option>
          </select>

          <select name="banco" value={formData.banco} onChange={handleChange} required className="border rounded-lg p-2">
            <option value="">Seleccionar Banco</option>
            <option value="banamex">Banamex</option>
            <option value="banorte">Banorte</option>
          </select>

          <select name="proveedor" value={formData.proveedor} onChange={handleChange} required className="border rounded-lg p-2">
            <option value="">Seleccionar Proveedor</option>
            <option value="ferreteria">Ferretería</option>
            <option value="refacciones">Refacciones</option>
          </select>

          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required className="border rounded-lg p-2" />

          <input type="number" name="cantidadGasto" placeholder="Cantidad Gastada" value={formData.cantidadGasto} onChange={handleChange} required className="border rounded-lg p-2" />

          <input type="number" name="cantidadCobrar" placeholder="Cantidad a Cobrar" value={formData.cantidadCobrar} onChange={handleChange} required className="border rounded-lg p-2" />
        </div>

        <div className="space-y-3">
          <label className="block">Subir Factura *</label>
          <input type="file" name="factura" ref={facturaRef} required accept="image/*,.pdf" onChange={handleFileChange} className="file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-200 file:text-blue-700" />

          <label className="block">Subir Comprobante *</label>
          <input type="file" name="comprobante" ref={comprobanteRef} required accept="image/*,.pdf" onChange={handleFileChange} className="file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-200 file:text-blue-700" />

          <label className="block">Subir Evidencia de Compra *</label>
          <input type="file" name="evidencia" ref={evidenciaRef} required accept="image/*" capture="environment" onChange={handleFileChange} className="file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-200 file:text-blue-700" />
        </div>

        <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-lg shadow-md hover:from-blue-700 hover:to-blue-900">
          Registrar Gasto
        </button>
      </form>
    </div>
  );
};

export default GastoForm;