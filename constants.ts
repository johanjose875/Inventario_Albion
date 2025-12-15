import { InventoryItem, Player } from './types';

// Se eliminan los jugadores de fantasía, se mantiene la estructura vacía o genérica si es necesaria
export const PLAYERS: Player[] = [];

// Inventario vacío por defecto para que el usuario agregue sus propios datos
export const MOCK_INVENTORY: InventoryItem[] = [];

export const RARITY_COLORS: Record<string, string> = {
  'Común': 'text-slate-400 bg-slate-400/10',
  'Raro': 'text-blue-400 bg-blue-400/10',
  'Épico': 'text-purple-400 bg-purple-400/10',
  'Legendario': 'text-yellow-400 bg-yellow-400/10',
};