import React, { useState } from 'react';
import { createMateriaPrima } from '../services/apiService';
import type { NewMateriaPrimaData } from '../types';

interface Props { onClose: () => void; onCreated: () => void; }

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewMateriaPrimaModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [nombre, setNombre] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [stock, setStock] = useState('');
  const [unidad, setUnidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !proveedor || !stock || !unidad) {
        setError('Todos los campos son obligatorios.');
        return;
    }
    setError('');
    setLoading(true);
    try {
        const data: NewMateriaPrimaData = { nombre, proveedor, stock: parseInt(stock, 10), unidad };
        await createMateriaPrima(data);
        onCreated();
    } catch (err: any) {
        setError(err.message || 'Error al crear la materia prima.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Añadir Materia Prima</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-center text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" className="w-full p-2 border border-gray-300 rounded-md" />
          <input value={proveedor} onChange={e => setProveedor(e.target.value)} placeholder="Proveedor" className="w-full p-2 border border-gray-300 rounded-md" />
          <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="Stock Inicial" className="w-full p-2 border border-gray-300 rounded-md" min="0" />
          <input value={unidad} onChange={e => setUnidad(e.target.value)} placeholder="Unidad (kg, m, etc.)" className="w-full p-2 border border-gray-300 rounded-md" />
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
export default NewMateriaPrimaModal;
