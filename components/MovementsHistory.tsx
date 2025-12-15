import React from 'react';
import { Movement, MovementType } from '../types';
import { ArrowUpRight, ArrowDownLeft, Plus, Calendar } from 'lucide-react';

interface MovementsHistoryProps {
  movements: Movement[];
}

const MovementsHistory: React.FC<MovementsHistoryProps> = ({ movements }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Historial de Movimientos</h2>
      </div>
      
      {movements.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          No hay movimientos registrados aún.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-sm">
                <th className="p-4">Tipo</th>
                <th className="p-4">Objeto</th>
                <th className="p-4 text-center">Cantidad</th>
                <th className="p-4">Usuario</th>
                <th className="p-4">Motivo</th>
                <th className="p-4 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((mov) => (
                <tr key={mov.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="p-4">
                    {mov.type === MovementType.IN && (
                      <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                        <ArrowDownLeft size={16} /> Entrada
                      </span>
                    )}
                    {mov.type === MovementType.OUT && (
                      <span className="flex items-center gap-1 text-red-400 text-sm font-medium">
                        <ArrowUpRight size={16} /> Salida
                      </span>
                    )}
                    {mov.type === MovementType.CREATE && (
                      <span className="flex items-center gap-1 text-blue-400 text-sm font-medium">
                        <Plus size={16} /> Creación
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-medium text-slate-200">{mov.itemName}</td>
                  <td className="p-4 text-center font-mono text-slate-300">{mov.quantity}</td>
                  <td className="p-4 text-slate-300">{mov.user}</td>
                  <td className="p-4 text-slate-400 text-sm italic">{mov.reason || '-'}</td>
                  <td className="p-4 text-right text-slate-500 text-sm">
                    {new Date(mov.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MovementsHistory;