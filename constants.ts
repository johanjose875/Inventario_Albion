import { InventoryItem, Player } from './types';

export const PLAYERS: Player[] = [];
export const MOCK_INVENTORY: InventoryItem[] = [];

// Mapa de colores para los Tiers
export const RARITY_COLORS: Record<string, string> = {
  'Tier 1': 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  'Tier 2': 'text-green-400 bg-green-400/10 border-green-400/20',
  'Tier 3': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Tier 4': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'Tier 5': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'Tier 6': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  'Tier 7': 'text-red-400 bg-red-400/10 border-red-400/20',
  'Tier 8': 'text-pink-400 bg-pink-400/10 border-pink-400/20',
};

// Función para formatear moneda (K, M, B)
export const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return value.toLocaleString();
};