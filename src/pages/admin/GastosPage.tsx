// src/pages/admin/GastosPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface OdeS { id: string; numero: string; }
interface Banco { id: string; nombre: string; }
interface Proveedor { id: string; nombre: string; }

interface Gasto {
    odeSId: string;
    bancoId: string;
    proveedorId: string;
    cantidadGastada: number;
    cantidadACobrar: number;
    fecha: string;
}
interface FullGasto {
    datos: Gasto;
    files: string[];
}

const API_URL = process.env.REACT_APP_API_URL!;

const GastosPage: React.FC = () => {
    // Catálogos y gastos
    const [odes, setOdes] = useState<OdeS[]>([]);
    const [bancos, setBancos] = useState<Banco[]>([]);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [gastos, setGastos] = useState<Gasto[]>([]);

    // Formulario
    const [odeSId, setOdeSId] = useState('');
    const [bancoId, setBancoId] = useState('');
    const [proveedorId, setProveedorId] = useState('');
    const [fecha, setFecha] = useState<string>(new Date().toISOString().slice(0, 10));
    const [cantidadGastada, setCantidadGastada] = useState<string>('');
    const [cantidadACobrar, setCantidadACobrar] = useState<string>('');
    const [factura, setFactura] = useState<File | null>(null);
    const [comprobante, setComprobante] = useState<File | null>(null);
    const [evidencia, setEvidencia] = useState<File | null>(null);

    // Mensajes UI
    const [successMsg, setSuccessMsg] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');

  
    // en tu componente React
    const [fullGastos, setFullGastos] = useState<FullGasto[]>([]);



    const fetchFullGastos = async () => {
        const { data } = await axios.get<{ gastos: FullGasto[] }>(
            `${API_URL}/gastos/full`
        );
        setFullGastos(data.gastos);
    };


    useEffect(() => {
        fetchFullGastos();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const odeParam = params.get('odeSId');
        if (odeParam) setOdeSId(odeParam);

        fetchAll();
        fetchGastos();
    }, []);

    /** Carga OdeS, Bancos y Proveedores */
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

    /** Carga todos los gastos */
    const fetchGastos = async () => {
        const { data } = await axios.get<{ gastos: Gasto[] }>(`${API_URL}/gastos`);
        setGastos(data.gastos);
    };

    /** Envío del formulario */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        form.append('odeSId', odeSId);
        form.append('bancoId', bancoId);
        form.append('proveedorId', proveedorId);
        form.append('fecha', fecha);
        form.append('cantidadGastada', String(parseFloat(cantidadGastada) || 0));
        form.append('cantidadACobrar', String(parseFloat(cantidadACobrar) || 0));
        if (factura) form.append('factura', factura);
        if (comprobante) form.append('comprobante', comprobante);
        if (evidencia) form.append('evidencia', evidencia);

        try {
            await axios.post(`${API_URL}/gastos/upload`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await axios.put(`${API_URL}/odes/${odeSId}/cobrar`);

            // limpiar y refrescar
            setCantidadGastada('');
            setCantidadACobrar('');
            setFactura(null);
            setComprobante(null);
            setEvidencia(null);
            setSuccessMsg('✅ Gasto registrado correctamente');
            setErrorMsg('');
            fetchGastos();
      
        } catch (err) {
            console.error(err);
            setErrorMsg('❌ Ocurrió un error al procesar el gasto');
            setSuccessMsg('');
        }
    };

 
    // ******** Calcular porcentaje total ********
    const gastosODE = gastos.filter(g => g.odeSId === odeSId);
    const totalGastado = gastosODE.reduce((sum, g) => sum + g.cantidadGastada, 0);
    const totalACobrar = gastosODE.reduce((sum, g) => sum + g.cantidadACobrar, 0);
    const porcentajeTotal =
        totalACobrar > 0
            ? (totalGastado / totalACobrar * 100).toFixed(2) + '%'
            : 'N/A';

    return (
        <div className="w-full p-6 md:ml-[220px] bg-cover bg-center min-h-screen">

            <h2 className="text-4xl font-extrabold text-white drop-shadow-lg mb-4">
                Registrar Gasto
            </h2>

            {/* Mensajes */}
            {successMsg && (
                <div className="max-w-2xl mx-auto mb-4 p-3 bg-green-100 text-green-800 rounded">
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="max-w-2xl mx-auto mb-4 p-3 bg-red-100 text-red-800 rounded">
                    {errorMsg}
                </div>
            )}

            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="relative bg-white/60 backdrop-blur-md p-8 rounded-2xl max-w-2xl mx-auto space-y-6 shadow-xl"
            >
                {/* Selecciones y fecha */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    {/* OdeS */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">OdeS</label>
                        <select
                            value={odeSId}
                            onChange={e => setOdeSId(e.target.value)}
                            required
                            className="w-full border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        >
                            <option value="">Selecciona OdeS</option>
                            {odes.map(o => (
                                <option key={o.id} value={o.id}>{o.numero}</option>
                            ))}
                        </select>
                    </div>
                    {/* Banco */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Banco</label>
                        <select
                            value={bancoId}
                            onChange={e => setBancoId(e.target.value)}
                            required
                            className="w-full border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        >
                            <option value="">Selecciona Banco</option>
                            {bancos.map(b => (
                                <option key={b.id} value={b.id}>{b.nombre}</option>
                            ))}
                        </select>
                    </div>
                    {/* Proveedor */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Proveedor</label>
                        <select
                            value={proveedorId}
                            onChange={e => setProveedorId(e.target.value)}
                            required
                            className="w-full border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        >
                            <option value="">Selecciona Proveedor</option>
                            {proveedores.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                    </div>
                    {/* Fecha */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date"
                            value={fecha}
                            onChange={e => setFecha(e.target.value)}
                            required
                            className="w-full border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>
                </div>

                {/* Montos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Gastada */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Cantidad gastada</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={cantidadGastada}
                            onChange={e => setCantidadGastada(e.target.value)}
                            required
                            className="w-full border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>
                    {/* A cobrar */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Cantidad a cobrar</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={cantidadACobrar}
                            onChange={e => setCantidadACobrar(e.target.value)}
                            required
                            className="w-full border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>
                </div>

                {/* Archivos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    {['factura', 'comprobante', 'evidencia'].map(name => (
                        <div key={name}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
                                {name}
                            </label>
                            <input
                                type="file"
                                onChange={e => {
                                    const f = e.target.files?.[0] || null;
                                    if (name === 'factura') setFactura(f);
                                    if (name === 'comprobante') setComprobante(f);
                                    if (name === 'evidencia') setEvidencia(f);
                                }}
                                className="w-full"
                            />
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                    📤 Subir Gasto
                </button>
            </form>

            {/* Porcentaje total */}
            <section className="mt-10 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Porcentaje total de gasto para OdeS {odeSId || '—'}
                </h3>
                <p className="text-gray-700 text-lg">{porcentajeTotal}</p>
            </section>


            <section className="mt-12 max-w-4xl mx-auto bg-white/90 p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Gastos completos</h3>
                {fullGastos.length === 0 ? (
                    <p className="text-gray-500">No hay gastos registrados aún.</p>
                ) : (
                    fullGastos.map(({ datos, files }) => (
                        <div key={datos.odeSId} className="mb-6 border-b pb-4 last:border-0">
                            <p><strong>OdeS:</strong> {datos.odeSId}</p>
                            <p>
                                <strong>Banco:</strong> {datos.bancoId} |&nbsp;
                                <strong>Proveedor:</strong> {datos.proveedorId} |&nbsp;
                                <strong>Fecha:</strong> {datos.fecha}
                            </p>
                            <p>
                                <strong>Gastado:</strong> {datos.cantidadGastada} |&nbsp;
                                <strong>A cobrar:</strong> {datos.cantidadACobrar}
                            </p>
                            <div className="mt-2">
                                <strong>Archivos:</strong>
                                {files.length === 0 ? (
                                    <span className="ml-2 text-gray-500">Sin archivos</span>
                                ) : (
                                    <ul className="list-disc list-inside mt-1">
                                        {files.map(fn => (
                                            <li key={fn}>
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        const { data } = await axios.get<{ url: string }>(
                                                            `${API_URL}/gastos/download/${datos.odeSId}/${fn}`
                                                        );
                                                        window.open(data.url, '_blank');
                                                    }}
                                                    className="text-blue-600 underline"
                                                >
                                                    📥 {fn}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </section>


        </div>
    );
};

export default GastosPage;
