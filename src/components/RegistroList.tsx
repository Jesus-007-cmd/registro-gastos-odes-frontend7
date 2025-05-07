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

// Mapeo de claves para detectar conceptos
const archivoConceptos: Record<string, string> = {
  ine: 'INE del Representante',
  comprobante: 'Comprobante de Domicilio',
  rfc: 'Constancia RFC',
  acta: 'Acta Constitutiva',
  poder: 'Poder Notariado',
};

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

  const manejarDescarga = async (archivo: string, razonSocial: string, conceptoTexto: string) => {
    const signedUrl = await obtenerLinkFirmado(archivo);
    if (signedUrl) {
      const extension = archivo.split('.').pop() || 'pdf';
      const nombreArchivo = `${razonSocial}-${conceptoTexto}.${extension}`;

      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('❌ No se pudo obtener el enlace de descarga');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-blue-700">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid mb-4"></div>
        <p className="text-lg font-semibold">Cargando registros…</p>
        <p className="text-sm text-gray-600">Puede tardar hasta 15 segundos</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">❌ {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">📋 Registros Detallados</h2>
      <div className="grid grid-cols-1 gap-8">
        {registros.map((registro, idx) => {
          const detalle = registro.registro ? detalles[registro.registro] : null;
          const archivosUnicos = registro.archivos
            ? registro.archivos.filter((item, index, self) => self.indexOf(item) === index)
            : [];

          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg border border-blue-300 p-4  md:grid md:grid-cols-2 md:gap-8"
            >
              {/* Columna izquierda */}
              <div className="flex flex-col justify-between  space-y-2">
              <h3 className="text-xl md:text-2xl font-semibold text-blue-700 mb-2">
                  {detalle?.razonSocial || 'Sin datos principales'}
                </h3>
                {detalle ? (
                   <div className="bg-gray-50 rounded  text-sm">
                    <p><strong className="text-blue-600">👤 Representante Legal:</strong> {detalle.representanteLegal}</p>
                    <p><strong className="text-blue-600">📑 Número Escritura:</strong> {detalle.numeroEscritura}</p>
                    <p><strong className="text-blue-600">📅 Fecha de registro de escritura pública:</strong> {detalle.fechaEscritura}</p>
                    <p><strong className="text-blue-600">⚖️ Licenciado:</strong> {detalle.licenciado}</p>
                    <p><strong className="text-blue-600">✒️ Número Notario:</strong> {detalle.numeroNotario}</p>
                    <p><strong className="text-blue-600">🏛️ Estado Registro:</strong> {detalle.estadoRegistro}</p>
                    <p><strong className="text-blue-600">🏠 Domicilio Fiscal:</strong> {detalle.domicilioFiscal}</p>
                    <p><strong className="text-blue-600">📍 Domicilios de Servicio:</strong> {detalle.domiciliosServicio}</p>
                    <p><strong className="text-blue-600">📧 Correo:</strong> {detalle.correo}</p>
                    <p><strong className="text-blue-600">📞 Teléfono:</strong> {detalle.telefono}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No se encontraron datos principales.</p>
                )}
              </div>

              {/* Columna derecha */}
              <div className="flex flex-col justify-start items-center w-full h-full">
                <h4 className="text-lg font-semibold text-orange-600 mb-4">📂 Archivos para descarga</h4>
                {archivosUnicos.length > 0 ? (
                  <div className="flex flex-col gap-3 w-full">
                    {archivosUnicos.map((archivo, i) => {
                      const claveDetectada = Object.keys(archivoConceptos).find(key =>
                        archivo.toLowerCase().includes(key)
                      );
                      const conceptoTexto = claveDetectada
                        ? archivoConceptos[claveDetectada]
                        : archivo.split('_').slice(1).join('_');

                      return (
                        <div key={i} className="flex items-center gap-3 justify-start w-full">
                          <button
                            onClick={() => manejarDescarga(archivo, detalle?.razonSocial || 'Empresa', conceptoTexto)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow transition"
                          >
                            ⬇️
                          </button>
                          <span className="text-blue-700 text-sm break-words">{conceptoTexto}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center w-full">No hay archivos disponibles</p>
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
