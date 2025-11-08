import React, { useState, useEffect } from 'react';
import type { NewRegistroCalidadData, OrdenProduccion, Personal } from '../types';
import { createControlCalidad, fetchOrdenes, fetchPersonal } from '../services/apiService';

interface Props { onClose: () => void; onSuccess: () => void; }

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewCalidadModal: React.FC<Props> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<NewRegistroCalidadData>>({ aprobado_rechazado: 'Aprobado' });
    const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([]);
    const [personal, setPersonal] = useState<Personal[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [ordenesRes, personalRes] = await Promise.all([fetchOrdenes(), fetchPersonal()]);
                setOrdenes(ordenesRes);
                setPersonal(personalRes);
            } catch {
                setError('No se pudieron cargar datos necesarios.');
            }
        };
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumber = ['medida_1', 'medida_2'].includes(name);
        setFormData({ ...formData, [name]: isNumber ? parseFloat(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.no_ot || !formData.fecha_hora_inspeccion || !formData.responsable) {
            setError('Orden, fecha e inspector son obligatorios.');
            return;
        }
        setLoading(true);
        try {
            await createControlCalidad(formData as NewRegistroCalidadData);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al crear el control.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b"><h2 className="text-2xl font-bold text-primary">Nuevo Control de Calidad</h2></div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {error && <p className="text-red-500 bg-red-50 p-2 text-sm rounded-md">{error}</p>}
                    <select name="no_ot" onChange={handleChange} className="w-full p-2 border rounded" required>
                        <option value="">Seleccione No. OT *</option>
                        {ordenes.map(o => <option key={o.no_ot} value={o.no_ot}>#{o.no_ot} - {o.descripcion}</option>)}
                    </select>
                    <select name="responsable" onChange={handleChange} className="w-full p-2 border rounded" required>
                        <option value="">Seleccione Responsable *</option>
                        {personal.map(p => <option key={p.cedula} value={p.nombre}>{p.nombre}</option>)}
                    </select>
                    <input name="fecha_hora_inspeccion" type="datetime-local" onChange={handleChange} className="w-full p-2 border rounded" required/>
                    <input name="proceso_inspeccionado" placeholder="Proceso Inspeccionado" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input name="pieza" placeholder="Pieza" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input name="tipo_verificacion" placeholder="Tipo de Verificación" onChange={handleChange} className="w-full p-2 border rounded" />
                    <input name="verificacion_visual" placeholder="Verificación Visual" onChange={handleChange} className="w-full p-2 border rounded" />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="medida_1" type="number" step="0.01" placeholder="Medida 1" onChange={handleChange} className="w-full p-2 border rounded" />
                        <input name="medida_2" type="number" step="0.01" placeholder="Medida 2" onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <select name="aprobado_rechazado" value={formData.aprobado_rechazado} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="Aprobado">Aprobado</option>
                        <option value="Rechazado">Rechazado</option>
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

export default NewCalidadModal;
