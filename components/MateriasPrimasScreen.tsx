import React, { useState, useEffect, useCallback } from 'react';
import { fetchMateriasPrimas } from '../services/apiService';
import type { MateriaPrima } from '../types';
import NewMateriaPrimaModal from './NewMateriaPrimaModal';

const MateriasPrimasScreen: React.FC = () => {
  const [materias, setMaterias] = useState<MateriaPrima[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMateriasPrimas();
      setMaterias(data);
    } catch (err) {
      setError('Error al cargar las materias primas.');
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
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Materia Prima</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Añadir Materia Prima
        </button>
      </div>
      
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}

      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {materias.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.proveedor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.stock} {m.unidad}</td>
                </tr>
              ))}
               {materias.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">No hay materias primas registradas.</td>
                </tr>
               )}
            </tbody>
          </table>
        </div>
      )}
      
      {isModalOpen && (
        <NewMateriaPrimaModal
          onClose={() => setIsModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
};

export default MateriasPrimasScreen;
