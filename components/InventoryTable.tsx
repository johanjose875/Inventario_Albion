import React from 'react';
import { InventoryItem } from '../types';
import { RARITY_COLORS } from '../constants';
import { Shield, Sword, FlaskConical, Box, Key, Calendar } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Arma': return <Sword size={16} />;
    case 'Armadura': return <Shield size={16} />;
    case 'Consumible': return <FlaskConical size={16} />;
    case 'Objeto Clave': return <Key size={16} />;
    default: return <Box size={16} />;
  }
};

const InventoryTable: React.FC<InventoryTableProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-800 rounded-xl border border-slate-700">
        <Box className="mx-auto text-slate-600 mb-4" size={48} />
        <h3 className="text-xl text-slate-300 font-medium">No se encontraron objetos</h3>
        <p className="text-slate-500">Intenta ajustar los filtros de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-900/50">
            <th className="p-4 text-slate-400 font-medium text-sm">Objeto</th>
            <th className="p-4 text-slate-400 font-medium text-sm">Categoría</th>
            <th className="p-4 text-slate-400 font-medium text-sm text-center">Cantidad</th>
            <th className="p-4 text-slate-400 font-medium text-sm">Jugador</th>
            <th className="p-4 text-slate-400 font-medium text-sm">Fecha</th>
            <th className="p-4 text-slate-400 font-medium text-sm text-right">Valor Est.</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors group">
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-200">{item.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full w-fit mt-1 inline-block ${RARITY_COLORS[item.rarity]}`}>
                    {item.rarity}
                  </span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  {getCategoryIcon(item.category)}
                  <span>{item.category}</span>
                </div>
              </td>
              <td className="p-4 text-center">
                <span className="font-mono text-slate-200 font-bold bg-slate-900 px-2 py-1 rounded">
                  {item.quantity}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <img 
                    src={item.obtainedBy.avatarUrl} 
                    alt={item.obtainedBy.name} 
                    className="w-8 h-8 rounded-full border border-slate-600"
                  />
                  <div>
                    <p className="text-sm text-slate-200 font-medium">{item.obtainedBy.name}</p>
                    <p className="text-xs text-slate-500">{item.obtainedBy.role}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-slate-400 text-sm">
                 <div className="flex items-center gap-1">
                   <Calendar size={12} />
                   {new Date(item.dateAcquired).toLocaleDateString()}
                 </div>
              </td>
              <td className="p-4 text-right text-yellow-500 font-mono">
                {item.value.toLocaleString()} 🟡
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;