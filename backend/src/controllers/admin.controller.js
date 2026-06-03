import db from '../config/db.js';

// HELPERS
function generarSiguienteId(tabla, campo, prefijo, callback) {
  const sql = `
    SELECT ${campo} AS ultimo
    FROM ${tabla}
    WHERE ${campo} LIKE ?
    ORDER BY CAST(SUBSTRING(${campo}, 2) AS UNSIGNED) DESC
    LIMIT 1
  `;

  db.query(sql, [`${prefijo}%`], (error, results) => {
    if (error) {
      return callback(error);
    }

    if (results.length === 0 || !results[0].ultimo) {
      return callback(null, `${prefijo}001`);
    }

    const ultimoId = results[0].ultimo;
    const numero = parseInt(ultimoId.substring(1), 10) + 1;
    const nuevoId = `${prefijo}${String(numero).padStart(3, '0')}`;

    callback(null, nuevoId);
  });
}

function calcularEstadoStock(stock) {
  return Number(stock) > 0 ? 'Disponible' : 'Faltante';
}

// PRODUCTOS - CONSULTAR
export function getProductosAdmin(req, res) {
  const sql = `
    SELECT 
      p.id_producto,
      p.nombre,
      p.descripcion,
      p.precio,
      p.stock,
      p.estado_stock,
      p.imagen,
      p.id_categoria,
      p.fecha_creacion,
      p.fecha_actualizacion,
      c.nombre_categoria
    FROM productos p
    LEFT JOIN categorias c
      ON p.id_categoria = c.id_categoria
    ORDER BY p.fecha_creacion DESC, p.id_producto DESC
  `;

  db.query(sql, (error, resultados) => {
    if (error) {
      console.error('Error al obtener productos admin:', error);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }

    res.json(resultados);
  });
}

