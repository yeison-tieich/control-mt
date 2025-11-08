import React, { useState, useEffect, useCallback } from 'react';
import { fetchOrdenes, fetchKpiData } from '../services/apiService';
import type { OrdenProduccion, KpiData } from '../types';
import KpiCard from './KpiCard';
import OrderDetailModal from './OrderDetailModal';
import NewOrderModal from './NewOrderModal';

const statusColors: { [key: string]: string } = {
  'Pendiente': 'bg-yellow-100 text-yellow-800',
  'En Proceso': 'bg-blue-100 text-blue-800',
  'Completada': 'bg-green-100 text-green-800',
};

const priorityColors: { [key: string]: string } = {
    'Baja': 'border-gray-400',
    'Media': 'border-yellow-500',
    'Alta': 'border-red-500',
}

const OrderCard: React.FC<{ orden: OrdenProduccion; onClick: () => void; }> = ({ orden, onClick }) => (
    <div 
        onClick={onClick}
        className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex items-center space-x-4 cursor-pointer border-l-4 ${priorityColors[orden.prioridad] || 'border-gray-300'}`}
    >
        <div className="flex-shrink-0 bg-primary text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg">
            {orden.id}
        </div>
        <div className="flex-grow">
            <p className="font-bold text-gray-800">{orden.nombreProducto}</p>
            <p className="text-sm text-gray-500">Cliente: {orden.nombreCliente} - Cant: {orden.cantidadSolicitada} un.</p>
        </div>
        <div className="flex-shrink-0">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[orden.estado] || 'bg-gray-100 text-gray-800'}`}>
                {orden.estado}
            </span>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([]);
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrdenProduccion | null>(null);
  const [isNewOrderModalOpen, setNewOrderModalOpen] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordenesRes, kpiRes] = await Promise.all([fetchOrdenes(), fetchKpiData()]);
      setOrdenes(ordenesRes);
      setKpiData(kpiRes);
    } catch (err) {
      setError('Error al cargar los datos. Por favor, intente de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOrderCreated = () => {
    setNewOrderModalOpen(false);
    loadData();
  };

  if (loading && !kpiData) {
    return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
        <button
          onClick={loadData}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5"/></svg>
          Refrescar
        </button>
      </div>
      
      {kpiData && <KpiCard data={kpiData} />}

      <h2 className="text-2xl font-bold text-gray-700 mt-8 mb-4">Órdenes de Trabajo Recientes</h2>
      <div className="space-y-4">
        {ordenes.map(orden => (
          <OrderCard key={orden.id} orden={orden} onClick={() => setSelectedOrder(orden)} />
        ))}
      </div>

      <button
        onClick={() => setNewOrderModalOpen(true)}
        className="fixed bottom-8 right-8 bg-secondary text-white rounded-full p-4 shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-110"
        aria-label="Crear nueva orden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      </button>

      {selectedOrder && (
        <OrderDetailModal
          orden={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDataChange={() => {
            setSelectedOrder(null);
            loadData();
          }}
        />
      )}

      {isNewOrderModalOpen && (
        <NewOrderModal 
          onClose={() => setNewOrderModalOpen(false)}
          onOrderCreated={handleOrderCreated}
        />
      )}
    </>
  );
};

export default Dashboard;
