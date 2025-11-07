import React, { useState } from 'react';
import { createControlCalidad } from '../services/apiService';
import type { NewControlCalidadData } from '../types';

interface Props { onClose: () => void; onCreated: () => void; }

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewCalidadModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [ordenId, setOrdenId] = useState('');
  const [resultado, setResultado] = useState<'Aprobado' | 'Rechazado'>('Aprobado');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ordenId) {
        setError('El ID de la orden es obligatorio.');
        return;
    }
    setError('');
    setLoading(true);
    try {
        const data: NewControlCalidadData = { ordenId: parseInt(ordenId, 10), resultado, observaciones };
        await createControlCalidad(data);
        onCreated();
    } catch (err: any) {
        setError(err.message || 'Error al registrar la inspección.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
         <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Registrar Inspección de Calidad</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-center text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">ID de Orden</label>
            <input type="number" value={ordenId} onChange={e => setOrdenId(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resultado</label>
            <select value={resultado} onChange={e => setResultado(e.target.value as any)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
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
export default NewCalidadModal;
