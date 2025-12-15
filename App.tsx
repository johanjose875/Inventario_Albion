import React, { useState, useMemo, useEffect } from 'react';
import { ItemCategory, FilterState, User, Role } from './types';
import { 
  getInventory, initStorage, getMovements, getUsers 
} from './services/storageService';
import StatsOverview from './components/StatsOverview';
import InventoryTable from './components/InventoryTable';
import AnalyticsCharts from './components/AnalyticsCharts';
import AIAdvisor from './components/AIAdvisor';
import Login from './components/Login';
import MovementModal from './components/MovementModal';
import MovementsHistory from './components/MovementsHistory';
import UserManagement from './components/UserManagement';
import { Search, Filter, HelpCircle, Gamepad2, X, LogOut, PackagePlus, History, Users as UsersIcon, LayoutGrid } from 'lucide-react';
import { PLAYERS } from './constants'; // Only keeping players for avatar mapping

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState(getInventory());
  const [movements, setMovements] = useState(getMovements());
  const [usersList, setUsersList] = useState(getUsers());
  const [currentView, setCurrentView] = useState<'INVENTORY' | 'MOVEMENTS' | 'USERS'>('INVENTORY');
  
  const [showGuide, setShowGuide] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    player: 'All',
    rarity: 'All'
  });

  // Initialize Storage once on mount
  useEffect(() => {
    initStorage();
    setItems(getInventory());
  }, []);

  const refreshData = () => {
    setItems(getInventory());
    setMovements(getMovements());
    setUsersList(getUsers());
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('INVENTORY');
  };

  // Filter Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || item.category === filters.category;
      
      // Map 'obtainedBy' correctly. In storage it might be a User object or Player object
      // For simplicity in filter, we just check name match if possible or ID
      const itemOwnerId = 'id' in item.obtainedBy ? item.obtainedBy.id : (item.obtainedBy as any).username;
      const matchesPlayer = filters.player === 'All' || itemOwnerId === filters.player;
      
      return matchesSearch && matchesCategory && matchesPlayer;
    });
  }, [items, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-900 text-slate-200 font-inter">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Gamepad2 className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent hidden sm:inline-block">
                GuildVault
              </span>
            </div>
            
            {/* Main Tabs */}
            <div className="hidden md:flex space-x-1">
              <button
                onClick={() => setCurrentView('INVENTORY')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'INVENTORY' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutGrid size={18} /> Inventario
              </button>
              <button
                onClick={() => setCurrentView('MOVEMENTS')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'MOVEMENTS' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
              >
                <History size={18} /> Movimientos
              </button>
              {user.role === Role.ADMIN && (
                <button
                  onClick={() => setCurrentView('USERS')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'USERS' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                >
                  <UsersIcon size={18} /> Usuarios
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                 <div className="text-xs text-slate-400">Hola,</div>
                 <div className="text-sm font-bold text-white">{user.username}</div>
               </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex justify-around bg-slate-800 border-b border-slate-700 p-2">
         <button onClick={() => setCurrentView('INVENTORY')} className={`p-2 rounded ${currentView === 'INVENTORY' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}><LayoutGrid size={20}/></button>
         <button onClick={() => setCurrentView('MOVEMENTS')} className={`p-2 rounded ${currentView === 'MOVEMENTS' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}><History size={20}/></button>
         {user.role === Role.ADMIN && (
           <button onClick={() => setCurrentView('USERS')} className={`p-2 rounded ${currentView === 'USERS' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}><UsersIcon size={20}/></button>
         )}
      </div>

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
               <p>Usa las pestañas para navegar entre el Inventario y el Historial.</p>
            </div>
          </div>
        </div>
      )}

      {/* Movement Modal */}
      <MovementModal 
        isOpen={showMovementModal} 
        onClose={() => setShowMovementModal(false)}
        items={items}
        currentUser={user.username}
        onSuccess={refreshData}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentView === 'INVENTORY' && (
          <>
            <div className="flex justify-between items-center mb-6">
               <StatsOverview items={filteredItems} players={PLAYERS} />
            </div>

            <AIAdvisor items={filteredItems} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <AnalyticsCharts items={filteredItems} />
            </div>

            {/* Actions & Filters */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 sticky top-20 z-40 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                
                <div className="flex flex-1 gap-4">
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
                    <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
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
                </div>

                <button 
                  onClick={() => setShowMovementModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 whitespace-nowrap"
                >
                  <PackagePlus size={20} /> Registrar Movimiento
                </button>

              </div>
            </div>

            <InventoryTable items={filteredItems} />
          </>
        )}

        {currentView === 'MOVEMENTS' && (
          <MovementsHistory movements={movements} />
        )}

        {currentView === 'USERS' && user.role === Role.ADMIN && (
          <UserManagement users={usersList} currentUser={user} onUpdate={refreshData} />
        )}

      </main>
    </div>
  );
}

export default App;