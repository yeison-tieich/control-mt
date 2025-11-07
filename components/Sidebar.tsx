import React from 'react';

type Screen = 'dashboard' | 'products' | 'staff';

interface SidebarProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const NavLink: React.FC<{
  // Fix: Changed JSX.Element to React.ReactNode to resolve namespace issue.
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
      isActive
        ? 'bg-secondary text-white shadow-md'
        : 'text-gray-200 hover:bg-blue-800 hover:text-white'
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="ml-3 font-medium">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, setActiveScreen }) => {
  return (
    <aside className="w-64 bg-primary text-white flex flex-col p-4 shadow-2xl">
      <div className="text-2xl font-bold mb-8 p-3 border-b border-blue-500">
        CONTROL MT
      </div>
      <nav>
        <ul>
          <NavLink
            icon={<DashboardIcon />}
            label="Panel de Órdenes"
            isActive={activeScreen === 'dashboard'}
            onClick={() => setActiveScreen('dashboard')}
          />
          <NavLink
            icon={<ProductsIcon />}
            label="Productos"
            isActive={activeScreen === 'products'}
            onClick={() => setActiveScreen('products')}
          />
          <NavLink
            icon={<StaffIcon />}
            label="Personal"
            isActive={activeScreen === 'staff'}
            onClick={() => setActiveScreen('staff')}
          />
        </ul>
      </nav>
    </aside>
  );
};

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

const ProductsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const StaffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" />
  </svg>
);

export default Sidebar;