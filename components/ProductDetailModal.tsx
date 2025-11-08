import React, { useState } from 'react';
import type { Producto } from '../types';
import NewOrderModal from './NewOrderModal';

interface ProductDetailModalProps {
  producto: Producto;
  onClose: () => void;
  onDataChange: () => void;
}

const DetailRow: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
  <div className="py-2 flex justify-between border-b border-gray-200">
    <span className="font-semibold text-gray-600">{label}</span>
    <span className="text-gray-800 text-right">{value || 'No especificado'}</span>
  </div>
);

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ producto, onClose, onDataChange }) => {
    const [isNewOrderModalOpen, setNewOrderModalOpen] = useState(false);
    
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="p-4 sticky top-0 bg-white border-b border-gray-200 z-10">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-primary">{producto.producto}</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="relative h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                            {producto.imagen_producto ? (
                                <img src={producto.imagen_producto} alt={producto.producto} className="h-full w-full object-contain" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <div>
                                <h3 className="font-bold text-lg text-primary mb-2">Detalles Generales</h3>
                                <DetailRow label="Código" value={producto.codigo} />
                                <DetailRow label="Código Nuevo" value={producto.codigo_nuevo} />
                                <DetailRow label="Cliente Asociado" value={producto.cliente} />
                                <DetailRow label="Ubicación" value={producto.ubicacion_almacen} />
                                <DetailRow label="Empaque de" value={producto.empaque_de} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary mb-2">Especificaciones Técnicas</h3>
                                <DetailRow label="Material Principal" value={producto.material} />
                                <DetailRow label="Materia Prima" value={producto.materia_prima} />
                                <DetailRow label="Acabado" value={producto.acabado} />
                                <DetailRow label="Calibre" value={producto.calibre} />
                                <DetailRow label="Medidas por Pieza" value={producto.medidas_pieza_mm} />
                                <DetailRow label="Ancho de Tira" value={producto.ancho_tira_mm ? `${producto.ancho_tira_mm} mm` : 'N/A'} />
                            </div>
                             <div className="md:col-span-2">
                                <h3 className="font-bold text-lg text-primary mb-2 mt-4">Rendimiento</h3>
                                <DetailRow label="Piezas por Hora" value={producto.piezas_por_hora} />
                                <DetailRow label="Piezas por Lámina (4x8 A)" value={producto.piezas_lamina_4x8_a} />
                                <DetailRow label="Piezas por Lámina (4x8)" value={producto.piezas_por_lamina_4x8} />
                                <DetailRow label="Piezas por Lámina (2x1)" value={producto.piezas_por_lamina_2x1} />
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                             <button 
                                onClick={() => setNewOrderModalOpen(true)}
                                className="w-full bg-secondary text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors font-bold"
                            >
                                Crear Orden de Trabajo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isNewOrderModalOpen && (
                <NewOrderModal 
                    onClose={() => setNewOrderModalOpen(false)}
                    onOrderCreated={onDataChange}
                    initialProductId={producto.codigo}
                />
            )}
        </>
    );
};

export default ProductDetailModal;
