import React, { useState, useRef } from 'react';
import { API_BASE_URL } from '../config';

type FormData = {
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
};

type FileInputs = {
  ine: File | null;
  comprobanteDomicilio: File | null;
  constanciaRFC: File | null;
  actaConstitutiva: File | null;
  poderNotariado: File | null;
};

const ClienteForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    razonSocial: '',
    representanteLegal: '',
    numeroEscritura: '',
    fechaEscritura: '',
    licenciado: '',
    numeroNotario: '',
    estadoRegistro: '',
    domicilioFiscal: '',
    domiciliosServicio: '',
    correo: '',
    telefono: '',
  });

  const [fileData, setFileData] = useState<FileInputs>({
    ine: null,
    comprobanteDomicilio: null,
    constanciaRFC: null,
    actaConstitutiva: null,
    poderNotariado: null,
  });

  const [loading, setLoading] = useState(false);

  const ineRef = useRef<HTMLInputElement>(null);
  const comprobanteRef = useRef<HTMLInputElement>(null);
  const rfcRef = useRef<HTMLInputElement>(null);
  const actaRef = useRef<HTMLInputElement>(null);
  const poderRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFileData(prev => ({ ...prev, [name]: files?.[0] || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    Object.entries(fileData).forEach(([key, file]) => {
      if (file) form.append(key, file);
    });

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      console.log('✅ Respuesta backend:', data);
      alert(data.message);

      clearForm();
    } catch (err) {
      console.error('❌ Error al enviar datos:', err);
      alert('Error al enviar datos');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      razonSocial: '',
      representanteLegal: '',
      numeroEscritura: '',
      fechaEscritura: '',
      licenciado: '',
      numeroNotario: '',
      estadoRegistro: '',
      domicilioFiscal: '',
      domiciliosServicio: '',
      correo: '',
      telefono: '',
    });
    setFileData({
      ine: null,
      comprobanteDomicilio: null,
      constanciaRFC: null,
      actaConstitutiva: null,
      poderNotariado: null,
    });
    ineRef.current && (ineRef.current.value = '');
    comprobanteRef.current && (comprobanteRef.current.value = '');
    rfcRef.current && (rfcRef.current.value = '');
    actaRef.current && (actaRef.current.value = '');
    poderRef.current && (poderRef.current.value = '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center px-3 py-7 relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
          <p className="mt-4 text-blue-700 font-semibold">Registrando cliente...</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl px-3 py-7 space-y-10">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-6">
          📄 Registro de Clientes 2025
        </h2>

        <div className="bg-white border border-blue-300 px-2 py-6 rounded-2xl shadow-md space-y-6">
          <h3 className="text-xl font-semibold text-blue-700">🧾 Datos Generales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <input name="razonSocial" placeholder="Nombre o Razón Social" required onChange={handleChange} className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 " value={formData.razonSocial} />
            <input name="representanteLegal" placeholder="Representante Legal" required onChange={handleChange} className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.representanteLegal} />
            <input name="numeroEscritura" placeholder="Núm. de Escritura Pública" required onChange={handleChange} className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.numeroEscritura} />
            
            <div className="flex flex-col">
              <label htmlFor="fechaEscritura" className="text-sm font-medium text-blue-700 mb-1">
                Fecha de registro de escritura pública
              </label>
              <input
                type="date"
                id="fechaEscritura"
                name="fechaEscritura"
                required
                onChange={handleChange}
                className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.fechaEscritura}
              />
            </div>

            <input name="licenciado" placeholder="Licenciado que Registró" required onChange={handleChange} className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.licenciado} />
            <input name="numeroNotario" placeholder="Núm. de Notario Público" required onChange={handleChange} className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.numeroNotario} />
            <input name="estadoRegistro" placeholder="Estado de Registro" required onChange={handleChange} className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.estadoRegistro} />
            <input type="email" name="correo" placeholder="Correo Electrónico" required onChange={handleChange} className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.correo} />
            <input name="telefono" placeholder="Teléfono" required onChange={handleChange} className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.telefono} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <textarea name="domicilioFiscal" placeholder="Domicilio Fiscal" required onChange={handleChange} className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.domicilioFiscal} />
            <textarea name="domiciliosServicio" placeholder="Domicilios de Servicio" required onChange={handleChange} className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.domiciliosServicio} />
          </div>
        </div>

        <div className="bg-white border border-blue-300 p-6 rounded-2xl shadow-md space-y-6">
          <h3 className="text-xl font-semibold text-blue-700">📎 Documentos Requeridos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-blue-700 mb-1 block">INE del Representante*</label>
              <input type="file" name="ine" ref={ineRef} required onChange={handleFileChange} className="block w-full text-sm text-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700 mb-1 block">Comprobante de Domicilio*</label>
              <input type="file" name="comprobanteDomicilio" ref={comprobanteRef} required onChange={handleFileChange} className="block w-full text-sm text-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700 mb-1 block">Constancia RFC*</label>
              <input type="file" name="constanciaRFC" ref={rfcRef} required onChange={handleFileChange} className="block w-full text-sm text-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700 mb-1 block">Acta Constitutiva*</label>
              <input type="file" name="actaConstitutiva" ref={actaRef} required onChange={handleFileChange} className="block w-full text-sm text-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-blue-700 mb-1 block">Poder Notariado (opcional)</label>
              <input type="file" name="poderNotariado" ref={poderRef} multiple onChange={handleFileChange} className="block w-full text-sm text-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-lg transition shadow-lg ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white'}`}
        >
          {loading ? 'Enviando...' : 'Enviar 🚀'}
        </button>

        <button
          type="button"
          onClick={clearForm}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-lg transition shadow-lg mt-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white'}`}
        >
          Borrar Campos 🗑️
        </button>
      </form>
    </div>
  );
};

export default ClienteForm;
