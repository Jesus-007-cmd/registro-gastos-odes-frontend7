import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Banco {
  id: string;
  nombre: string;
  cuenta: string;
}

interface ApiResponse {
  bancos: Banco[];
}

const API_URL = process.env.REACT_APP_API_URL!;

const BancosPage: React.FC = () => {
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [nombre, setNombre] = useState('');
  const [cuenta, setCuenta] = useState('');

  // Para edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editCuenta, setEditCuenta] = useState('');

  // Estados de carga y error
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1️⃣ Obtener bancos
  const fetchBancos = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data } = await axios.get<ApiResponse>(`${API_URL}/bancos`);
      setBancos(data.bancos);
    } catch (err: any) {
      setErrorMsg('No se pudieron cargar los bancos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Agregar banco
  const agregarBanco = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await axios.post(`${API_URL}/bancos`, { nombre, cuenta });
      setNombre('');
      setCuenta('');
      fetchBancos();
    } catch (err: any) {
      setErrorMsg('Error al agregar banco');
      console.error(err);
    }
  };

  // 3️⃣ Eliminar banco
  const eliminarBanco = async (id: string) => {
    setErrorMsg(null);
    try {
      await axios.delete(`${API_URL}/bancos/${id}`);
      setBancos(bancos.filter(b => b.id !== id));
    } catch (err: any) {
      setErrorMsg('Error al eliminar banco');
      console.error(err);
    }
  };

  // 4️⃣ Iniciar edición
  const startEdit = (banco: Banco) => {
    setEditingId(banco.id);
    setEditNombre(banco.nombre);
    setEditCuenta(banco.cuenta);
  };

  // 5️⃣ Cancelar edición
  const cancelEdit = () => {
    setEditingId(null);
    setEditNombre('');
    setEditCuenta('');
  };

  // 6️⃣ Guardar edición
  const saveEdit = async () => {
    if (!editingId) return;
    setErrorMsg(null);
    try {
      await axios.put(`${API_URL}/bancos/${editingId}`, {
        nombre: editNombre,
        cuenta: editCuenta,
      });
      // Actualizar localmente
      setBancos(bancos.map(b =>
        b.id === editingId
          ? { ...b, nombre: editNombre, cuenta: editCuenta }
          : b
      ));
      cancelEdit();
    } catch (err: any) {
      setErrorMsg('Error al actualizar banco');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBancos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 md:ml-[220px]">
      <h2 className="text-3xl font-bold text-white mb-6">Registrar Cuenta / Banco</h2>

      {errorMsg && (
        <div className="mb-4 text-red-300 bg-red-800/50 p-2 rounded">
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={agregarBanco}
        className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-md space-y-4 max-w-xl mx-auto"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Nombre del banco</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Número de cuenta</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={cuenta}
            onChange={e => setCuenta(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded transition"
          disabled={loading}
        >
          {loading ? 'Guardando…' : '➕ Guardar Banco'}
        </button>
      </form>

      <div className="mt-10 max-w-xl mx-auto">
        <h3 className="text-xl font-semibold text-white mb-4">Cuentas Registradas</h3>

        {loading && <p className="text-white">Cargando bancos…</p>}

        <ul className="space-y-3">
          {bancos.map(banco => (
            <li
              key={banco.id}
              className="bg-white/80 backdrop-blur-md border border-gray-200 p-4 rounded-lg shadow-sm text-gray-800"
            >
              {editingId === banco.id ? (
                <>
                  <input
                    type="text"
                    className="w-full mb-2 border px-2 py-1 rounded"
                    value={editNombre}
                    onChange={e => setEditNombre(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full mb-2 border px-2 py-1 rounded"
                    value={editCuenta}
                    onChange={e => setEditCuenta(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      💾 Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
                    >
                      ✖️ Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>🏦 Banco:</strong> {banco.nombre}</p>
                  <p><strong>🔢 Cuenta:</strong> {banco.cuenta}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => startEdit(banco)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarBanco(banco.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BancosPage;
