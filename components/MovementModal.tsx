import React, { useState, useEffect } from 'react';
import { InventoryItem, MovementType, ItemCategory, Rarity } from '../types';
import { X, ArrowUpRight, ArrowDownLeft, Plus, Coins } from 'lucide-react';
import { updateStock, saveInventoryItem } from '../services/storageService';
import { formatCurrency } from '../constants';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  currentUser: string;
  onSuccess: () => void;
}

const MovementModal: React.FC<MovementModalProps> = ({ isOpen, onClose, items, currentUser, onSuccess }) => {
  const [type, setType] = useState<MovementType>(MovementType.IN);
  const [isNewItem, setIsNewItem] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');

  // New Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>(ItemCategory.MATERIAL);
  const [newItemRarity, setNewItemRarity] = useState<Rarity>(Rarity.T1);
  const [unitPrice, setUnitPrice] = useState(0);

  // Common State
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length > 0) {
      setSelectedItemId(items[0].id);
    }
  }, [items, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (type === MovementType.IN && isNewItem) {
        if (!newItemName.trim()) throw new Error("Debes escribir el nombre del objeto.");
        
        const newItem: InventoryItem = {
          id: Date.now().toString(),
          name: newItemName,
          category: newItemCategory,
          quantity: quantity,
          obtainedBy: { username: currentUser, role: 'USER' } as any,
          dateAcquired: new Date().toISOString(),
          rarity: newItemRarity,
          value: unitPrice // Store Unit Price
        };

        saveInventoryItem(newItem, true, currentUser);
      } else {
        if (!selectedItemId) throw new Error("Selecciona un objeto de la lista o crea uno nuevo.");
        updateStock(selectedItemId, quantity, type, currentUser, reason);
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    setQuantity(1);
    setReason('');
    setIsNewItem(false);
    setNewItemName('');
    setUnitPrice(0);
    setError('');
    onClose();
  };

  // Calculate total for preview
  const estimatedTotal = unitPrice * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-800 z-10">
          <h2 className="text-xl font-bold text-white">Registrar Movimiento</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => { setType(MovementType.IN); }}
              className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 font-medium transition-all ${
                type === MovementType.IN 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <ArrowDownLeft size={20} /> Entrada
            </button>
            <button
              type="button"
              onClick={() => { setType(MovementType.OUT); setIsNewItem(false); }}
              className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 font-medium transition-all ${
                type === MovementType.OUT 
                  ? 'bg-red-500/20 border-red-500 text-red-400' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <ArrowUpRight size={20} /> Salida
            </button>
          </div>

          {type === MovementType.IN && (
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setIsNewItem(false)}
                className={`flex-1 py-1.5 text-sm rounded font-medium transition-colors ${!isNewItem ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Sumar a Existente
              </button>
              <button
                type="button"
                onClick={() => setIsNewItem(true)}
                className={`flex-1 py-1.5 text-sm rounded font-medium transition-colors ${isNewItem ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Crear Nuevo Objeto
              </button>
            </div>
          )}

          {!isNewItem ? (
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                {items.length === 0 ? 'No hay objetos registrados' : 'Seleccionar Objeto'}
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                disabled={items.length === 0}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                {items.length === 0 && <option value="">Inventario vacío</option>}
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} (Stock: {item.quantity})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 border border-indigo-500/30 bg-indigo-500/5 p-4 rounded-xl">
               <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">Nombre del Objeto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Madera de Roble T5"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1">Categoría</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.values(ItemCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1">Tier (Nivel)</label>
                  <select
                    value={newItemRarity}
                    onChange={(e) => setNewItemRarity(e.target.value as Rarity)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.values(Rarity).map(rar => (
                      <option key={rar} value={rar}>{rar}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">Precio Unitario</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500" size={16} />
                </div>
                {unitPrice > 0 && quantity > 0 && (
                   <div className="text-right text-xs text-yellow-500 mt-1 font-mono">
                     Total Calculado: {formatCurrency(estimatedTotal)}
                   </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Cantidad</label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 font-mono text-lg"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Motivo (Opcional)</label>
            <input
              type="text"
              placeholder={type === MovementType.IN ? "Ej: Recolección, Crafting..." : "Ej: Venta, Uso..."}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={!isNewItem && items.length === 0}
              className={`w-full py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                 type === MovementType.IN 
                 ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                 : 'bg-red-600 hover:bg-red-500 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {type === MovementType.IN 
                ? (isNewItem ? <><Plus size={20} /> Crear y Agregar</> : <><ArrowDownLeft size={20} /> Confirmar Entrada</>) 
                : <><ArrowUpRight size={20} /> Confirmar Salida</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementModal;