import React, { useState, useEffect, useMemo } from 'react';
import type { Cliente } from '../types';
import { fetchClientes } from '../services/apiService';
import NewClienteModal from './NewClienteModal';

const ClientesScreen: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewModalOpen, setNewModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchClientes();
            setClientes(data);
        } catch (err) {
            setError('Error al cargar los clientes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredClientes = useMemo(() => {
        return clientes.filter(c =>
            (c.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.empresa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.nit || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clientes, searchTerm]);

    const handleDataChange = () => {
        setNewModalOpen(false);
        loadData();
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
                <button
                    onClick={() => setNewModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                    Añadir Cliente
                </button>
            </div>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre, empresa o NIT..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                />
            </div>
            {loading && <div className="text-center p-4">Cargando...</div>}
            {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
            {!loading && !error && (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                   <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIT</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredClientes.map(c => (
                                <tr key={c.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{c.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{c.empresa || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{c.nit || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                   </table>
                </div>
            )}
            {isNewModalOpen && (
                <NewClienteModal
                    onClose={() => setNewModalOpen(false)}
                    onSuccess={handleDataChange}
                />
            )}
        </>
    );
};

export default ClientesScreen;