import React, { useState } from 'react';
import { createMaquina } from '../services/apiService';
import type { NewMaquinaData } from '../types';

interface NewMaquinaModalProps {
  onClose: () => void;
  onMaquinaCreated: () => void;
}

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewMaquinaModal: React.FC<NewMaquinaModalProps> = ({ onClose, onMaquinaCreated }) => {
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState<'Operativa' | 'En Mantenimiento' | 'Fuera de Servicio'>('Operativa');
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !codigo || !ubicacion) {
        setError('Nombre, código y ubicación son obligatorios.');
        return;
    }
    setError('');
    setLoading(true);
    try {
      const data: NewMaquinaData = { nombre, codigo, estado, ubicacion };
      await createMaquina(data);
      onMaquinaCreated();
    } catch (err: any) {
      setError(err.message ||'Error al crear la máquina.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Añadir Máquina</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-center text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Código</label>
            <input value={codigo} onChange={e => setCodigo(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ubicación</label>
            <input value={ubicacion} onChange={e => setUbicacion(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select value={estado} onChange={e => setEstado(e.target.value as any)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
              <option value="Operativa">Operativa</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
              <option value="Fuera de Servicio">Fuera de Servicio</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:bg-blue-300 w-32 h-10 flex justify-center items-center">
                {loading ? <Spinner /> : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NewMaquinaModal;
