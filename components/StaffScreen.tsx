import React, { useState, useEffect, useMemo } from 'react';
import type { Personal } from '../types';
import { fetchPersonal } from '../services/apiService';
import NewStaffModal from './NewStaffModal';

const StaffCard: React.FC<{ personal: Personal; onClick: () => void; }> = ({ personal, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 cursor-pointer"
    >
        <p className="font-bold text-gray-800">{personal.nombre}</p>
        <p className="text-sm text-secondary font-semibold">{personal.cargo}</p>
        <p className="text-sm text-gray-500 mt-2">Cédula: {personal.cedula}</p>
    </div>
);

const StaffScreen: React.FC = () => {
    const [personal, setPersonal] = useState<Personal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewStaffModalOpen, setNewStaffModalOpen] = useState(false);
    
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPersonal();
            setPersonal(data);
        } catch (err) {
            setError('Error al cargar el personal.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredPersonal = useMemo(() => {
        return personal.filter(p => 
            (p.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.cargo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.cedula || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [personal, searchTerm]);

    const handleDataChange = () => {
        setNewStaffModalOpen(false);
        loadData();
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Personal</h1>
                <button
                    onClick={() => setNewStaffModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
                >
                    Añadir Personal
                </button>
            </div>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre, cargo o cédula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                />
            </div>
            {loading && <div className="text-center p-4">Cargando...</div>}
            {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredPersonal.map(p => (
                        <StaffCard key={p.cedula} personal={p} onClick={() => { /* Open detail modal in future */ }} />
                    ))}
                </div>
            )}
            {isNewStaffModalOpen && (
                <NewStaffModal
                    onClose={() => setNewStaffModalOpen(false)}
                    onSuccess={handleDataChange}
                />
            )}
        </>
    );
};

export default StaffScreen;