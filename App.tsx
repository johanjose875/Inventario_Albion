import React, { useState, useMemo, useEffect } from 'react';
import { ItemCategory, FilterState, User, Role, InventoryItem } from './types';
import { 
  getInventory, initStorage, getMovements, getUsers 
} from './services/storageService';
import StatsOverview from './components/StatsOverview';
import InventoryTable from './components/InventoryTable';
import AnalyticsCharts from './components/AnalyticsCharts';
import AIAdvisor from './components/AIAdvisor';
import Login from './components/Login';
import MovementModal from './components/MovementModal';
import EditItemModal from './components/EditItemModal';
import MovementsHistory from './components/MovementsHistory';
import UserManagement from './components/UserManagement';
import { Search, Filter, Gamepad2, X, LogOut, PackagePlus, History, Users as UsersIcon, LayoutGrid } from 'lucide-react';
import { PLAYERS } from './constants';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState(getInventory());
  const [movements, setMovements] = useState(getMovements());
  const [usersList, setUsersList] = useState(getUsers());
  const [currentView, setCurrentView] = useState<'INVENTORY' | 'MOVEMENTS' | 'USERS'>('INVENTORY');
  
  const [showGuide, setShowGuide] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
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
    <div className="min-h-screen pb-20 font-inter relative">
      {/* Navigation */}
      <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/20 hover:scale-110 transition-transform">
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${currentView === 'INVENTORY' ? 'bg-slate-800 text-indigo-400 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                <LayoutGrid size={18} /> Inventario
              </button>
              <button
                onClick={() => setCurrentView('MOVEMENTS')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${currentView === 'MOVEMENTS' ? 'bg-slate-800 text-indigo-400 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                <History size={18} /> Movimientos
              </button>
              {user.role === Role.ADMIN && (
                <button
                  onClick={() => setCurrentView('USERS')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${currentView === 'USERS' ? 'bg-slate-800 text-indigo-400 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                  <UsersIcon size={18} /> Usuarios
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="text-right hidden sm:block">
                 <div className="text-xs text-slate-400">Hola,</div>
                 <div className="text-sm font-bold text-white">{user.username}</div>
               </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex justify-around bg-slate-900/95 backdrop-blur-md border-b border-slate-700 p-2 sticky top-16 z-40">
         <button onClick={() => setCurrentView('INVENTORY')} className={`p-2 rounded transition-all ${currentView === 'INVENTORY' ? 'bg-slate-700 text-white scale-110' : 'text-slate-400'}`}><LayoutGrid size={20}/></button>
         <button onClick={() => setCurrentView('MOVEMENTS')} className={`p-2 rounded transition-all ${currentView === 'MOVEMENTS' ? 'bg-slate-700 text-white scale-110' : 'text-slate-400'}`}><History size={20}/></button>
         {user.role === Role.ADMIN && (
           <button onClick={() => setCurrentView('USERS')} className={`p-2 rounded transition-all ${currentView === 'USERS' ? 'bg-slate-700 text-white scale-110' : 'text-slate-400'}`}><UsersIcon size={20}/></button>
         )}
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
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

      {/* Modals */}
      <MovementModal 
        isOpen={showMovementModal} 
        onClose={() => setShowMovementModal(false)}
        items={items}
        currentUser={user.username}
        onSuccess={refreshData}
      />

      <EditItemModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        onSuccess={refreshData}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ease-in-out">
        
        {currentView === 'INVENTORY' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center mb-6">
               <StatsOverview items={filteredItems} players={PLAYERS} />
            </div>

            <AIAdvisor items={filteredItems} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <AnalyticsCharts items={filteredItems} />
            </div>

            {/* Actions & Filters */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 sticky top-20 md:top-24 z-30 shadow-xl backdrop-blur-md bg-opacity-95 transition-all hover:border-slate-600">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                
                <div className="flex flex-col sm:flex-row flex-1 gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Buscar objeto..."
                        className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500 transition-all hover:border-slate-600"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 transition-all hover:border-slate-600">
                    <Filter size={18} className="text-slate-400 shrink-0" />
                    <select 
                        className="bg-transparent text-slate-200 focus:outline-none text-sm w-full cursor-pointer"
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:scale-105 active:scale-95"
                >
                  <PackagePlus size={20} /> <span className="hidden sm:inline">Registrar</span> Movimiento
                </button>

              </div>
            </div>

            <InventoryTable items={filteredItems} onEdit={setEditingItem} />
          </div>
        )}

        {currentView === 'MOVEMENTS' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <MovementsHistory movements={movements} />
          </div>
        )}

        {currentView === 'USERS' && user.role === Role.ADMIN && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <UserManagement users={usersList} currentUser={user} onUpdate={refreshData} />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;