export enum ItemCategory {
  WEAPON = 'Arma',
  ARMOR = 'Armadura',
  MATERIAL = 'Material',
  CONSUMABLE = 'Consumible',
  KEY_ITEM = 'Objeto Clave'
}

export enum Rarity {
  COMMON = 'Común',
  RARE = 'Raro',
  EPIC = 'Épico',
  LEGENDARY = 'Legendario'
}

export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  obtainedBy: Player;
  dateAcquired: string; // ISO Date string
  rarity: Rarity;
  value: number; // Gold value estimate
}

export interface FilterState {
  search: string;
  category: string; // 'All' or ItemCategory value
  player: string; // 'All' or Player ID
  rarity: string; // 'All' or Rarity value
}