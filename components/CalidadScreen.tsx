import React, { useState, useEffect, useCallback } from 'react';
import { fetchControlesCalidad } from '../services/apiService';
import type { ControlCalidad } from '../types';
import NewCalidadModal from './NewCalidadModal';

const CalidadScreen: React.FC = () => {
  const [items, setItems] = useState<ControlCalidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchControlesCalidad();
      setItems(data);
    } catch (err) {
      setError('Error al cargar controles de calidad.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Control de Calidad</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800">
          Registrar Inspección
        </button>
      </div>
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
      {!loading && !error && items.length === 0 && (
         <div className="text-center py-4 bg-white rounded-lg shadow-md text-gray-500">No hay inspecciones registradas.</div>
      )}
      {isModalOpen && <NewCalidadModal onClose={() => setIsModalOpen(false)} onCreated={() => { setIsModalOpen(false); loadData(); }} />}
    </>
  );
};
export default CalidadScreen;
