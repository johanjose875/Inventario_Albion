import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { InventoryItem, ItemCategory } from '../types';

interface AnalyticsChartsProps {
  items: InventoryItem[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ items }) => {
  
  // Data for Pie Chart (Category Distribution)
  const categoryData = Object.values(ItemCategory).map(cat => {
    return {
      name: cat,
      value: items.filter(i => i.category === cat).reduce((acc, curr) => acc + curr.quantity, 0)
    };
  }).filter(d => d.value > 0);

  // Data for Bar Chart (Rarity Distribution)
  const rarityData = items.reduce((acc, item) => {
    const existing = acc.find(x => x.name === item.rarity);
    if (existing) {
      existing.count += item.quantity;
    } else {
      acc.push({ name: item.rarity, count: item.quantity });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Category Chart */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Distribución por Categoría</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rarity Chart */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Cantidad por Rareza</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rarityData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                 cursor={{fill: 'rgba(255,255,255,0.05)'}}
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;