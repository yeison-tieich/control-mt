import React, { useState, useEffect } from 'react';
import type { Maquina } from '../types';
import { fetchMaquinas } from '../services/apiService';
import NewMaquinaModal from './NewMaquinaModal';

const statusColors: { [key: string]: string } = {
  'Operativa': 'bg-green-100 text-green-800',
  'En Mantenimiento': 'bg-yellow-100 text-yellow-800',
  'Fuera de Servicio': 'bg-red-100 text-red-800',
};

const MaquinasScreen: React.FC = () => {
    const [maquinas, setMaquinas] = useState<Maquina[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewModalOpen, setNewModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            setMaquinas(await fetchMaquinas());
        } catch(e) {
            setError('Error al cargar las máquinas');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { loadData() }, []);
    
    const handleDataChange = () => {
        setNewModalOpen(false);
        loadData();
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Máquinas</h1>
                <button
                    onClick={() => setNewModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                    Añadir Máquina
                </button>
            </div>

            {loading && <div className="text-center p-4">Cargando...</div>}
            {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {maquinas.map(maquina => (
                        <div key={maquina.cod_actual} className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-bold text-lg">{maquina.descripcion} ({maquina.cod_actual})</h3>
                            <p className="text-gray-600">Adquirida en: {maquina.adquirida_en}</p>
                            <div className="mt-2">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[maquina.estado] || 'bg-gray-100'}`}>
                                    {maquina.estado}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isNewModalOpen && <NewMaquinaModal onClose={() => setNewModalOpen(false)} onSuccess={handleDataChange} />}
        </>
    )
};
export default MaquinasScreen;
