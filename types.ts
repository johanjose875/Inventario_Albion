export enum ItemCategory {
  WEAPON = 'Arma',
  ARMOR = 'Armadura',
  MATERIAL = 'Material',
  CONSUMABLE = 'Consumible',
  KEY_ITEM = 'Objeto Clave'
}

export enum Rarity {
  T1 = 'Tier 1',
  T2 = 'Tier 2',
  T3 = 'Tier 3',
  T4 = 'Tier 4',
  T5 = 'Tier 5',
  T6 = 'Tier 6',
  T7 = 'Tier 7',
  T8 = 'Tier 8'
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  username: string;
  role: Role;
  password?: string;
}

export interface Player {
  id: string;
  name: string;
  avatarUrl?: string; // Optional now
  role: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  obtainedBy: Player | User; 
  dateAcquired: string; 
  rarity: Rarity; // Used for Tier
  value: number; // Unit Price
}

export enum MovementType {
  IN = 'ENTRADA',
  OUT = 'SALIDA',
  CREATE = 'CREACIÓN'
}

export interface Movement {
  id: string;
  itemId: string;
  itemName: string;
  type: MovementType;
  quantity: number;
  user: string;
  date: string;
  reason?: string;
}

export interface FilterState {
  search: string;
  category: string; 
  player: string;
  rarity: string;
}