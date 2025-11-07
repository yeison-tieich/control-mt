import React, { useState } from 'react';
import { createPersonal } from '../services/apiService';
import { generateJobDescription } from '../services/geminiService';
import type { NewPersonalData } from '../types';

interface NewStaffModalProps {
  onClose: () => void;
  onPersonalCreated: () => void;
}

const Spinner: React.FC<{color?: string}> = ({ color = 'white' }) => 
    <div className={`animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-${color}`}></div>;

const NewStaffModal: React.FC<NewStaffModalProps> = ({ onClose, onPersonalCreated }) => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cedula, setCedula] = useState('');
  const [cargo, setCargo] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [aiDescription, setAiDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateDescription = async () => {
    if (!cargo) {
        setError("Por favor, ingrese un cargo para generar la descripción.");
        return;
    }
    setAiLoading(true);
    setError('');
    setAiDescription('');
    try {
        const description = await generateJobDescription(cargo);
        setAiDescription(description);
    } catch(err) {
        setError('Error al generar la descripción con IA.');
    } finally {
        setAiLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombreCompleto || !cedula) {
      setError('Nombre completo y cédula son obligatorios.');
      return;
    }
    
    const personalData: NewPersonalData = {
      nombreCompleto,
      cedula,
      cargo,
    };

    setLoading(true);
    try {
      await createPersonal(personalData);
      onPersonalCreated();
    } catch (err: any) {
      setError(err.message || 'Error al crear el registro. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = !nombreCompleto || !cedula || loading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Añadir Personal</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">{error}</p>}
            
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</label>
              <input
                type="text"
                id="cedula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="cargo" className="block text-sm font-medium text-gray-700">Cargo</label>
               <div className="flex items-center space-x-2">
                 <input
                    type="text"
                    id="cargo"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                  />
                  <button type="button" onClick={handleGenerateDescription} disabled={aiLoading || !cargo} className="mt-1 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center w-48 h-10 disabled:bg-gray-400">
                      {aiLoading ? <Spinner /> : '✨ Generar Descripción'}
                  </button>
               </div>
            </div>
            {aiDescription && (
                <div className="text-sm bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="font-semibold mb-1">Descripción Sugerida:</p>
                    <p className="italic text-gray-600">{aiDescription}</p>
                </div>
            )}
            
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

export default NewStaffModal;