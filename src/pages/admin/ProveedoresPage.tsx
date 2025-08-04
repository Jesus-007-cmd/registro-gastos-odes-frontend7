// src/pages/admin/ProveedoresPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Proveedor {
  id: string;
  nombre: string;
}

interface ApiResponse {
  proveedores: Proveedor[];
}

const API_URL = process.env.REACT_APP_API_URL!;

const ProveedoresPage: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [nombre, setNombre] = useState('');

  // edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const { data } = await axios.get<ApiResponse>(`${API_URL}/proveedores`);
      setProveedores(data.proveedores);
    } catch (err) {
      console.error(err);
    }
  };

  const agregarProveedor = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`${API_URL}/proveedores`, { nombre });
    setNombre('');
    fetchProveedores();
  };

  const eliminarProveedor = async (id: string) => {
    await axios.delete(`${API_URL}/proveedores/${id}`);
    setProveedores(proveedores.filter(p => p.id !== id));
  };

  const startEdit = (p: Proveedor) => {
    setEditingId(p.id);
    setEditNombre(p.nombre);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNombre('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await axios.put(`${API_URL}/proveedores/${editingId}`, { nombre: editNombre });
    setProveedores(proveedores.map(p =>
      p.id === editingId ? { ...p, nombre: editNombre } : p
    ));
    cancelEdit();
  };

  return (
    <div className="w-full p-4 sm:p-6 md:ml-[220px]">

      <h2 className="text-3xl font-bold text-white mb-6">Gestión de Proveedores</h2>

      <form onSubmit={agregarProveedor} className="bg-white/80 p-6 rounded-xl max-w-xl w-full mx-auto space-y-4"
>
        <label className="block mb-1">Nombre del Proveedor</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <button className="bg-blue-800 text-white px-4 py-2 rounded">➕ Agregar Proveedor</button>
      </form>

      <ul className="mt-10 space-y-3 max-w-xl w-full mx-auto">

        {proveedores.map(p => (
          <li key={p.id} className="bg-white/80 p-4 rounded-lg">
            {editingId === p.id ? (
              <>
                <input
                  className="w-full mb-2 border rounded px-2 py-1"
                  value={editNombre}
                  onChange={e => setEditNombre(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="bg-green-600 text-white px-3 py-1 rounded">💾 Guardar</button>
                  <button onClick={cancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded">✖️ Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>Proveedor:</strong> {p.nombre}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button onClick={() => startEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded">✏️ Editar</button>
                  <button onClick={() => eliminarProveedor(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">🗑️ Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProveedoresPage;
