import React, { useState, useEffect } from 'react';
import type { NewMantenimientoData, Maquina, Personal } from '../types';
import { createMantenimiento, fetchMaquinas, fetchPersonal } from '../services/apiService';

interface Props { onClose: () => void; onSuccess: () => void; }

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewMantenimientoModal: React.FC<Props> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<NewMantenimientoData>>({ tipo_mantenimiento: 'Preventivo' });
    const [maquinas, setMaquinas] = useState<Maquina[]>([]);
    const [personal, setPersonal] = useState<Personal[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [maquinasRes, personalRes] = await Promise.all([fetchMaquinas(), fetchPersonal()]);
                setMaquinas(maquinasRes);
                setPersonal(personalRes);
            } catch {
                setError('No se pudieron cargar datos necesarios.');
            }
        };
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.maquina_equipo || !formData.fecha_programada || !formData.tecnico_responsable || !formData.estado) {
            setError('Máquina, fecha, técnico y estado son obligatorios.');
            return;
        }
        setLoading(true);
        try {
            await createMantenimiento(formData as NewMantenimientoData);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al crear el registro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b"><h2 className="text-2xl font-bold text-primary">Nuevo Mantenimiento</h2></div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {error && <p className="text-red-500 bg-red-50 p-2 rounded-md text-sm">{error}</p>}
                    <select name="maquina_equipo" onChange={handleChange} className="w-full p-2 border rounded" required>
                        <option value="">Seleccione Máquina/Equipo *</option>
                        {maquinas.map(m => <option key={m.cod_actual} value={m.descripcion}>{m.descripcion}</option>)}
                    </select>
                     <select name="tecnico_responsable" onChange={handleChange} className="w-full p-2 border rounded" required>
                        <option value="">Seleccione Técnico Responsable *</option>
                        {personal.map(p => <option key={p.cedula} value={p.nombre}>{p.nombre}</option>)}
                    </select>
                    <input name="fecha_programada" type="date" onChange={handleChange} className="w-full p-2 border rounded" required/>
                    <select name="tipo_mantenimiento" value={formData.tipo_mantenimiento} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="Preventivo">Preventivo</option>
                        <option value="Correctivo">Correctivo</option>
                    </select>
                    <input name="estado" placeholder="Estado *" onChange={handleChange} className="w-full p-2 border rounded" required />
                    <textarea name="descripcion_mantenimiento" placeholder="Descripción del mantenimiento" onChange={handleChange} className="w-full p-2 border rounded" />
                    <textarea name="insumos_utilizados" placeholder="Insumos utilizados" onChange={handleChange} className="w-full p-2 border rounded" />
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

export default NewMantenimientoModal;
