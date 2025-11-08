import React, { useState, useEffect } from 'react';
import { fetchProductos, fetchClientes, createOrden } from '../services/apiService';
import type { Producto, Cliente, NewOrderData } from '../types';

interface NewOrderModalProps {
  onClose: () => void;
  onOrderCreated: () => void;
  initialProductId?: string; // product 'codigo' is now a string
}

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewOrderModal: React.FC<NewOrderModalProps> = ({ onClose, onOrderCreated, initialProductId }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  
  const [formData, setFormData] = useState<Partial<NewOrderData>>({
    prioridad: 'Media',
    material_disponible: 'Sí',
    cantidad_unidades: 1
  });

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
        
        // Pre-select product if initial id is provided
        const initialProduct = initialProductId ? productosRes.find(p => p.codigo === initialProductId) : null;
        if (initialProduct) {
          setFormData(prev => ({...prev, descripcion: initialProduct.producto}));
        }

      } catch (err) {
        setError('Error al cargar datos necesarios.');
      }
    };
    loadDropdownData();
  }, [initialProductId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = ['cantidad_unidades', 'tiempo_estimado_dias'].includes(name);
    setFormData(prev => ({
        ...prev,
        [name]: isNumber ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.cliente || !formData.descripcion || !formData.cantidad_unidades || !formData.no_orden_compra || !formData.tiempo_estimado_dias) {
      setError('Cliente, descripción, cantidad, no. orden de compra y tiempo estimado son obligatorios.');
      return;
    }
    
    setLoading(true);
    try {
      await createOrden(formData as NewOrderData);
      onOrderCreated();
    } catch (err: any) {
      setError(err.message || 'Error al crear la orden. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = !formData.cliente || !formData.descripcion || !formData.cantidad_unidades || !formData.no_orden_compra || !formData.tiempo_estimado_dias || loading;

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
                  <label className="block text-sm font-medium text-gray-700">Producto (Descripción)</label>
                  <select name="descripcion" value={formData.descripcion} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Seleccione Producto</option>
                    {productos.map(p => <option key={p.codigo} value={p.producto}>{p.producto} ({p.codigo})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cliente</label>
                  <select name="cliente" value={formData.cliente} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                     <option value="">Seleccione Cliente</option>
                    {clientes.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                  </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">No. Orden Compra</label>
                    <input type="text" name="no_orden_compra" value={formData.no_orden_compra || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Referencia</label>
                    <input type="text" name="referencia" value={formData.referencia || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                  <input type="number" name="cantidad_unidades" value={formData.cantidad_unidades || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" min="1"/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tiempo Estimado (Días)</label>
                    <input type="number" name="tiempo_estimado_dias" value={formData.tiempo_estimado_dias || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" min="0" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Material Disponible</label>
                    <select name="material_disponible" value={formData.material_disponible} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                    </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                  <select name="prioridad" value={formData.prioridad} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Material</label>
                    <input type="text" name="material" value={formData.material || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                <textarea name="observacion" value={formData.observacion || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" rows={2}></textarea>
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
