// src/pages/admin/GastosPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface OdeS { id: string; numero: string; }
interface Banco { id: string; nombre: string; }
interface Proveedor { id: string; nombre: string; }

interface Gasto {
  id?: string;
  odeSId: string;
  bancoId: string;
  proveedorId: string;
  cantidadGastada: number;
  cantidadACobrar: number;
  fecha: string;
}

const API_URL = process.env.REACT_APP_API_URL!;

const GastosPage: React.FC = () => {
  const [odes, setOdes] = useState<OdeS[]>([]);
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);

  // Form state
  const [odeSId, setOdeSId] = useState('');
  const [bancoId, setBancoId] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [cantidadGastada, setCantidadGastada] = useState<number>(0);
  const [cantidadACobrar, setCantidadACobrar] = useState<number>(0);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().slice(0,10));
  const [factura, setFactura] = useState<File|null>(null);
  const [comprobante, setComprobante] = useState<File|null>(null);
  const [evidencia, setEvidencia] = useState<File|null>(null);

  // Load query param + data on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const odeParam = params.get('odeSId');
    if (odeParam) setOdeSId(odeParam);

    fetchAll();
    fetchGastos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch OdeS, Bancos y Proveedores
  const fetchAll = async () => {
    const [oRes, bRes, pRes] = await Promise.all([
      axios.get<{ odes: OdeS[] }>(`${API_URL}/odes`),
      axios.get<{ bancos: Banco[] }>(`${API_URL}/bancos`),
      axios.get<{ proveedores: Proveedor[] }>(`${API_URL}/proveedores`)
    ]);
    setOdes(oRes.data.odes);
    setBancos(bRes.data.bancos);
    setProveedores(pRes.data.proveedores);
  };

  // Fetch Gastos list
  const fetchGastos = async () => {
    const { data } = await axios.get<{ gastos: Gasto[] }>(`${API_URL}/gastos`);
    setGastos(data.gastos);
  };

  // Handle form submit: upload gasto + mark OdeS as cobrada
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('odeSId', odeSId);
    form.append('bancoId', bancoId);
    form.append('proveedorId', proveedorId);
    form.append('cantidadGastada', String(cantidadGastada));
    form.append('cantidadACobrar', String(cantidadACobrar));
    form.append('fecha', fecha);
    if (factura)    form.append('factura', factura);
    if (comprobante) form.append('comprobante', comprobante);
    if (evidencia)   form.append('evidencia', evidencia);

    try {
      // 1️⃣ Subir gasto y archivos
      await axios.post(`${API_URL}/gastos/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 2️⃣ Marcar OdeS como cobrada
      await axios.put(`${API_URL}/odes/${odeSId}/cobrar`);

      // 3️⃣ Reset form fields
      setCantidadGastada(0);
      setCantidadACobrar(0);
      setFactura(null);
      setComprobante(null);
      setEvidencia(null);

      // 4️⃣ Refrescar lista de gastos
      fetchGastos();
    } catch (err) {
      console.error('Error al registrar gasto o marcar OdeS:', err);
      alert('Ocurrió un error al procesar el gasto. Revisa la consola para más detalles.');
    }
  };

  // Calcular porcentaje de gasto por OdeS
  const porcentajes = React.useMemo(() => {
    const acc: Record<string, { gastado: number; cobrar: number }> = {};
    gastos.forEach(g => {
      acc[g.odeSId] ??= { gastado: 0, cobrar: 0 };
      acc[g.odeSId].gastado += g.cantidadGastada;
      acc[g.odeSId].cobrar  += g.cantidadACobrar;
    });
    return Object.entries(acc).map(([odeSId, { gastado, cobrar }]) => ({
      odeSId,
      porcentaje: cobrar > 0 ? (gastado / cobrar) * 100 : 0
    }));
  }, [gastos]);

  return (
    <div className="p-6 md:ml-[220px]">
      <h2 className="text-3xl font-bold text-white mb-6">Registrar Gasto</h2>

      <form onSubmit={handleSubmit} className="bg-white/80 p-6 rounded-xl max-w-2xl mx-auto space-y-4">
        {/* Selecciones y fecha */}
        <div className="grid grid-cols-2 gap-4">
          <select
            className="border rounded px-2 py-1"
            value={odeSId}
            onChange={e => setOdeSId(e.target.value)}
            required
          >
            <option value="">Selecciona OdeS</option>
            {odes.map(o => (
              <option key={o.id} value={o.id}>{o.numero}</option>
            ))}
          </select>

          <select
            className="border rounded px-2 py-1"
            value={bancoId}
            onChange={e => setBancoId(e.target.value)}
            required
          >
            <option value="">Selecciona Banco</option>
            {bancos.map(b => (
              <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>

          <select
            className="border rounded px-2 py-1"
            value={proveedorId}
            onChange={e => setProveedorId(e.target.value)}
            required
          >
            <option value="">Selecciona Proveedor</option>
            {proveedores.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>

          <input
            type="date"
            className="border rounded px-2 py-1"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            required
          />
        </div>

        {/* Montos */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Cantidad gastada"
            className="border rounded px-3 py-2"
            value={cantidadGastada}
            onChange={e => setCantidadGastada(+e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Cantidad a cobrar"
            className="border rounded px-3 py-2"
            value={cantidadACobrar}
            onChange={e => setCantidadACobrar(+e.target.value)}
            required
          />
        </div>

        {/* Archivos */}
        <div className="grid grid-cols-3 gap-4">
          <input type="file" onChange={e => setFactura(e.target.files?.[0] ?? null)} />
          <input type="file" onChange={e => setComprobante(e.target.files?.[0] ?? null)} />
          <input type="file" onChange={e => setEvidencia(e.target.files?.[0] ?? null)} />
        </div>

        <button
          type="submit"
          className="bg-blue-800 text-white px-4 py-2 rounded"
        >
          📤 Subir Gasto
        </button>
      </form>

      {/* Resultado: porcentaje por OdeS */}
      <section className="mt-10 max-w-2xl mx-auto">
        <h3 className="text-xl text-white mb-4">Porcentaje de gasto por OdeS</h3>
        <ul className="space-y-2 text-white">
          {porcentajes.map(p => (
            <li key={p.odeSId}>
              OdeS <strong>{p.odeSId}</strong>: {p.porcentaje.toFixed(2)}%
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default GastosPage;
