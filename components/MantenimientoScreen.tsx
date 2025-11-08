import React, { useState, useEffect } from 'react';
import type { Mantenimiento } from '../types';
import { fetchMantenimientos } from '../services/apiService';
import NewMantenimientoModal from './NewMantenimientoModal';
import { parseDate } from '../utils/dateUtils';

const MantenimientoScreen: React.FC = () => {
    const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewModalOpen, setNewModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            setMantenimientos(await fetchMantenimientos());
        } catch (e) {
            setError('Error al cargar los mantenimientos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);
    
    const handleDataChange = () => {
        setNewModalOpen(false);
        loadData();
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Registro de Mantenimiento</h1>
                <button
                    onClick={() => setNewModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                    Nuevo Registro
                </button>
            </div>

            {loading && <div className="text-center p-4">Cargando...</div>}
            {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
            
            {!loading && !error && (
                 <div className="bg-white shadow rounded-lg overflow-x-auto">
                   <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Máquina/Equipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Programada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Técnico Responsable</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mantenimientos.map(m => (
                                <tr key={m.id_mantenimiento}>
                                    <td className="px-6 py-4 whitespace-nowrap">{m.maquina_equipo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {parseDate(m.fecha_programada)?.toLocaleDateString() || m.fecha_programada}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{m.tipo_mantenimiento}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{m.tecnico_responsable}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{m.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                   </table>
                </div>
            )}
            
            {isNewModalOpen && <NewMantenimientoModal onClose={() => setNewModalOpen(false)} onSuccess={handleDataChange} />}
        </>
    );
};
export default MantenimientoScreen;
