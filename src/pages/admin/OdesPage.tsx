// src/pages/admin/OdesPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
interface OdeS {
    id: string;
    numero: string;
    montoCobrar: number;
}

interface ApiResponse {
    odes: OdeS[];
}

const API_URL = process.env.REACT_APP_API_URL!;

const OdesPage: React.FC = () => {
    const [odes, setOdes] = useState<OdeS[]>([]);
    const [numero, setNumero] = useState('');
    const [montoCobrar, setMontoCobrar] = useState<number>(0);
    const navigate = useNavigate();
    // edición
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editNumero, setEditNumero] = useState('');
    const [editMontoCobrar, setEditMontoCobrar] = useState<number>(0);

    useEffect(() => {
        fetchOdes();
    }, []);

    const fetchOdes = async () => {
        try {
            const { data } = await axios.get<ApiResponse>(`${API_URL}/odes`);
            setOdes(data.odes);
        } catch (err) {
            console.error('Error al obtener Odes', err);
        }
    };

    const agregarOde = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/odes`, { numero, montoCobrar });
            setNumero('');
            setMontoCobrar(0);
            fetchOdes();
        } catch (err) {
            console.error('Error al agregar OdeS', err);
        }
    };

    const eliminarOde = async (id: string) => {
        await axios.delete(`${API_URL}/odes/${id}`);
        setOdes(odes.filter(o => o.id !== id));
    };

    const startEdit = (o: OdeS) => {
        setEditingId(o.id);
        setEditNumero(o.numero);
        setEditMontoCobrar(o.montoCobrar);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditNumero('');
        setEditMontoCobrar(0);
    };

    const saveEdit = async () => {
        if (!editingId) return;
        await axios.put(`${API_URL}/odes/${editingId}`, {
            numero: editNumero,
            montoCobrar: editMontoCobrar
        });
        setOdes(odes.map(o =>
            o.id === editingId
                ? { ...o, numero: editNumero, montoCobrar: editMontoCobrar }
                : o
        ));
        cancelEdit();
    };

    return (
        <div className="w-full p-4 sm:p-6 md:ml-[220px]">

            <h2 className="text-3xl font-bold text-white mb-6">Gestión de OdeS</h2>

            <form onSubmit={agregarOde} className="bg-white/80 p-6 rounded-xl space-y-4 max-w-xl mx-auto">
                <div>
                    <label className="block mb-1">Número de OdeS</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={numero}
                        onChange={e => setNumero(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Monto a cobrar</label>
                    <input
                        type="number"
                        className="w-full border rounded px-3 py-2"
                        value={montoCobrar}
                        onChange={e => setMontoCobrar(+e.target.value)}
                        required
                    />
                </div>
                <button className="bg-blue-800 text-white px-4 py-2 rounded">➕ Agregar OdeS</button>
            </form>

            <ul className="mt-10 space-y-3 max-w-xl w-full mx-auto">

                {odes.map(o => (
                    <li key={o.id} className="bg-white/80 p-4 rounded-lg">
                        {editingId === o.id ? (
                            <>
                                <input
                                    className="w-full mb-2 border rounded px-2 py-1"
                                    value={editNumero}
                                    onChange={e => setEditNumero(e.target.value)}
                                />
                                <input
                                    className="w-full mb-2 border rounded px-2 py-1"
                                    type="number"
                                    value={editMontoCobrar}
                                    onChange={e => setEditMontoCobrar(+e.target.value)}
                                />
                                <div className="flex flex-wrap gap-2 mt-2">

                                    <button onClick={saveEdit} className="bg-green-600 text-white px-3 py-1 rounded">💾 Guardar</button>
                                    <button onClick={cancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded">✖️ Cancelar</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p><strong>OdeS:</strong> {o.numero}</p>
                                <p><strong>Monto:</strong> ${o.montoCobrar}</p>
                                <div className="flex flex-wrap gap-2 mt-2">

                                    <button onClick={() => startEdit(o)} className="bg-yellow-500 text-white px-3 py-1 rounded">✏️ Editar</button>
                                    <button onClick={() => eliminarOde(o.id)} className="bg-red-600 text-white px-3 py-1 rounded">🗑️ Eliminar</button>
                                    <button
                                        onClick={() => navigate(`/admin/gastos?odeSId=${o.id}`)}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                                    >
                                        💵 Cobrar
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OdesPage;
