import { InventoryItem, ItemCategory, Player, Rarity } from './types';

export const PLAYERS: Player[] = [
  { id: 'p1', name: 'Aragorn', role: 'Guerrero', avatarUrl: 'https://picsum.photos/id/1005/50/50' },
  { id: 'p2', name: 'Legolas', role: 'Arquero', avatarUrl: 'https://picsum.photos/id/1011/50/50' },
  { id: 'p3', name: 'Gimli', role: 'Tanque', avatarUrl: 'https://picsum.photos/id/1025/50/50' },
  { id: 'p4', name: 'Gandalf', role: 'Mago', avatarUrl: 'https://picsum.photos/id/1062/50/50' },
  { id: 'p5', name: 'Frodo', role: 'Portador', avatarUrl: 'https://picsum.photos/id/1074/50/50' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'i1',
    name: 'Espada de Acero Valyrio',
    category: ItemCategory.WEAPON,
    quantity: 2,
    obtainedBy: PLAYERS[0],
    dateAcquired: '2023-10-15',
    rarity: Rarity.EPIC,
    value: 5000
  },
  {
    id: 'i2',
    name: 'Poción de Vida Mayor',
    category: ItemCategory.CONSUMABLE,
    quantity: 150,
    obtainedBy: PLAYERS[3],
    dateAcquired: '2023-10-18',
    rarity: Rarity.COMMON,
    value: 50
  },
  {
    id: 'i3',
    name: 'Placa de Dragón',
    category: ItemCategory.ARMOR,
    quantity: 1,
    obtainedBy: PLAYERS[2],
    dateAcquired: '2023-10-20',
    rarity: Rarity.LEGENDARY,
    value: 12000
  },
  {
    id: 'i4',
    name: 'Hierba de Reyes',
    category: ItemCategory.MATERIAL,
    quantity: 45,
    obtainedBy: PLAYERS[4],
    dateAcquired: '2023-10-21',
    rarity: Rarity.RARE,
    value: 150
  },
  {
    id: 'i5',
    name: 'Arco de Hueso de Dragón',
    category: ItemCategory.WEAPON,
    quantity: 1,
    obtainedBy: PLAYERS[1],
    dateAcquired: '2023-10-22',
    rarity: Rarity.EPIC,
    value: 4500
  },
  {
    id: 'i6',
    name: 'Mineral de Mitril',
    category: ItemCategory.MATERIAL,
    quantity: 30,
    obtainedBy: PLAYERS[2],
    dateAcquired: '2023-10-25',
    rarity: Rarity.RARE,
    value: 300
  },
  {
    id: 'i7',
    name: 'Pergamino de Teletransporte',
    category: ItemCategory.CONSUMABLE,
    quantity: 12,
    obtainedBy: PLAYERS[3],
    dateAcquired: '2023-10-26',
    rarity: Rarity.COMMON,
    value: 100
  },
  {
    id: 'i8',
    name: 'Fragmento de Estrella',
    category: ItemCategory.MATERIAL,
    quantity: 3,
    obtainedBy: PLAYERS[3],
    dateAcquired: '2023-10-28',
    rarity: Rarity.LEGENDARY,
    value: 5000
  },
  {
    id: 'i9',
    name: 'Botas de Elfo',
    category: ItemCategory.ARMOR,
    quantity: 4,
    obtainedBy: PLAYERS[1],
    dateAcquired: '2023-10-29',
    rarity: Rarity.RARE,
    value: 800
  },
  {
    id: 'i10',
    name: 'Daga Oxidada',
    category: ItemCategory.WEAPON,
    quantity: 25,
    obtainedBy: PLAYERS[4],
    dateAcquired: '2023-11-01',
    rarity: Rarity.COMMON,
    value: 10
  }
];

export const RARITY_COLORS: Record<string, string> = {
  [Rarity.COMMON]: 'text-slate-400 bg-slate-400/10',
  [Rarity.RARE]: 'text-blue-400 bg-blue-400/10',
  [Rarity.EPIC]: 'text-purple-400 bg-purple-400/10',
  [Rarity.LEGENDARY]: 'text-yellow-400 bg-yellow-400/10',
};