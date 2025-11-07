import React, { useState, useEffect, useCallback } from 'react';
import { fetchClientes } from '../services/apiService';
import type { Cliente } from '../types';
import NewClienteModal from './NewClienteModal';

const ClientesScreen: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const clientesRes = await fetchClientes();
      setClientes(clientesRes);
    } catch (err) {
      setError('Error al cargar los datos de los clientes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClienteCreated = () => {
    setIsModalOpen(false);
    loadData();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Añadir Cliente
        </button>
      </div>
      
      {loading && <div className="text-center">Cargando...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}

      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.nombre_cliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.contacto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.email}</td>
                </tr>
              ))}
               {clientes.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">No hay clientes registrados.</td>
                </tr>
               )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <NewClienteModal
          onClose={() => setIsModalOpen(false)}
          onClienteCreated={handleClienteCreated}
        />
      )}
    </>
  );
};

export default ClientesScreen;
