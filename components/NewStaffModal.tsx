import React, { useState } from 'react';
import type { NewPersonalData } from '../types';
import { createPersonal } from '../services/apiService';

interface NewStaffModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewStaffModal: React.FC<NewStaffModalProps> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<NewPersonalData>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.nombre || !formData.cedula || !formData.cargo) {
            setError('Nombre, cédula y cargo son obligatorios.');
            return;
        }

        setLoading(true);
        try {
            await createPersonal(formData as NewPersonalData);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al crear el empleado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-primary">Añadir Personal</h2>
                     <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">{error}</p>}
                    <input name="nombre" placeholder="Nombre *" onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input name="cedula" placeholder="Cédula *" onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input name="cargo" placeholder="Cargo *" onChange={handleChange} className="w-full p-2 border rounded" required />
                    <div className="pt-2 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded-lg disabled:bg-blue-300 flex items-center justify-center w-28">
                            {loading ? <Spinner /> : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewStaffModal;
