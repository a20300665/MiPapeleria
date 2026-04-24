import db from '../config/db.js';

export function getProductos(req, res) {
  const sql = `
    SELECT 
      id_producto AS idProducto,
      nombre,
      descripcion,
      precio,
      imagen,
      id_categoria AS categoria,
      stock AS cantidad,
      estado_stock AS estado
    FROM productos
  `;

  db.query(sql, (error, resultados) => {
    if (error) {
      console.error('Error al obtener productos:', error);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }

    res.json(resultados);
  });
}