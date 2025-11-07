import React, { useState, useEffect, useCallback } from 'react';
import { fetchMantenimientos } from '../services/apiService';
import type { Mantenimiento } from '../types';
import NewMantenimientoModal from './NewMantenimientoModal';

const MantenimientoScreen: React.FC = () => {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMantenimientos();
      setMantenimientos(data);
    } catch (err) {
      setError('Error al cargar los mantenimientos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Mantenimiento</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800">
          Programar Mantenimiento
        </button>
      </div>
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
      {!loading && !error && mantenimientos.length === 0 && (
          <div className="text-center py-4 bg-white rounded-lg shadow-md text-gray-500">No hay mantenimientos programados.</div>
      )}
      {isModalOpen && <NewMantenimientoModal onClose={() => setIsModalOpen(false)} onCreated={() => { setIsModalOpen(false); loadData(); }} />}
    </>
  );
};
export default MantenimientoScreen;
