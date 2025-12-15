import React, { useState, useMemo } from 'react';
import { MOCK_INVENTORY, PLAYERS } from './constants';
import { ItemCategory, FilterState } from './types';
import StatsOverview from './components/StatsOverview';
import InventoryTable from './components/InventoryTable';
import AnalyticsCharts from './components/AnalyticsCharts';
import AIAdvisor from './components/AIAdvisor';
import { Search, Filter, HelpCircle, Gamepad2, X } from 'lucide-react';

function App() {
  const [items] = useState(MOCK_INVENTORY);
  const [showGuide, setShowGuide] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    player: 'All',
    rarity: 'All'
  });

  // Filter Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || item.category === filters.category;
      const matchesPlayer = filters.player === 'All' || item.obtainedBy.id === filters.player;
      
      return matchesSearch && matchesCategory && matchesPlayer;
    });
  }, [items, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Gamepad2 className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                GuildVault
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
              >
                <HelpCircle size={18} />
                <span className="hidden sm:inline">Guía de Uso</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                🎮 Inventario del Juego – Guía de Uso
              </h2>
              <button onClick={() => setShowGuide(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 text-slate-300 space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">📦 ¿Qué información contiene?</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong className="text-white">Objeto:</strong> Nombre del ítem dentro del juego.</li>
                  <li><strong className="text-white">Categoría:</strong> Tipo de objeto (arma, armadura, material, etc.).</li>
                  <li><strong className="text-white">Cantidad:</strong> Número de unidades disponibles.</li>
                  <li><strong className="text-white">Jugador:</strong> Quién obtuvo o posee el objeto.</li>
                  <li><strong className="text-white">Fecha:</strong> Cuándo fue registrado.</li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">📊 ¿Cómo usar el inventario?</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Utiliza los filtros arriba para seleccionar jugador, categoría o búsqueda.</li>
                  <li>Consulta los indicadores (tarjetas superiores) para totales rápidos.</li>
                  <li>Usa el <strong>Oráculo IA</strong> para obtener análisis estratégicos.</li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">🎯 Objetivo</h3>
                <p className="text-sm">Mantener un control organizado, identificar aportes de jugadores y detectar escasez de recursos.</p>
              </section>
            </div>
            <div className="p-4 border-t border-slate-700 bg-slate-900/50 text-center">
              <button 
                onClick={() => setShowGuide(false)}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Section */}
        <StatsOverview items={filteredItems} players={PLAYERS} />

        {/* AI Section */}
        <AIAdvisor items={filteredItems} />

        {/* Analytics Section */}
        <AnalyticsCharts items={filteredItems} />

        {/* Filter Bar */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 sticky top-20 z-40 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Buscar objeto..."
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
              <Filter size={18} className="text-slate-400" />
              <select 
                className="bg-transparent text-slate-200 focus:outline-none text-sm w-full md:w-auto cursor-pointer"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="All">Todas las Categorías</option>
                {Object.values(ItemCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Player Filter */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
              <Filter size={18} className="text-slate-400" />
              <select 
                className="bg-transparent text-slate-200 focus:outline-none text-sm w-full md:w-auto cursor-pointer"
                value={filters.player}
                onChange={(e) => handleFilterChange('player', e.target.value)}
              >
                <option value="All">Todos los Jugadores</option>
                {PLAYERS.map(player => (
                  <option key={player.id} value={player.id}>{player.name}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Inventory List */}
        <div className="mb-8">
           <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
             <span className="w-2 h-8 bg-indigo-500 rounded-full block"></span>
             Listado de Objetos
           </h2>
           <InventoryTable items={filteredItems} />
        </div>

      </main>
    </div>
  );
}

export default App;