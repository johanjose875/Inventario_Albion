import React from 'react';
import { InventoryItem, Player } from '../types';
import { Package, Users, Coins, Trophy } from 'lucide-react';
import { formatCurrency } from '../constants';

interface StatsOverviewProps {
  items: InventoryItem[];
  players: Player[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; delay: number }> = ({ title, value, icon, color, delay }) => (
  <div 
    className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex items-center gap-4 transition-all hover:scale-[1.03] hover:shadow-indigo-500/10 hover:border-indigo-500/30 animate-in slide-in-from-bottom-4 fade-in duration-700 fill-mode-backwards"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`p-4 rounded-full ${color} bg-opacity-20`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </div>
);

const StatsOverview: React.FC<StatsOverviewProps> = ({ items, players }) => {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = items.reduce((acc, item) => acc + (item.value * item.quantity), 0);
  const uniqueItems = items.length;
  
  // Find top contributor based on quantity
  const contributionMap = new Map<string, number>();
  items.forEach(item => {
    const name = 'username' in item.obtainedBy ? item.obtainedBy.username : item.obtainedBy.name;
    const current = contributionMap.get(name) || 0;
    contributionMap.set(name, current + item.quantity);
  });
  
  let topContributor = "N/A";
  let maxContribution = -1;
  contributionMap.forEach((val, key) => {
    if (val > maxContribution) {
      maxContribution = val;
      topContributor = key;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Objetos" 
        value={formatCurrency(totalQuantity)} 
        icon={<Package className="text-blue-400" size={24} />}
        color="bg-blue-500"
        delay={0}
      />
      <StatCard 
        title="Valor Total (Oro)" 
        value={formatCurrency(totalValue)} 
        icon={<Coins className="text-yellow-400" size={24} />}
        color="bg-yellow-500"
        delay={100}
      />
      <StatCard 
        title="Tipos de Ítems" 
        value={uniqueItems} 
        icon={<Trophy className="text-purple-400" size={24} />}
        color="bg-purple-500"
        delay={200}
      />
      <StatCard 
        title="Top Contribuyente" 
        value={topContributor} 
        icon={<Users className="text-emerald-400" size={24} />}
        color="bg-emerald-500"
        delay={300}
      />
    </div>
  );
};

export default StatsOverview;