import React, { useState, useEffect } from 'react';
import type { RegistroCalidad } from '../types';
import { fetchControlesCalidad } from '../services/apiService';
import NewCalidadModal from './NewCalidadModal';
import { parseDate } from '../utils/dateUtils';

const CalidadScreen: React.FC = () => {
    const [controles, setControles] = useState<RegistroCalidad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewModalOpen, setNewModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            setControles(await fetchControlesCalidad());
        } catch (e) {
            setError('Error al cargar los controles de calidad.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleDataChange = () => {
        setNewModalOpen(false);
        loadData();
    };
    
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Control de Calidad</h1>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. OT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proceso Inspeccionado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {controles.map(c => (
                                <tr key={c.id_reg_calidad}>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.no_ot}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.proceso_inspeccionado}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {parseDate(c.fecha_hora_inspeccion)?.toLocaleString() || c.fecha_hora_inspeccion}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.responsable}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.aprobado_rechazado === 'Aprobado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {c.aprobado_rechazado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                   </table>
                </div>
            )}
            {isNewModalOpen && <NewCalidadModal onClose={() => setNewModalOpen(false)} onSuccess={handleDataChange} />}
        </>
    );
};
export default CalidadScreen;
