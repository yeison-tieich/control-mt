import React, { useState } from 'react';
import { createCliente } from '../services/apiService';
import type { NewClienteData } from '../types';

interface NewClienteModalProps {
  onClose: () => void;
  onClienteCreated: () => void;
}

const Spinner: React.FC = () => <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>;

const NewClienteModal: React.FC<NewClienteModalProps> = ({ onClose, onClienteCreated }) => {
  const [nombre_cliente, setNombreCliente] = useState('');
  const [contacto, setContacto] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre_cliente || !contacto || !email) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    
    const clienteData: NewClienteData = {
      nombre_cliente,
      contacto,
      email,
    };

    setLoading(true);
    try {
      await createCliente(clienteData);
      onClienteCreated();
    } catch (err: any) {
      setError(err.message || 'Error al crear el cliente. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = !nombre_cliente || !contacto || !email || loading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Añadir Cliente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">{error}</p>}
            
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Cliente</label>
              <input
                type="text"
                id="nombre"
                value={nombre_cliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="contacto" className="block text-sm font-medium text-gray-700">Contacto</label>
              <input
                type="text"
                id="contacto"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="pt-2 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancelar
              </button>
              <button type="submit" disabled={isFormInvalid} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center w-32 h-10 transition-colors">
                {loading ? <Spinner /> : 'Guardar'}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default NewClienteModal;
