import React, { useState, useEffect } from 'react';
import { createOrden, fetchClientes, fetchProductos } from '../services/apiService';
import type { Cliente, Producto, NewOrderData } from '../types';

interface NewOrderModalProps {
  onClose: () => void;
  onOrderCreated: () => void;
  initialProductId?: number;
}

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewOrderModal: React.FC<NewOrderModalProps> = ({ onClose, onOrderCreated, initialProductId }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId?.toString() || '');
  const [cantidad, setCantidad] = useState('');
  const [prioridad, setPrioridad] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        setError('');
        const [clientesData, productosData] = await Promise.all([
          fetchClientes(),
          fetchProductos(),
        ]);
        setClientes(clientesData);
        setProductos(productosData);
      } catch (err) {
        setError('Error al cargar clientes y productos.');
      } finally {
        setDataLoading(false);
      }
    };
    loadDropdownData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedClientId || !selectedProductId || !cantidad) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    
    const orderData: NewOrderData = {
      clienteId: parseInt(selectedClientId, 10),
      productoId: parseInt(selectedProductId, 10),
      cantidadSolicitada: parseInt(cantidad, 10),
      prioridad,
    };
    
    if (isNaN(orderData.cantidadSolicitada) || orderData.cantidadSolicitada <= 0) {
      setError('La cantidad debe ser un número positivo.');
      return;
    }

    setLoading(true);
    try {
      await createOrden(orderData);
      onOrderCreated();
    } catch (err: any) {
      setError(err.message || 'Error al crear la orden. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = !selectedClientId || !selectedProductId || !cantidad || loading || dataLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Nueva Orden de Trabajo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        
        {dataLoading ? (
            <div className="p-6 text-center">Cargando datos...</div>
        ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">{error}</p>}
                
                <div>
                  <label htmlFor="client-select" className="block text-sm font-medium text-gray-700">Cliente</label>
                  <select
                    id="client-select"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="" disabled>Seleccione un cliente</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre_cliente}</option>)}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="product-select" className="block text-sm font-medium text-gray-700">Producto</label>
                  <select
                    id="product-select"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="" disabled>Seleccione un producto</option>
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>

                 <div>
                    <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700">Prioridad</label>
                    <select
                        id="priority-select"
                        value={prioridad}
                        onChange={(e) => setPrioridad(e.target.value as 'Baja' | 'Media' | 'Alta')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                    >
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Cantidad Solicitada</label>
                  <input
                    type="number"
                    id="quantity"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                    min="1"
                  />
                </div>
                
                <div className="pt-2 flex justify-end space-x-3">
                  <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                      Cancelar
                  </button>
                  <button type="submit" disabled={isFormInvalid} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center w-32 h-10 transition-colors">
                    {loading ? <Spinner /> : 'Crear Orden'}
                  </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default NewOrderModal;
