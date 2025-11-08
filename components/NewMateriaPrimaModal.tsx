import React, { useState } from 'react';
import type { NewMateriaPrimaData } from '../types';
import { createMateriaPrima } from '../services/apiService';

interface Props { onClose: () => void; onSuccess: () => void; }

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewMateriaPrimaModal: React.FC<Props> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<NewMateriaPrimaData>>({ estado: 'Disponible' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumber = ['cantidad_stock', 'peso_unitario_k', 'peso_k'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.material || !formData.unidad_medida) {
            setError('Material y unidad de medida son obligatorios.');
            return;
        }
        setLoading(true);
        try {
            await createMateriaPrima(formData as NewMateriaPrimaData);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al crear la materia prima.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-primary">Añadir Materia Prima</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {error && <p className="text-red-500 bg-red-50 p-2 text-sm rounded-md">{error}</p>}
                    <input name="material" placeholder="Material *" onChange={handleChange} className="w-full p-2 border rounded" required />
                    <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input name="cantidad_stock" type="number" placeholder="Cantidad en Stock" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input name="unidad_medida" placeholder="Unidad de Medida *" onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input name="peso_unitario_k" type="number" step="0.01" placeholder="Peso Unitario (K)" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input name="proveedor" placeholder="Proveedor" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input name="fecha_ingreso" type="date" onChange={handleChange} className="w-full p-2 border rounded" />
                    <select name="estado" value={formData.estado} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="Disponible">Disponible</option>
                        <option value="Reservado">Reservado</option>
                    </select>
                     <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancelar</button>
                        <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded disabled:bg-blue-300 flex items-center justify-center w-28">
                            {loading ? <Spinner/> : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewMateriaPrimaModal;
