import React from 'react';

interface PlaceholderScreenProps {
  screenName: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ screenName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-md p-8">
      <div className="text-6xl mb-6">🚧</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2 capitalize">{screenName}</h1>
      <p className="text-lg text-gray-500">Esta sección está en construcción y estará disponible próximamente.</p>
    </div>
  );
};

export default PlaceholderScreen;
