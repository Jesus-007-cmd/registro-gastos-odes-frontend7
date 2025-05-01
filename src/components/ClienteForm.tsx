import React, { useState, useRef } from 'react';
// import axios from 'axios';
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

  // Refs para inputs de archivos
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

      // Limpiar campos después de enviar
      clearForm();
    } catch (err) {
      console.error('❌ Error al enviar datos:', err);
      alert('Error al enviar datos');
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
    // Limpiar inputs de archivo manualmente
    ineRef.current && (ineRef.current.value = '');
    comprobanteRef.current && (comprobanteRef.current.value = '');
    rfcRef.current && (rfcRef.current.value = '');
    actaRef.current && (actaRef.current.value = '');
    poderRef.current && (poderRef.current.value = '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-200 via-white to-violet-100 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 space-y-10">
        <h2 className="text-4xl font-extrabold text-center text-violet-800 mb-6">
          📄 Registro de Clientes 2025
        </h2>

        <div className="bg-white border border-violet-300 p-6 rounded-2xl shadow-md space-y-6">
          <h3 className="text-xl font-semibold text-violet-700">🧾 Datos Generales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="razonSocial" placeholder="Nombre o Razón Social" required onChange={handleChange} className="input" value={formData.razonSocial} />
            <input name="representanteLegal" placeholder="Representante Legal" required onChange={handleChange} className="input" value={formData.representanteLegal} />
            <input name="numeroEscritura" placeholder="Núm. de Escritura Pública" required onChange={handleChange} className="input" value={formData.numeroEscritura} />
            <input type="date" name="fechaEscritura" required onChange={handleChange} className="input" value={formData.fechaEscritura} />
            <input name="licenciado" placeholder="Licenciado que Registró" required onChange={handleChange} className="input" value={formData.licenciado} />
            <input name="numeroNotario" placeholder="Núm. de Notario Público" required onChange={handleChange} className="input" value={formData.numeroNotario} />
            <input name="estadoRegistro" placeholder="Estado de Registro" required onChange={handleChange} className="input" value={formData.estadoRegistro} />
            <input type="email" name="correo" placeholder="Correo Electrónico" required onChange={handleChange} className="input" value={formData.correo} />
            <input name="telefono" placeholder="Teléfono" required onChange={handleChange} className="input" value={formData.telefono} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <textarea name="domicilioFiscal" placeholder="Domicilio Fiscal" required onChange={handleChange} className="textarea" value={formData.domicilioFiscal} />
            <textarea name="domiciliosServicio" placeholder="Domicilios de Servicio" required onChange={handleChange} className="textarea" value={formData.domiciliosServicio} />
          </div>
        </div>

        <div className="bg-white border border-violet-300 p-6 rounded-2xl shadow-md space-y-6">
          <h3 className="text-xl font-semibold text-violet-700">📎 Documentos Requeridos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="label">INE del Representante*</label>
              <input type="file" name="ine" ref={ineRef} required onChange={handleFileChange} className="file-input" />
            </div>
            <div>
              <label className="label">Comprobante de Domicilio*</label>
              <input type="file" name="comprobanteDomicilio" ref={comprobanteRef} required onChange={handleFileChange} className="file-input" />
            </div>
            <div>
              <label className="label">Constancia RFC*</label>
              <input type="file" name="constanciaRFC" ref={rfcRef} required onChange={handleFileChange} className="file-input" />
            </div>
            <div>
              <label className="label">Acta Constitutiva*</label>
              <input type="file" name="actaConstitutiva" ref={actaRef} required onChange={handleFileChange} className="file-input" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Poder Notariado (opcional)</label>
              <input type="file" name="poderNotariado" ref={poderRef} multiple onChange={handleFileChange} className="file-input" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900 text-white font-bold text-lg transition shadow-lg"
        >
          Enviar 🚀
        </button>

        <button
          type="button"
          onClick={clearForm}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-bold text-lg transition shadow-lg mt-4"
        >
          Borrar Campos 🗑️
        </button>
      </form>
    </div>
  );
};

export default ClienteForm;
