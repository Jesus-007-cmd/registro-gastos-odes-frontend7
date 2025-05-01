import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

interface Registro {
  registro: string | null;
  archivos: string[];
}

interface RegistroDetalle {
  razonSocial: string;
  representanteLegal: string;
  numeroEscritura: string;
  fechaEscritura: string;
  licenciado: string;
  numeroNotario: string;
  estadoRegistro: string;
  domicilioFiscal: string;
  domiciliosServicio: string;
  correo: string;
  telefono: string;
}

const RegistrosList: React.FC = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [detalles, setDetalles] = useState<Record<string, RegistroDetalle | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/registros`);
        const data = await res.json();
        setRegistros(data.registros);

        // Obtener detalles de cada registro
        const detallesData: Record<string, RegistroDetalle | null> = {};
        for (const reg of data.registros) {
          if (reg.registro) {
            const resDetalle = await fetch(`${API_BASE_URL}/registro/${encodeURIComponent(reg.registro)}`);
            const detalle = await resDetalle.json();
            detallesData[reg.registro] = detalle;
          }
        }
        setDetalles(detallesData);

        setLoading(false);
      } catch (err) {
        console.error('❌ Error al obtener registros:', err);
        setError('Error al cargar los registros');
        setLoading(false);
      }
    };

    fetchRegistros();
  }, []);

  const obtenerLinkFirmado = async (archivo: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/archivo/${encodeURIComponent(archivo)}`);
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error(`❌ Error al obtener link firmado para ${archivo}:`, err);
      return null;
    }
  };

  const manejarDescarga = async (archivo: string) => {
    const signedUrl = await obtenerLinkFirmado(archivo);
    if (signedUrl) {
      window.open(signedUrl, '_blank');
    } else {
      alert('❌ No se pudo obtener el enlace de descarga');
    }
  };

  if (loading) {
    return <div className="text-center p-10 text-violet-700">⏳ Cargando registros...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">❌ {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-violet-800">📂 Registros Detallados</h2>
      <div className="grid grid-cols-1 gap-8">
        {registros.map((registro, idx) => {
          const detalle = registro.registro ? detalles[registro.registro] : null;

          return (
            <div key={idx} className="bg-white rounded-xl shadow p-6 space-y-4 border border-violet-300">
              <h3 className="text-2xl font-semibold text-violet-700">
                {detalle?.razonSocial || 'Sin datos principales'}
              </h3>

              {detalle ? (
                <div className="bg-violet-50 p-4 rounded space-y-1 text-sm">
                  <p><strong>Representante Legal:</strong> {detalle.representanteLegal}</p>
                  <p><strong>Número Escritura:</strong> {detalle.numeroEscritura}</p>
                  <p><strong>Fecha Escritura:</strong> {detalle.fechaEscritura}</p>
                  <p><strong>Licenciado:</strong> {detalle.licenciado}</p>
                  <p><strong>Número Notario:</strong> {detalle.numeroNotario}</p>
                  <p><strong>Estado Registro:</strong> {detalle.estadoRegistro}</p>
                  <p><strong>Domicilio Fiscal:</strong> {detalle.domicilioFiscal}</p>
                  <p><strong>Domicilios de Servicio:</strong> {detalle.domiciliosServicio}</p>
                  <p><strong>Correo:</strong> {detalle.correo}</p>
                  <p><strong>Teléfono:</strong> {detalle.telefono}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No se encontraron datos principales.</p>
              )}

              <div>
                <h4 className="text-sm font-semibold text-violet-600 mb-2">Archivos relacionados:</h4>
                {registro.archivos.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {registro.archivos.map((archivo, i) => (
                      <button
                        key={i}
                        onClick={() => manejarDescarga(archivo)}
                        className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded shadow transition"
                      >
                        📥 {archivo.split('_').slice(1).join('_')}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No hay archivos adicionales</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrosList;
