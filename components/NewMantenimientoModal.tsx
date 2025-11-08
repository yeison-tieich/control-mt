import React, { useState, useEffect } from 'react';
import { createMantenimiento, fetchMaquinas } from '../services/apiService';
import type { NewMantenimientoData, Maquina } from '../types';

interface Props { onClose: () => void; onCreated: () => void; }

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewMantenimientoModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [maquinaId, setMaquinaId] = useState('');
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState<'Preventivo' | 'Correctivo'>('Preventivo');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMaquinas = async () => {
        try {
            const data = await fetchMaquinas();
            setMaquinas(data);
            if (data.length > 0) {
                setMaquinaId(data[0].id.toString());
            }
        } catch(err) {
            setError('Error al cargar las máquinas');
        }
    }
    loadMaquinas();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maquinaId || !fecha || !descripcion) {
        setError('Todos los campos son obligatorios.');
        return;
    }
    setError('');
    setLoading(true);
    try {
        const data: NewMantenimientoData = { maquina_id: parseInt(maquinaId), fecha_programada: fecha, tipo_mantenimiento: tipo, descripcion };
        await createMantenimiento(data, maquinas);
        onCreated();
    } catch (err: any) {
        setError(err.message || 'Error al programar el mantenimiento.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Programar Mantenimiento</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-center text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Máquina</label>
            <select value={maquinaId} onChange={e => setMaquinaId(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                {maquinas.map(m => <option key={m.id} value={m.id}>{m.nombre} ({m.codigo})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Programada</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Mantenimiento</label>
            <select value={tipo} onChange={e => setTipo(e.target.value as any)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" rows={3}></textarea>
          </div>
          <div className="pt-2 flex justify-end space-x-3">
             <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
             <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:bg-blue-300 w-32 h-10 flex items-center justify-center">
                {loading ? <Spinner /> : 'Guardar'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NewMantenimientoModal;