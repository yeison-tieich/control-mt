import React, { useState } from 'react';
import type { NewMaquinaData } from '../types';
import { createMaquina } from '../services/apiService';

interface Props { onClose: () => void; onSuccess: () => void; }

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewMaquinaModal: React.FC<Props> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<NewMaquinaData>>({ estado: 'Operativa' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.descripcion || !formData.cod_actual || !formData.adquirida_en) {
            setError('Descripción, código y fecha de adquisición son obligatorios.');
            return;
        }
        setLoading(true);
        try {
            await createMaquina(formData as NewMaquinaData);
            onSuccess();
        } catch(err: any) {
            setError(err.message || 'Error al crear la máquina');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
             <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-primary">Añadir Máquina</h2>
                     <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                </div>
                 <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                    <input name="descripcion" placeholder="Descripción *" onChange={handleChange} className="w-full p-2 border rounded" required/>
                    <input name="cod_actual" placeholder="Código Actual *" onChange={handleChange} className="w-full p-2 border rounded" required/>
                    <input name="adquirida_en" placeholder="Adquirida en (Año) *" type="text" onChange={handleChange} className="w-full p-2 border rounded" required/>
                    <select name="estado" value={formData.estado} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="Operativa">Operativa</option>
                        <option value="En Mantenimiento">En Mantenimiento</option>
                        <option value="Fuera de Servicio">Fuera de Servicio</option>
                    </select>
                     <textarea name="observaciones" placeholder="Observaciones" onChange={handleChange} className="w-full p-2 border rounded" />
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
export default NewMaquinaModal;
