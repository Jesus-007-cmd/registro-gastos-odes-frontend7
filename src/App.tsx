import React, { useState } from 'react';
import ClienteForm from './components/ClienteForm';
import RegistrosList from './components/RegistroList';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">📋 Registro Clientes 2025</h1>
        <div className="space-x-4">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'form'
                ? 'bg-white text-blue-700'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            ➕ Nuevo Registro
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'list'
                ? 'bg-white text-blue-700'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            📂 Ver Registros
          </button>
        </div>
      </header>

      <main className="p-6">
        {activeTab === 'form' && <ClienteForm />}
        {activeTab === 'list' && <RegistrosList />}
      </main>

      <footer className="bg-blue-700 text-white text-center py-3 mt-10">
        © 2025 Registro Clientes — Creado con ❤️ por tu equipo
      </footer>
    </div>
  );
};

export default App;
