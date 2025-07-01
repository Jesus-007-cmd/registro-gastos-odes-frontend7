// src/pages/admin/ReportesPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
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
  fecha: string; // ISO string
}

const API_URL = process.env.REACT_APP_API_URL!;

const ReportesPage: React.FC = () => {
  const [odes, setOdes] = useState<OdeS[]>([]);
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);

  const [desde, setDesde] = useState<string>(new Date().toISOString().slice(0, 10));
  const [hasta, setHasta] = useState<string>(new Date().toISOString().slice(0, 10));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga datos maestros
  useEffect(() => {
    (async () => {
      try {
        const [oRes, bRes, pRes] = await Promise.all([
          axios.get<{ odes: OdeS[] }>(`${API_URL}/odes`),
          axios.get<{ bancos: Banco[] }>(`${API_URL}/bancos`),
          axios.get<{ proveedores: Proveedor[] }>(`${API_URL}/proveedores`)
        ]);
        setOdes(oRes.data.odes);
        setBancos(bRes.data.bancos);
        setProveedores(pRes.data.proveedores);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar datos maestros');
      }
    })();
  }, []);

  // Fetch gastos y parse a números
  const fetchGastos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<{ gastos: any[] }>(`${API_URL}/gastos`);
      const parsed = data.gastos.map(g => ({
        ...g,
        cantidadGastada: Number(g.cantidadGastada),
        cantidadACobrar: Number(g.cantidadACobrar)
      }));
      setGastos(parsed as Gasto[]);
    } catch (err) {
      console.error(err);
      setError('Error al cargar gastos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrado por fecha
  const gastosFiltrados = useMemo(() => {
    const from = new Date(desde);
    const to = new Date(hasta);
    to.setHours(23, 59, 59, 999);
    return gastos.filter(g => {
      const f = new Date(g.fecha);
      return f >= from && f <= to;
    });
  }, [gastos, desde, hasta]);

  // Totales por banco
  const totalesPorBanco = useMemo(() => {
    const acc: Record<string, number> = {};
    gastosFiltrados.forEach(g => {
      acc[g.bancoId] = (acc[g.bancoId] || 0) + g.cantidadGastada;
    });
    return bancos.map(b => ({ id: b.id, nombre: b.nombre, totalGastado: acc[b.id] || 0 }));
  }, [gastosFiltrados, bancos]);

  // Totales por proveedor
  const totalesPorProveedor = useMemo(() => {
    const acc: Record<string, number> = {};
    gastosFiltrados.forEach(g => {
      acc[g.proveedorId] = (acc[g.proveedorId] || 0) + g.cantidadGastada;
    });
    return proveedores.map(p => ({ id: p.id, nombre: p.nombre, totalGastado: acc[p.id] || 0 }));
  }, [gastosFiltrados, proveedores]);

  // Totales por OdeS y %
  const totalesPorOdeS = useMemo(() => {
    const acc: Record<string, { gastado: number; cobrar: number }> = {};
    gastosFiltrados.forEach(g => {
      acc[g.odeSId] ??= { gastado: 0, cobrar: 0 };
      acc[g.odeSId].gastado += g.cantidadGastada;
      acc[g.odeSId].cobrar += g.cantidadACobrar;
    });
    return odes.map(o => {
      const datos = acc[o.id] || { gastado: 0, cobrar: 0 };
      const porcentaje = datos.cobrar > 0 ? (datos.gastado / datos.cobrar) * 100 : 0;
      return { id: o.id, numero: o.numero, gastado: datos.gastado, cobrar: datos.cobrar, porcentaje };
    });
  }, [gastosFiltrados, odes]);

  // Promedio de %
  const promedioPorcentaje = useMemo(() => {
    if (totalesPorOdeS.length === 0) return 0;
    const suma = totalesPorOdeS.reduce((sum, o) => sum + o.porcentaje, 0);
    return suma / totalesPorOdeS.length;
  }, [totalesPorOdeS]);

  return (
    <div className="p-6 md:ml-[220px]">
      <h2 className="text-3xl font-bold text-white mb-6">Reportes de Gastos</h2>

      <div className="bg-white/80 p-6 rounded-xl shadow-md max-w-xl mx-auto mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label>
            Desde: <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="border rounded px-2 py-1" />
          </label>
          <label>
            Hasta: <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="border rounded px-2 py-1" />
          </label>
        </div>
        <button onClick={fetchGastos} disabled={loading} className="bg-blue-800 text-white px-4 py-2 rounded">
          {loading ? 'Cargando…' : 'Generar reporte'}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </div>

      <div className="space-y-10 max-w-3xl mx-auto text-gray-100">
        <section>
          <h3 className="text-2xl mb-2">Total gastado por Banco</h3>
          <ul className="list-disc list-inside">
            {totalesPorBanco.map(b => (
              <li key={b.id}>{b.nombre}: ${b.totalGastado.toFixed(2)}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-2xl mb-2">Total gastado por Proveedor</h3>
          <ul className="list-disc list-inside">
            {totalesPorProveedor.map(p => (
              <li key={p.id}>{p.nombre}: ${p.totalGastado.toFixed(2)}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-2xl mb-2">Detalles por OdeS</h3>
          <table className="w-full table-auto border-collapse text-gray-900">
            <thead>
              <tr>
                <th className="border px-2 py-1">OdeS</th>
                <th className="border px-2 py-1">Gastado</th>
                <th className="border px-2 py-1">Cobrar</th>
                <th className="border px-2 py-1">% Gasto</th>
              </tr>
            </thead>
            <tbody>
              {totalesPorOdeS.map(o => (
                <tr key={o.id}>
                  <td className="border px-2 py-1">{o.numero}</td>
                  <td className="border px-2 py-1">${o.gastado.toFixed(2)}</td>
                  <td className="border px-2 py-1">${o.cobrar.toFixed(2)}</td>
                  <td className="border px-2 py-1">{o.porcentaje.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="text-2xl mb-2">Promedio mensual de % de gasto</h3>
          <p className="text-lg">{promedioPorcentaje.toFixed(2)}%</p>
        </section>
      </div>
    </div>
  );
};

export default ReportesPage;