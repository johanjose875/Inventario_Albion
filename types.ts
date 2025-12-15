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

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  username: string;
  role: Role;
  password?: string; // In a real app, this would be hashed. Storing plain for demo.
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
  obtainedBy: Player | User; // Can be a game character or a system user
  dateAcquired: string; // ISO Date string
  rarity: Rarity;
  value: number; // Gold value estimate
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
  user: string; // Username who performed the action
  date: string;
  reason?: string;
}

export interface FilterState {
  search: string;
  category: string; // 'All' or ItemCategory value
  player: string; // 'All' or Player ID
  rarity: string; // 'All' or Rarity value
}