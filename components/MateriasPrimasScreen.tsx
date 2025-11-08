import React, { useState, useEffect } from 'react';
import type { MateriaPrima } from '../types';
import { fetchMateriasPrimas } from '../services/apiService';
import NewMateriaPrimaModal from './NewMateriaPrimaModal';

const MateriasPrimasScreen: React.FC = () => {
    const [materias, setMaterias] = useState<MateriaPrima[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewModalOpen, setNewModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            setMaterias(await fetchMateriasPrimas());
        } catch(e) {
            setError('Error al cargar materias primas.');
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
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Materia Prima</h1>
                <button
                    onClick={() => setNewModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                    Añadir Materia Prima
                </button>
            </div>
            {loading && <div className="text-center p-4">Cargando...</div>}
            {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
            {!loading && !error && (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                   <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {materias.map(m => (
                                <tr key={m.material}>
                                    <td className="px-6 py-4 whitespace-nowrap">{m.material}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{m.descripcion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{m.cantidad_stock} {m.unidad_medida}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{m.proveedor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{m.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                   </table>
                </div>
            )}
            {isNewModalOpen && <NewMateriaPrimaModal onClose={() => setNewModalOpen(false)} onSuccess={handleDataChange} />}
        </>
    );
};

export default MateriasPrimasScreen;
