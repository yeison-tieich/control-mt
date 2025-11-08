import React, { useState, useEffect, useCallback } from 'react';
import { fetchMantenimientos } from '../services/apiService';
import type { Mantenimiento } from '../types';
import NewMantenimientoModal from './NewMantenimientoModal';
import { parseDate } from '../utils/dateUtils';

const statusColors: { [key: string]: string } = {
  'Programado': 'bg-blue-100 text-blue-800',
  'En Proceso': 'bg-yellow-100 text-yellow-800',
  'Completado': 'bg-green-100 text-green-800',
};

const MantenimientoScreen: React.FC = () => {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMantenimientos();
      setMantenimientos(data);
    } catch (err) {
      setError('Error al cargar los mantenimientos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreated = () => {
    setIsModalOpen(false);
    loadData();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Mantenimiento</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Programar Mantenimiento
        </button>
      </div>
      
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}

      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Máquina</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Programada</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mantenimientos.map((m) => {
                const scheduledDate = parseDate(m.fecha_programada);
                return (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.maquina_nombre} ({m.maquina_codigo})</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{scheduledDate ? scheduledDate.toLocaleDateString() : 'Fecha inválida'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.tipo_mantenimiento}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[m.estado]}`}>
                          {m.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
               {mantenimientos.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">No hay mantenimientos programados.</td>
                </tr>
               )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <NewMantenimientoModal
          onClose={() => setIsModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
};

export default MantenimientoScreen;