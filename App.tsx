import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProductsScreen from './components/ProductsScreen';

type Screen = 'dashboard' | 'products' | 'staff';

const PlaceholderScreen: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="mt-4 text-gray-600">Esta sección está en construcción.</p>
    </div>
);


const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductsScreen />;
      case 'staff':
        return <PlaceholderScreen title="Gestión de Personal" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      <main className="flex-1 p-6 overflow-y-auto">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;
