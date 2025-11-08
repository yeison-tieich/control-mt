import React, { useState, useEffect } from 'react';
import type { OrdenProduccion } from '../types';
import { getPrioritySuggestion, draftClientEmail } from '../services/geminiService';
import { parseDate } from '../utils/dateUtils';

// Icon Components
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
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

const DetailItem: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-md font-semibold text-gray-800">{value}</p>
    </div>
);


const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ orden, onClose, onDataChange }) => {
  const [currentOrder, setCurrentOrder] = useState(orden);
  const [elapsedTime, setElapsedTime] = useState('');
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [aiPriority, setAiPriority] = useState<{prioridad: string, justificacion: string} | null>(null);
  const [aiEmail, setAiEmail] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');

  useEffect(() => {
    let timer: number | undefined;
    const parsedDate = parseDate(currentOrder.fecha_emision);

    if (parsedDate && (currentOrder.estado === 'En Proceso' || currentOrder.estado === 'Pendiente')) {
        timer = window.setInterval(() => {
            const startTime = parsedDate.getTime();
            const now = new Date().getTime();
            setElapsedTime(formatDuration(now - startTime));
        }, 1000);
    } else {
        setElapsedTime('');
    }
    return () => {
        if (timer) window.clearInterval(timer);
    };
  }, [currentOrder.estado, currentOrder.fecha_emision]);

  const handleGetPriority = async () => {
    setPriorityLoading(true);
    setGeneralError('');
    setAiPriority(null);
    try {
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
  
  const creationDate = parseDate(currentOrder.fecha_emision);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Detalle de Orden #{currentOrder.id}</h2>
            <div className="flex items-center space-x-2">
                <button className="text-gray-500 hover:text-primary p-2 rounded-full cursor-not-allowed" title="Editar (Próximamente)" disabled><EditIcon/></button>
                <button className="text-gray-500 hover:text-primary p-2 rounded-full cursor-not-allowed" title="Duplicar (Próximamente)" disabled><CopyIcon/></button>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
            <DetailItem label="Producto" value={currentOrder.nombreProducto} />
            <DetailItem label="Cliente" value={currentOrder.nombreCliente} />
            <DetailItem label="Cantidad" value={`${currentOrder.cantidadSolicitada} un.`} />
            <DetailItem label="No. Orden Compra" value={currentOrder.orden_compra} />
            <DetailItem label="Referencia" value={currentOrder.referencia} />
            <DetailItem label="Prioridad Actual" value={currentOrder.prioridad} />
            <DetailItem label="Material" value={currentOrder.material || 'N/A'} />
            <DetailItem label="Material Disponible" value={currentOrder.material_disponible} />
            <DetailItem label="Tiempo Estimado" value={`${currentOrder.tiempo_estimado_dias} días`} />
            <div className="md:col-span-3">
                 <DetailItem label="Fecha de Emisión" value={creationDate ? creationDate.toLocaleString() : 'Fecha inválida'} />
            </div>
             <div className="md:col-span-3">
                 <DetailItem label="Observaciones" value={currentOrder.observacion || 'Sin observaciones.'} />
            </div>
          </div>

          <div className="pt-4 border-t">
              <h4 className="font-bold text-gray-800 mb-2">Estado Actual</h4>
              <p className="font-bold text-primary text-lg">{currentOrder.estado}</p>
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