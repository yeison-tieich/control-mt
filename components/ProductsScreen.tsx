import React, { useState, useEffect } from 'react';
import type { Producto } from '../types';
import { fetchProductos } from '../services/apiService';
import ProductDetailModal from './ProductDetailModal';
import NewOrderModal from './NewOrderModal';

const ProductCard: React.FC<{ producto: Producto; onClick: () => void; onCreateOrder: () => void; }> = ({ producto, onClick, onCreateOrder }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
            <div className="h-40 bg-gray-200 flex items-center justify-center cursor-pointer" onClick={onClick}>
                {producto.imageUrl ? (
                    <img src={producto.imageUrl} alt={producto.nombre} className="h-full w-full object-cover" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                )}
            </div>
            <div className="p-4 flex-grow">
                <h3 className="font-bold text-gray-800 truncate" title={producto.nombre}>{producto.nombre}</h3>
                <p className="text-sm text-gray-500">Código: {producto.codigoProducto}</p>
            </div>
            <div className="p-2 bg-gray-50">
                <button 
                    onClick={onCreateOrder}
                    className="w-full bg-secondary text-white text-sm font-semibold px-3 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                    Crear OT
                </button>
            </div>
        </div>
    );
};


const ProductsScreen: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isNewOrderModalOpen, setNewOrderModalOpen] = useState<boolean>(false);

  const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductos();
        setProductos(data);
        setFilteredProductos(data);
      } catch (err) {
        setError('Error al cargar los productos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = productos.filter(item =>
        item.nombre.toLowerCase().includes(lowercasedFilter) ||
        item.codigoProducto.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredProductos(filteredData);
  }, [searchTerm, productos]);

  const handleCreateOrder = (producto: Producto) => {
    setSelectedProduct(producto);
    setNewOrderModalOpen(true);
  };
  
  const handleDataChange = () => {
    setSelectedProduct(null);
    setNewOrderModalOpen(false);
    loadProducts();
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
      </div>
      
      <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          />
      </div>

      {loading && <div className="text-center p-4">Cargando productos...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProductos.map((producto) => (
            <ProductCard 
                key={producto.id} 
                producto={producto} 
                onClick={() => setSelectedProduct(producto)}
                onCreateOrder={() => handleCreateOrder(producto)}
            />
          ))}
        </div>
      )}
      
      {selectedProduct && !isNewOrderModalOpen && (
        <ProductDetailModal 
            producto={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onCreateOrder={() => handleCreateOrder(selectedProduct)}
            onDataChange={handleDataChange}
        />
      )}

      {isNewOrderModalOpen && (
        <NewOrderModal 
            onClose={() => setNewOrderModalOpen(false)}
            onOrderCreated={handleDataChange}
            initialProductId={selectedProduct?.id}
        />
      )}
    </>
  );
};

export default ProductsScreen;
