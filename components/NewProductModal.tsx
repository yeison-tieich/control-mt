import React, { useState } from 'react';
import { createProducto } from '../services/apiService';
import type { NewProductoData } from '../types';

interface NewProductModalProps {
  onClose: () => void;
  onProductCreated: () => void;
}

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewProductModal: React.FC<NewProductModalProps> = ({ onClose, onProductCreated }) => {
  const [formData, setFormData] = useState<Partial<NewProductoData>>({});
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = e.target.type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? (value === '' ? '' : parseFloat(value)) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.producto || !formData.codigo) {
      setError('Nombre y código del producto son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      await createProducto(formData as NewProductoData);
      onProductCreated();
    } catch (err: any) {
      setError(err.message || 'Error al crear el producto. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = !formData.producto || !formData.codigo || loading;

  const InputField: React.FC<{name: keyof NewProductoData, label: string, type?: string, required?: boolean}> = ({name, label, type='text', required=false}) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}{required && ' *'}</label>
        <input type={type} id={name} name={name} value={formData[name] as any ?? ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Nuevo Producto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
            {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center mb-4">{error}</p>}
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField name="producto" label="Producto" required />
                <InputField name="codigo" label="Código" required />
                <InputField name="codigo_nuevo" label="Código Nuevo" />
                <InputField name="cliente" label="Cliente Asociado" />
                <InputField name="material" label="Material" />
                <InputField name="materia_prima" label="Materia Prima" />
                <InputField name="ubicacion_almacen" label="Ubicación en Almacén" />
                <InputField name="acabado" label="Acabado" />
                <InputField name="calibre" label="Calibre" />
                <InputField name="medidas_pieza_mm" label="Medidas por Pieza (mm)" />
                <InputField name="empaque_de" label="Empaque de" />
                <InputField name="piezas_por_hora" label="Piezas por Hora" type="number"/>
                <InputField name="ancho_tira_mm" label="Ancho Tira (mm)" type="number"/>
                <InputField name="piezas_lamina_4x8_a" label="Piezas Lámina 4x8 A" type="number"/>
                <InputField name="piezas_por_lamina_4x8" label="Piezas Lámina 4x8" type="number"/>
                <InputField name="piezas_por_lamina_2x1" label="Piezas Lámina 2x1" type="number"/>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3 border-t mt-4">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancelar
              </button>
              <button type="submit" disabled={isFormInvalid} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center w-36 h-10 transition-colors">
                {loading ? <Spinner /> : 'Crear Producto'}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductModal;
