import React from 'react';
import type { Producto } from '../types';

interface ProductDetailModalProps {
  producto: Producto;
  onClose: () => void;
  onCreateOrder: (producto: Producto) => void;
  onEdit: (producto: Producto) => void;
}

const DetailItem: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-md font-semibold text-gray-800 break-words">{value || 'N/A'}</p>
    </div>
);

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ producto, onClose, onCreateOrder, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 sticky top-0 bg-white border-b border-gray-200 z-10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">{producto.producto}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="mb-4 flex justify-center items-center bg-gray-100 rounded-lg h-64">
            {producto.imagen_url ? (
                <img 
                    src={producto.imagen_url} 
                    alt={producto.producto} 
                    className="object-contain h-full w-full rounded-lg"
                />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <DetailItem label="Código" value={producto.codigo} />
            <DetailItem label="Código Nuevo" value={producto.codigo_nuevo} />
            <DetailItem label="Cliente Asociado" value={producto.cliente} />
            <DetailItem label="Material" value={producto.material} />
            <DetailItem label="Materia Prima" value={producto.materia_prima} />
            <DetailItem label="Ubicación" value={producto.ubicacion_almacen} />
            <DetailItem label="Acabado" value={producto.acabado} />
            <DetailItem label="Calibre" value={producto.calibre} />
            <DetailItem label="Medidas Pieza (mm)" value={producto.medidas_pieza_mm} />
            <DetailItem label="Empaque de" value={producto.empaque_de} />
            <DetailItem label="Piezas/Hora" value={producto.piezas_por_hora} />
            <DetailItem label="Ancho Tira (mm)" value={producto.ancho_tira_mm} />
            <DetailItem label="Piezas Lámina 4x8 A" value={producto.piezas_lamina_4x8_a} />
            <DetailItem label="Piezas Lámina 4x8" value={producto.piezas_por_lamina_4x8} />
            <DetailItem label="Piezas Lámina 2x1" value={producto.piezas_por_lamina_2x1} />
          </div>
          <div className="pt-4 border-t mt-4 flex justify-end space-x-2">
            <button
              onClick={() => onEdit(producto)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => onCreateOrder(producto)}
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Crear Orden de Trabajo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;