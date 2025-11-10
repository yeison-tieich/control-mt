import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Producto } from '../types';
import { fetchProductos } from '../services/apiService';
import NewProductModal from './NewProductModal';
import ProductDetailModal from './ProductDetailModal';
import EditProductModal from './EditProductModal';
import NewOrderModal from './NewOrderModal';

const ProductCard: React.FC<{ producto: Producto; onClick: () => void; }> = ({ producto, onClick }) => {
    const [imageError, setImageError] = useState(false);
    const hasImage = producto.imagen_url && !imageError;

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
        >
            <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
                {hasImage ? (
                    <img
                        src={producto.imagen_url}
                        alt={producto.producto}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                )}
            </div>
            <div className="p-4">
                <p className="font-bold text-gray-800 truncate group-hover:text-primary transition-colors" title={producto.producto}>
                    {producto.producto}
                </p>
                <p className="text-sm text-gray-500 font-mono">{producto.codigo}</p>
                 <p className="text-xs text-gray-400 mt-1 truncate">{producto.cliente || 'Sin cliente asignado'}</p>
            </div>
        </div>
    );
};

const ProductsScreen: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [productToEdit, setProductToEdit] = useState<Producto | null>(null);

  const [isNewProductModalOpen, setNewProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setEditProductModalOpen] = useState(false);
  const [isNewOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [productForNewOrder, setProductForNewOrder] = useState<string | undefined>(undefined);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductos();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar los productos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProductos = useMemo(() => {
    return productos.filter(p =>
      (p.producto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.codigo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.cliente || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);
  
  const handleProductCreated = () => {
    setNewProductModalOpen(false);
    loadData();
  };
  
  const handleProductUpdated = () => {
    setEditProductModalOpen(false);
    setProductToEdit(null);
    loadData();
  };

  const handleOrderCreated = () => {
    setNewOrderModalOpen(false);
    setProductForNewOrder(undefined);
  };

  const handleCreateOrderForProduct = (product: Producto) => {
    setProductForNewOrder(product.codigo);
    setNewOrderModalOpen(true);
    setSelectedProduct(null);
  }

  const handleEditRequest = (product: Producto) => {
    setSelectedProduct(null); // Close detail modal
    setProductToEdit(product);
    setEditProductModalOpen(true);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
        <button
          onClick={() => setNewProductModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
        >
          Añadir Producto
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, código o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
        />
      </div>
      {loading && <div className="text-center p-4">Cargando productos...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProductos.map(p => (
            <ProductCard key={p.codigo} producto={p} onClick={() => setSelectedProduct(p)} />
          ))}
        </div>
      )}

      {isNewProductModalOpen && (
        <NewProductModal
          onClose={() => setNewProductModalOpen(false)}
          onProductCreated={handleProductCreated}
        />
      )}

      {selectedProduct && (
        <ProductDetailModal
          producto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onCreateOrder={handleCreateOrderForProduct}
          onEdit={handleEditRequest}
        />
      )}
      
      {isEditProductModalOpen && productToEdit && (
        <EditProductModal
          producto={productToEdit}
          onClose={() => setEditProductModalOpen(false)}
          onProductUpdated={handleProductUpdated}
        />
      )}

      {isNewOrderModalOpen && (
        <NewOrderModal
          onClose={() => setNewOrderModalOpen(false)}
          onOrderCreated={handleOrderCreated}
          initialProductId={productForNewOrder}
        />
      )}
    </>
  );
};

export default ProductsScreen;