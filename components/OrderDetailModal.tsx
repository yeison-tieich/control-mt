import React, { useState, useEffect } from 'react';
import type { OrdenProduccion } from '../types';
import { getPrioritySuggestion, draftClientEmail } from '../services/geminiService';
import { updateOrderStatus, deleteOrden } from '../services/apiService';

// Icon Components
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const TimerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

interface OrderDetailModalProps {
  orden: OrdenProduccion;
  onClose: () => void;
  onDataChange: () => void;
}

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const formatDuration = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${days > 0 ? `${days}d ` : ''}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ orden, onClose, onDataChange }) => {
  const [currentOrder, setCurrentOrder] = useState(orden);
  const [elapsedTime, setElapsedTime] = useState('');
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [aiPriority, setAiPriority] = useState<{prioridad: string, justificacion: string} | null>(null);
  const [aiEmail, setAiEmail] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');

  useEffect(() => {
    let timer: number | undefined;
    if (currentOrder.estado === 'En Proceso' || currentOrder.estado === 'Pendiente') {
        timer = window.setInterval(() => {
            const startTime = new Date(currentOrder.fechaCreacion).getTime();
            const now = new Date().getTime();
            setElapsedTime(formatDuration(now - startTime));
        }, 1000);
    } else {
        setElapsedTime('');
    }
    return () => {
        if (timer) window.clearInterval(timer);
    };
  }, [currentOrder.estado, currentOrder.fechaCreacion]);

  const handleGetPriority = async () => {
    setPriorityLoading(true);
    setGeneralError('');
    setAiPriority(null);
    try {
      // Fix: The result is already a JSON object, no need to parse it here.
      const result = await getPrioritySuggestion(currentOrder);
      setAiPriority(result);
    } catch (error) {
      setGeneralError('Error al obtener sugerencia de prioridad.');
    } finally {
      setPriorityLoading(false);
    }
  };

  const handleDraftEmail = async () => {
    setEmailLoading(true);
    setGeneralError('');
    setAiEmail('');
    try {
      const result = await draftClientEmail(currentOrder);
      setAiEmail(result);
    } catch (error) {
      setGeneralError('Error al redactar el correo.');
    } finally {
      setEmailLoading(false);
    }
  };
  
  const handleStatusChange = async (newStatus: string) => {
    setStatusLoading(true);
    setGeneralError('');
    try {
        await updateOrderStatus(currentOrder.id, newStatus);
        onDataChange();
    } catch(err) {
        setGeneralError('Error al actualizar el estado.');
        console.error(err);
    } finally {
        setStatusLoading(false);
    }
  }

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta orden? Esta acción no se puede deshacer.')) {
        setGeneralError('');
        try {
            await deleteOrden(currentOrder.id);
            onDataChange();
        } catch(err) {
            setGeneralError('Error al eliminar la orden.');
            console.error(err);
        }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Detalle de Orden #{currentOrder.id}</h2>
            <div className="flex items-center space-x-2">
                <button className="text-gray-500 hover:text-primary p-2 rounded-full" title="Editar (Próximamente)"><EditIcon/></button>
                <button className="text-gray-500 hover:text-primary p-2 rounded-full" title="Duplicar (Próximamente)"><CopyIcon/></button>
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-600 p-2 rounded-full" title="Eliminar"><DeleteIcon/></button>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {generalError && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">{generalError}</p>}
          
          {elapsedTime && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex items-center justify-center space-x-3">
                <TimerIcon />
                <div className="text-center">
                    <p className="font-semibold">Tiempo Activo</p>
                    <p className="text-2xl font-mono tracking-wider">{elapsedTime}</p>
                </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
            <div><strong>Producto:</strong><p>{currentOrder.nombreProducto}</p></div>
            <div><strong>Cliente:</strong><p>{currentOrder.nombreCliente}</p></div>
            <div><strong>Cantidad:</strong><p>{currentOrder.cantidadSolicitada} un.</p></div>
            <div><strong>Prioridad Actual:</strong><p>{currentOrder.prioridad}</p></div>
            <div className="md:col-span-2"><strong>Fecha Creación:</strong><p>{new Date(currentOrder.fechaCreacion).toLocaleString()}</p></div>
          </div>

          <div className="pt-4 border-t">
              <h4 className="font-bold text-gray-800 mb-2">Gestión de Estado</h4>
              <div className="flex items-center space-x-4">
                <div>
                    <span className="text-gray-600">Estado Actual: </span>
                    <span className="font-bold text-primary">{currentOrder.estado}</span>
                </div>
                <select 
                    onChange={(e) => handleStatusChange(e.target.value)} 
                    disabled={statusLoading || currentOrder.estado === 'Completada' || currentOrder.estado === 'Cancelada'}
                    value={currentOrder.estado}
                    className="border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Completada">Completada</option>
                    <option value="Cancelada">Cancelada</option>
                </select>
                {statusLoading && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>}
              </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
             <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Análisis de Prioridad (IA)</h4>
                <button onClick={handleGetPriority} disabled={priorityLoading} className="bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center w-48 h-10">
                    {priorityLoading ? <Spinner/> : 'Sugerir Prioridad'}
                </button>
                {aiPriority && (
                    <div className="mt-3 text-sm bg-blue-50 p-3 rounded">
                        <p><strong>Prioridad Sugerida:</strong> <span className="font-semibold text-blue-800">{aiPriority.prioridad}</span></p>
                        <p><strong>Justificación:</strong> <span className="italic text-gray-600">{aiPriority.justificacion}</span></p>
                    </div>
                )}
             </div>
             <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Comunicación con Cliente (IA)</h4>
                <button onClick={handleDraftEmail} disabled={emailLoading} className="bg-secondary text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center w-48 h-10">
                    {emailLoading ? <Spinner/> : 'Redactar Email de Estado'}
                </button>
                {aiEmail && (
                    <div className="mt-3 text-sm bg-orange-50 p-3 rounded border border-orange-200">
                        <p className="font-semibold mb-2">Borrador:</p>
                        <p className="whitespace-pre-wrap text-gray-700">{aiEmail}</p>
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;