import db from '../config/db.js';

export function getProductos(req, res) {
  const sql = `
    SELECT 
      p.id_producto AS idProducto,
      p.nombre,
      p.descripcion,
      p.precio,
      p.imagen,
      c.nombre_categoria AS categoria,
      p.stock AS cantidad,
      p.estado_stock AS estado
    FROM productos p
    JOIN categorias c
      ON p.id_categoria = c.id_categoria
  `;

  db.query(sql, (error, resultados) => {
    if (error) {
      console.error('Error al obtener productos:', error);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }

    res.json(resultados);
  });
}

export function getCategoriasPublic(req, res) {
  const sql = `
    SELECT id_categoria, nombre_categoria, descripcion, estado
    FROM categorias
    WHERE estado = 'activa'
    ORDER BY id_categoria ASC
  `;

  db.query(sql, (error, resultados) => {
    if (error) {
      console.error('Error al obtener categorías:', error);
      return res.status(500).json({ error: 'Error al obtener categorías' });
    }

    res.json(resultados);
  });
}