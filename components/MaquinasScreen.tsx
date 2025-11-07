import React, { useState, useEffect, useCallback } from 'react';
import { fetchMaquinas } from '../services/apiService';
import type { Maquina } from '../types';
import NewMaquinaModal from './NewMaquinaModal';

const MaquinasScreen: React.FC = () => {
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMaquinas();
      setMaquinas(data);
    } catch (err) {
      setError('Error al cargar los datos de las máquinas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Máquinas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800"
        >
          Añadir Máquina
        </button>
      </div>
      
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}

      {!loading && !error && (
         <div className="text-center py-4 bg-white rounded-lg shadow-md text-gray-500">No hay máquinas registradas. Añada una para comenzar.</div>
      )}
      
      {/* A table or card grid to display `maquinas` would go here */}

      {isModalOpen && (
        <NewMaquinaModal
          onClose={() => setIsModalOpen(false)}
          onMaquinaCreated={() => { setIsModalOpen(false); loadData(); }}
        />
      )}
    </>
  );
};
export default MaquinasScreen;
