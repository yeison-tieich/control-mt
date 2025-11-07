import React, { useState, useRef } from 'react';
import type { Producto } from '../types';
import { uploadProductImage } from '../services/apiService';

interface ProductDetailModalProps {
  producto: Producto;
  onClose: () => void;
  onCreateOrder: () => void;
  onDataChange: () => void;
}

const DetailRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="py-2 flex justify-between border-b border-gray-200">
    <span className="font-semibold text-gray-600">{label}</span>
    <span className="text-gray-800">{value || 'No especificado'}</span>
  </div>
);

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ producto, onClose, onCreateOrder, onDataChange }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(producto.imageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                handleImageUpload(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleImageUpload = async (imageBase64: string) => {
        setIsUploading(true);
        setUploadError('');
        try {
            await uploadProductImage(producto.id, imageBase64);
            onDataChange(); // Recarga los datos para mostrar la nueva imagen en la lista principal
        } catch(err) {
            setUploadError('Error al subir la imagen.');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-4 sticky top-0 bg-white border-b border-gray-200 z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-primary">{producto.nombre}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="relative h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        {previewImage ? (
                            <img src={previewImage} alt={producto.nombre} className="h-full w-full object-contain" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        )}
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center h-10 w-40 disabled:bg-blue-300"
                        >
                           {isUploading ? <Spinner /> : 'Cambiar Imagen'}
                        </button>
                    </div>
                    {uploadError && <p className="text-sm text-center text-red-500">{uploadError}</p>}
                    
                    <div>
                        <DetailRow label="Código" value={producto.codigoProducto} />
                        <DetailRow label="Materia Prima" value={producto.nombreMaterial} />
                        <DetailRow label="Acabado" value={producto.acabado} />
                        <DetailRow label="Medida de Pieza" value={producto.medidaPieza} />
                        <DetailRow label="Stock Disponible" value={`${producto.stock} un.`} />
                    </div>

                    <button
                        onClick={onCreateOrder}
                        className="w-full bg-secondary text-white font-bold px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        Crear Orden de Trabajo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
