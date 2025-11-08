import React, { useState, useEffect } from 'react';
import { fetchProductos, fetchClientes, createOrden } from '../services/apiService';
import type { Producto, Cliente, NewOrderData } from '../types';

interface NewOrderModalProps {
  onClose: () => void;
  onOrderCreated: () => void;
  initialProductId?: number;
}

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewOrderModal: React.FC<NewOrderModalProps> = ({ onClose, onOrderCreated, initialProductId }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  
  // Form state
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId?.toString() || '');
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [cantidad, setCantidad] = useState<string>('1');
  const [prioridad, setPrioridad] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [ordenCompra, setOrdenCompra] = useState('');
  const [referencia, setReferencia] = useState('');
  const [materialDisponible, setMaterialDisponible] = useState<'Sí' | 'No'>('Sí');
  const [tiempoEstimado, setTiempoEstimado] = useState('');
  const [observacion, setObservacion] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [productosRes, clientesRes] = await Promise.all([
          fetchProductos(),
          fetchClientes()
        ]);
        setProductos(productosRes);
        setClientes(clientesRes);
        if (initialProductId) {
          setSelectedProductId(initialProductId.toString());
        } else if (productosRes.length > 0) {
          setSelectedProductId(productosRes[0].id.toString());
        }
        if (clientesRes.length > 0) {
            setSelectedClienteId(clientesRes[0].id.toString());
        }
      } catch (err) {
        setError('Error al cargar datos necesarios.');
      }
    };
    loadDropdownData();
  }, [initialProductId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedProductId || !selectedClienteId || !cantidad || !ordenCompra || !tiempoEstimado) {
      setError('Producto, cliente, cantidad, no. orden de compra y tiempo estimado son obligatorios.');
      return;
    }
    
    const orderData: NewOrderData = {
      producto_id: parseInt(selectedProductId, 10),
      cliente_id: parseInt(selectedClienteId, 10),
      cantidad: parseInt(cantidad, 10),
      prioridad,
      orden_compra: ordenCompra,
      referencia,
      material_disponible: materialDisponible,
      tiempo_estimado_dias: parseInt(tiempoEstimado, 10),
      observacion,
    };

    setLoading(true);
    try {
      await createOrden(orderData, productos, clientes);
      onOrderCreated();
    } catch (err: any) {
      setError(err.message || 'Error al crear la orden. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = !selectedProductId || !selectedClienteId || !cantidad || !ordenCompra || !tiempoEstimado || loading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Nueva Orden de Trabajo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="producto" className="block text-sm font-medium text-gray-700">Producto</label>
                  <select id="producto" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.codigoProducto})</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">Cliente</label>
                  <select id="cliente" value={selectedClienteId} onChange={(e) => setSelectedClienteId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre_cliente}</option>)}
                  </select>
                </div>
                
                <div>
                    <label htmlFor="ordenCompra" className="block text-sm font-medium text-gray-700">No. Orden Compra</label>
                    <input type="text" id="ordenCompra" value={ordenCompra} onChange={e => setOrdenCompra(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                    <label htmlFor="referencia" className="block text-sm font-medium text-gray-700">Referencia</label>
                    <input type="text" id="referencia" value={referencia} onChange={e => setReferencia(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                  <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">Cantidad</label>
                  <input type="number" id="cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" min="1"/>
                </div>

                <div>
                    <label htmlFor="tiempoEstimado" className="block text-sm font-medium text-gray-700">Tiempo Estimado (Días)</label>
                    <input type="number" id="tiempoEstimado" value={tiempoEstimado} onChange={e => setTiempoEstimado(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" min="0" />
                </div>
                
                <div>
                    <label htmlFor="materialDisponible" className="block text-sm font-medium text-gray-700">Material Disponible</label>
                    <select id="materialDisponible" value={materialDisponible} onChange={(e) => setMaterialDisponible(e.target.value as any)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                    </select>
                </div>

                <div>
                  <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">Prioridad</label>
                  <select id="prioridad" value={prioridad} onChange={(e) => setPrioridad(e.target.value as any)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
            </div>

            <div>
                <label htmlFor="observacion" className="block text-sm font-medium text-gray-700">Observaciones</label>
                <textarea id="observacion" value={observacion} onChange={e => setObservacion(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" rows={2}></textarea>
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
      </div>
    </div>
  );
};

export default NewOrderModal;