// PRODUCTOS - AGREGAR
export function createProductoAdmin(req, res) {
  const {
    id_producto,
    nombre,
    descripcion,
    precio,
    stock,
    imagen,
    id_categoria
  } = req.body;

  if (!nombre || precio === undefined || stock === undefined || !id_categoria) {
    return res.status(400).json({
      error: 'Faltan datos obligatorios para crear el producto'
    });
  }

  const estado_stock = calcularEstadoStock(stock);

  const insertarProducto = (nuevoId) => {
    const sql = `
      INSERT INTO productos
      (id_producto, nombre, descripcion, precio, stock, estado_stock, imagen, id_categoria, fecha_creacion, fecha_actualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    db.query(
      sql,
      [
        nuevoId,
        nombre,
        descripcion || null,
        Number(precio),
        Number(stock),
        estado_stock,
        imagen || null,
        id_categoria
      ],
      (error, result) => {
        if (error) {
          console.error('Error al crear producto:', error);
          return res.status(500).json({ error: error.message });
        }

        res.status(201).json({
          message: 'Producto creado correctamente',
          id_producto: nuevoId,
          insertId: result.insertId
        });
      }
    );
  };

  if (id_producto) {
    insertarProducto(id_producto);
  } else {
    generarSiguienteId('productos', 'id_producto', 'P', (error, nuevoId) => {
      if (error) {
        console.error('Error generando ID de producto:', error);
        return res.status(500).json({ error: 'Error generando ID de producto' });
      }

      insertarProducto(nuevoId);
    });
  }
}

// PRODUCTOS - EDITAR
export function updateProductoAdmin(req, res) {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    precio,
    stock,
    imagen,
    id_categoria
  } = req.body;

  const campos = [];
  const valores = [];

  if (nombre !== undefined) {
    campos.push('nombre = ?');
    valores.push(nombre);
  }

  if (descripcion !== undefined) {
    campos.push('descripcion = ?');
    valores.push(descripcion);
  }

  if (precio !== undefined) {
    campos.push('precio = ?');
    valores.push(Number(precio));
  }

  if (stock !== undefined) {
    campos.push('stock = ?');
    valores.push(Number(stock));
    campos.push('estado_stock = ?');
    valores.push(calcularEstadoStock(stock));
  }

  if (imagen !== undefined) {
    campos.push('imagen = ?');
    valores.push(imagen);
  }

  if (id_categoria !== undefined) {
    campos.push('id_categoria = ?');
    valores.push(id_categoria);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  campos.push('fecha_actualizacion = NOW()');

  const sql = `
    UPDATE productos
    SET ${campos.join(', ')}
    WHERE id_producto = ?
  `;

  valores.push(id);

  db.query(sql, valores, (error, result) => {
    if (error) {
      console.error('Error al actualizar producto:', error);
      return res.status(500).json({ error: error.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  });
}

// PRODUCTOS - ELIMINA
export function deleteProductoAdmin(req, res) {
  const { id } = req.params;

  const sql = `DELETE FROM productos WHERE id_producto = ?`;

  db.query(sql, [id], (error, result) => {
    if (error) {
      console.error('Error al eliminar producto:', error);
      return res.status(500).json({
        error: 'No se pudo eliminar el producto. Puede estar relacionado con ventas o carrito.'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  });
}

// CATEGORÍAS - CONSULTAR
export function getCategoriasAdmin(req, res) {
  const sql = `
    SELECT 
      c.id_categoria,
      c.nombre_categoria,
      c.descripcion,
      c.estado,
      COUNT(p.id_producto) AS total_productos
    FROM categorias c
    LEFT JOIN productos p
      ON p.id_categoria = c.id_categoria
    GROUP BY c.id_categoria, c.nombre_categoria, c.descripcion, c.estado
    ORDER BY c.id_categoria ASC
  `;

  db.query(sql, (error, resultados) => {
    if (error) {
      console.error('Error al obtener categorías:', error);
      return res.status(500).json({ error: 'Error al obtener categorías' });
    }

    res.json(resultados);
  });
}


// CATEGORÍAS - AGREGAR
export function createCategoriaAdmin(req, res) {
  const {
    id_categoria,
    nombre_categoria,
    descripcion,
    estado
  } = req.body;

  if (!nombre_categoria) {
    return res.status(400).json({
      error: 'El nombre de la categoría es obligatorio'
    });
  }

  const insertarCategoria = (nuevoId) => {
    const sql = `
      INSERT INTO categorias
      (id_categoria, nombre_categoria, descripcion, estado)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        nuevoId,
        nombre_categoria,
        descripcion || null,
        estado || 'activa'
      ],
      (error, result) => {
        if (error) {
          console.error('Error al crear categoría:', error);
          return res.status(500).json({ error: error.message });
        }

        res.status(201).json({
          message: 'Categoría creada correctamente',
          id_categoria: nuevoId,
          insertId: result.insertId
        });
      }
    );
  };

  if (id_categoria) {
    insertarCategoria(id_categoria);
  } else {
    generarSiguienteId('categorias', 'id_categoria', 'C', (error, nuevoId) => {
      if (error) {
        console.error('Error generando ID de categoría:', error);
        return res.status(500).json({ error: 'Error generando ID de categoría' });
      }

      insertarCategoria(nuevoId);
    });
  }
}


// CATEGORÍAS - EDITAR
export function updateCategoriaAdmin(req, res) {
  const { id } = req.params;
  const {
    nombre_categoria,
    descripcion,
    estado
  } = req.body;

  const campos = [];
  const valores = [];

  if (nombre_categoria !== undefined) {
    campos.push('nombre_categoria = ?');
    valores.push(nombre_categoria);
  }

  if (descripcion !== undefined) {
    campos.push('descripcion = ?');
    valores.push(descripcion);
  }

  if (estado !== undefined) {
    campos.push('estado = ?');
    valores.push(estado);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  const sql = `
    UPDATE categorias
    SET ${campos.join(', ')}
    WHERE id_categoria = ?
  `;

  valores.push(id);

  db.query(sql, valores, (error, result) => {
    if (error) {
      console.error('Error al actualizar categoría:', error);
      return res.status(500).json({ error: error.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría actualizada correctamente' });
  });
}

// CATEGORÍAS - ELIMINAR
export function deleteCategoriaAdmin(req, res) {
  const { id } = req.params;

  const verificarSql = `
    SELECT COUNT(*) AS total
    FROM productos
    WHERE id_categoria = ?
  `;

  db.query(verificarSql, [id], (error, resultados) => {
    if (error) {
      console.error('Error verificando categoría:', error);
      return res.status(500).json({ error: error.message });
    }

    if (resultados[0].total > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }

    const sql = `DELETE FROM categorias WHERE id_categoria = ?`;

    db.query(sql, [id], (error2, result) => {
      if (error2) {
        console.error('Error al eliminar categoría:', error2);
        return res.status(500).json({ error: error2.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      res.json({ message: 'Categoría eliminada correctamente' });
    });
  });
}