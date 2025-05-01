import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

interface Registro {
  key: string;
  data: any;
}

const RegistrosList: React.FC = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/registros`);
        const data = await res.json();
        const registrosConDatos: Registro[] = [];

        for (const key of data.registros) {
          const resDetail = await fetch(`${API_BASE_URL}/registro/${encodeURIComponent(key)}`);
          const detalle = await resDetail.json();
          registrosConDatos.push({ key, data: detalle });
        }

        setRegistros(registrosConDatos);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error al obtener registros:', err);
        setError('Error al cargar los registros');
        setLoading(false);
      }
    };

    fetchRegistros();
  }, []);

  if (loading) {
    return <div className="text-center p-10 text-violet-700">⏳ Cargando registros...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">❌ {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-violet-800">📂 Registros Detallados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {registros.map((registro, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4 space-y-2">
            <h3 className="text-xl font-semibold text-violet-700">
              {registro.data.razonSocial || registro.key}
            </h3>
            <p className="text-sm text-gray-700">Representante: {registro.data.representanteLegal}</p>
            <p className="text-sm text-gray-700">Correo: {registro.data.correo}</p>
            <div className="mt-2">
              <h4 className="text-sm font-semibold text-violet-600">Archivos relacionados:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>INE</li>
                <li>Comprobante de Domicilio</li>
                <li>Constancia RFC</li>
                <li>Acta Constitutiva</li>
                <li>Poder Notariado</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrosList;
