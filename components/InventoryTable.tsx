import React from 'react';
import { InventoryItem } from '../types';
import { RARITY_COLORS, formatCurrency } from '../constants';
import { Shield, Sword, FlaskConical, Box, Key, Calendar, User as UserIcon, Pencil } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
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

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-800 rounded-xl border border-slate-700 animate-in fade-in zoom-in-95 duration-500">
        <Box className="mx-auto text-slate-600 mb-4 animate-bounce" size={48} />
        <h3 className="text-xl text-slate-300 font-medium">Inventario Vacío</h3>
        <p className="text-slate-500">Registra un movimiento para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700 shadow-xl animate-in slide-in-from-bottom-4 duration-500">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-900/50">
            <th className="p-4 text-slate-400 font-medium text-sm">Objeto</th>
            <th className="p-4 text-slate-400 font-medium text-sm">Tier</th>
            <th className="p-4 text-slate-400 font-medium text-sm">Categoría</th>
            <th className="p-4 text-slate-400 font-medium text-sm text-center">Cantidad</th>
            <th className="p-4 text-slate-400 font-medium text-sm">Jugador</th>
            <th className="p-4 text-slate-400 font-medium text-sm">Fecha</th>
            <th className="p-4 text-slate-400 font-medium text-sm text-right">Valor Total</th>
            <th className="p-4 text-slate-400 font-medium text-sm text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const userName = 'username' in item.obtainedBy 
              ? item.obtainedBy.username 
              : item.obtainedBy.name;
            
            const totalValue = item.quantity * item.value;

            return (
              <tr 
                key={item.id} 
                className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-all duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="p-4">
                  <span className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">{item.name}</span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded border ${RARITY_COLORS[item.rarity] || 'text-slate-400 border-slate-600'}`}>
                    {item.rarity}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    {getCategoryIcon(item.category)}
                    <span>{item.category}</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="font-mono text-slate-200 font-bold bg-slate-900 px-2 py-1 rounded group-hover:bg-slate-800 transition-colors">
                    {item.quantity}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                        {item.obtainedBy.avatarUrl ? (
                            <img src={item.obtainedBy.avatarUrl} className="w-full h-full rounded-full" alt="avatar"/>
                        ) : (
                            <UserIcon size={16} className="text-slate-400" />
                        )}
                    </div>
                    <div>
                      <p className="text-sm text-slate-200 font-medium">{userName}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-400 text-sm">
                   <div className="flex items-center gap-1">
                     <Calendar size={12} />
                     {new Date(item.dateAcquired).toLocaleDateString()}
                   </div>
                </td>
                <td className="p-4 text-right">
                  <div className="text-yellow-500 font-mono font-bold">
                    {formatCurrency(totalValue)} 🟡
                  </div>
                  <div className="text-xs text-slate-500">
                    ({formatCurrency(item.value)} c/u)
                  </div>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => onEdit(item)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-indigo-600 rounded-lg transition-all transform hover:scale-110 shadow-sm"
                    title="Editar Objeto"
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;