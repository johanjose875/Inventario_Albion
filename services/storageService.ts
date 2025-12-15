import { InventoryItem, User, Movement, Role, MovementType } from '../types';
// Remove MOCK_INVENTORY import since we want to start empty
// import { MOCK_INVENTORY } from '../constants'; 

const KEYS = {
  USERS: 'guildvault_users',
  INVENTORY: 'guildvault_inventory',
  MOVEMENTS: 'guildvault_movements',
  SESSION: 'guildvault_session'
};

// Initialize Storage with default data if empty
export const initStorage = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    const defaultAdmin: User = { username: 'admin', password: 'admin', role: Role.ADMIN };
    localStorage.setItem(KEYS.USERS, JSON.stringify([defaultAdmin]));
  }
  if (!localStorage.getItem(KEYS.INVENTORY)) {
    // Start with empty array instead of MOCK_INVENTORY
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.MOVEMENTS)) {
    localStorage.setItem(KEYS.MOVEMENTS, JSON.stringify([]));
  }
};

// User Management
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
};

export const saveUser = (user: User): boolean => {
  const users = getUsers();
  if (users.find(u => u.username === user.username)) return false; // User exists
  users.push(user);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return true;
};

export const updateUserRole = (username: string, newRole: Role) => {
  const users = getUsers();
  const updatedUsers = users.map(u => u.username === username ? { ...u, role: newRole } : u);
  localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
};

export const loginUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};

// Inventory Management
export const getInventory = (): InventoryItem[] => {
  return JSON.parse(localStorage.getItem(KEYS.INVENTORY) || '[]');
};

export const saveInventoryItem = (item: InventoryItem, isNew: boolean, user: string) => {
  let items = getInventory();
  
  if (isNew) {
    items.push(item);
    addMovement({
      id: Date.now().toString(),
      itemId: item.id,
      itemName: item.name,
      type: MovementType.CREATE,
      quantity: item.quantity,
      user,
      date: new Date().toISOString(),
      reason: 'Creación de nuevo producto'
    });
  } else {
    items = items.map(i => i.id === item.id ? item : i);
  }
  
  localStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));
};

export const editInventoryItem = (updatedItem: InventoryItem) => {
  let items = getInventory();
  items = items.map(i => i.id === updatedItem.id ? updatedItem : i);
  localStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));
};

export const updateStock = (itemId: string, quantityChange: number, type: MovementType, user: string, reason: string) => {
  const items = getInventory();
  const itemIndex = items.findIndex(i => i.id === itemId);
  
  if (itemIndex > -1) {
    const item = items[itemIndex];
    // Prevent negative stock
    if (type === MovementType.OUT && item.quantity < quantityChange) {
      throw new Error("No hay suficiente stock");
    }

    const newQuantity = type === MovementType.IN 
      ? item.quantity + quantityChange 
      : item.quantity - quantityChange;

    items[itemIndex] = { ...item, quantity: newQuantity };
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));

    // Log movement
    addMovement({
      id: Date.now().toString(),
      itemId: item.id,
      itemName: item.name,
      type,
      quantity: quantityChange,
      user,
      date: new Date().toISOString(),
      reason
    });
  }
};

// Movements
export const getMovements = (): Movement[] => {
  const movs = JSON.parse(localStorage.getItem(KEYS.MOVEMENTS) || '[]');
  // Sort by date desc
  return movs.sort((a: Movement, b: Movement) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const addMovement = (movement: Movement) => {
  const movements = getMovements();
  movements.unshift(movement); // Add to beginning
  localStorage.setItem(KEYS.MOVEMENTS, JSON.stringify(movements));
};