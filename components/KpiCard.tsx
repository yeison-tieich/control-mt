
import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import type { KpiData } from '../types';

interface KpiCardProps {
  data: KpiData;
}

const KpiCard: React.FC<KpiCardProps> = ({ data }) => {
  const chartData = [{ name: 'Completadas', value: data.porcentaje_completadas }];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-primary mb-4">RESUMEN CONTROL ÓRDENES</h3>
      <div className="flex items-center justify-around flex-wrap">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="85%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
              barSize={20}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background
                dataKey="value"
                angleAxisId={0}
                fill="#ea580c"
                cornerRadius={10}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-3xl font-bold fill-gray-700"
              >
                {`${Math.round(data.porcentaje_completadas)}%`}
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center md:text-left">
          <p className="text-gray-500 text-lg">Completadas</p>
          <p className="text-3xl font-bold text-gray-800">
            {data.ordenes_completadas} de {data.total_ordenes}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
