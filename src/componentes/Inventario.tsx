import { useEffect, useState } from "react";
import { obtenerInventario, ItemInventario } from "../servicios/inventarioService";

export default function Inventario() {
  const [items, setItems] = useState<ItemInventario[]>([]);

  useEffect(() => {
    obtenerInventario()
      .then(setItems)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Inventario del Gremio</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.item_id}>
              <td>{item.nombre}</td>
              <td>{item.categoria}</td>
              <td>{item.cantidad}</td>
              <td>{item.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
