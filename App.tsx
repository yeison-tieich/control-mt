import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProductsScreen from './components/ProductsScreen';
import StaffScreen from './components/StaffScreen';
import ClientesScreen from './components/ClientesScreen';
import MaquinasScreen from './components/MaquinasScreen';
import MantenimientoScreen from './components/MantenimientoScreen';
import MateriasPrimasScreen from './components/MateriasPrimasScreen';
import CalidadScreen from './components/CalidadScreen';
import PlaceholderScreen from './components/PlaceholderScreen';

export type Screen = 
  | 'dashboard' 
  | 'productos' 
  | 'personal' 
  | 'clientes'
  | 'maquinas'
  | 'mantenimiento'
  | 'materias-primas'
  | 'calidad'
  | 'inventario' 
  | 'reportes';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'productos':
        return <ProductsScreen />;
      case 'personal':
        return <StaffScreen />;
      case 'clientes':
        return <ClientesScreen />;
       case 'maquinas':
        return <MaquinasScreen />;
      case 'mantenimiento':
        return <MantenimientoScreen />;
      case 'materias-primas':
        return <MateriasPrimasScreen />;
      case 'calidad':
        return <CalidadScreen />;
      case 'inventario':
      case 'reportes':
        return <PlaceholderScreen screenName={activeScreen} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;
