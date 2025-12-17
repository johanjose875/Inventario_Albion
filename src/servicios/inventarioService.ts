export interface ItemInventario {
  item_id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
}

export async function obtenerInventario(): Promise<ItemInventario[]> {
  const response = await fetch('/data/inventario.json');
  if (!response.ok) {
    throw new Error('No se pudo cargar el inventario');
  }
  return response.json();
}
