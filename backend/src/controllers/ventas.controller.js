import db from '../config/db.js';

// ======================================================
// CREAR VENTA (PAGADA)
// ======================================================
export function crearVenta(req, res) {
  console.log('BODY RECIBIDO:', req.body);

  try {
    const { productos, total, metodo_pago, id_transaccion } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'No hay productos para guardar' });
    }

    const iva = Number((total * 0.16).toFixed(2));
    const subtotal = Number((total - iva).toFixed(2));

    const idUsuario = req.user?.id || 1;

    const sqlVenta = `
      INSERT INTO ventas 
      (id_usuario, subtotal, iva, total, fecha, metodo_pago, id_transaccion, estado_pago)
      VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)
    `;

    db.query(
      sqlVenta,
      [idUsuario, subtotal, iva, total, metodo_pago, id_transaccion, 'Pagado'],
      (error, result) => {
        if (error) {
          console.error('❌ ERROR MYSQL EN VENTA:', error);
          return res.status(500).json({ error: error.message });
        }

        const idVenta = result.insertId;
        console.log('ID venta:', idVenta);

        const sqlDetalle = `
          INSERT INTO venta_detalle 
          (id_venta, id_producto, cantidad, precio_unitario, subtotal)
          VALUES ?
        `;

        const valores = productos.map(p => [
          idVenta,
          p.product.idProducto,
          p.cantidad,
          p.product.precio,
          p.product.precio * p.cantidad
        ]);

        db.query(sqlDetalle, [valores], (error2) => {
          if (error2) {
            console.error('❌ Error detalle:', error2);
            return res.status(500).json({ error: error2.message });
          }

          res.json({ mensaje: 'Venta guardada correctamente' });
        });
      }
    );
  } catch (error) {
    console.error('❌ Error general:', error);
    res.status(500).json({ error: 'Error general' });
  }
}

// ======================================================
// REGISTRAR PEDIDO CANCELADO
// ======================================================
export function registrarPedidoCancelado(req, res) {
  console.log('BODY RECIBIDO CANCELADO:', req.body);

  try {
    const { productos, total, metodo_pago, id_transaccion } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'No hay productos para guardar' });
    }

    const iva = Number((total * 0.16).toFixed(2));
    const subtotal = Number((total - iva).toFixed(2));

    const idUsuario = req.user?.id || 1;

    const sqlVenta = `
      INSERT INTO ventas 
      (id_usuario, subtotal, iva, total, fecha, metodo_pago, id_transaccion, estado_pago)
      VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)
    `;

    db.query(
      sqlVenta,
      [idUsuario, subtotal, iva, total, metodo_pago, id_transaccion || 'CANCELADO', 'Cancelado'],
      (error, result) => {
        if (error) {
          console.error('❌ ERROR MYSQL EN CANCELADO:', error);
          return res.status(500).json({ error: error.message });
        }

        const idVenta = result.insertId;
        console.log('ID venta cancelada:', idVenta);

        const sqlDetalle = `
          INSERT INTO venta_detalle 
          (id_venta, id_producto, cantidad, precio_unitario, subtotal)
          VALUES ?
        `;

        const valores = productos.map(p => [
          idVenta,
          p.product.idProducto,
          p.cantidad,
          p.product.precio,
          p.product.precio * p.cantidad
        ]);

        db.query(sqlDetalle, [valores], (error2) => {
          if (error2) {
            console.error('❌ Error detalle cancelado:', error2);
            return res.status(500).json({ error: error2.message });
          }

          res.json({ mensaje: 'Pedido cancelado guardado correctamente' });
        });
      }
    );
  } catch (error) {
    console.error('❌ Error general:', error);
    res.status(500).json({ error: 'Error general' });
  }
}

// ======================================================
// OBTENER SOLO VENTAS DEL USUARIO ACTIVO
// ======================================================
export function obtenerVentas(req, res) {
  const idUsuario = req.user?.id || 1;

  const sql = `
    SELECT *
    FROM ventas
    WHERE id_usuario = ?
    ORDER BY fecha DESC, id_venta DESC
  `;

  db.query(sql, [idUsuario], (error, resultados) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener ventas' });
    }

    res.json(resultados);
  });
}

// ======================================================
// OBTENER VENTAS CON PRODUCTOS DEL USUARIO ACTIVO
// ======================================================
export function obtenerVentasConDetalle(req, res) {
  const idUsuario = req.user?.id || 1;

  const sql = `
    SELECT 
      v.id_venta,
      v.fecha,
      v.iva,
      v.subtotal,
      v.total,
      v.metodo_pago,
      v.estado_pago,
      d.cantidad,
      d.precio_unitario,
      p.nombre,
      p.imagen
    FROM ventas v
    JOIN venta_detalle d ON v.id_venta = d.id_venta
    JOIN productos p ON d.id_producto = p.id_producto
    WHERE v.id_usuario = ?
    ORDER BY v.fecha DESC, v.id_venta DESC
  `;

  db.query(sql, [idUsuario], (error, resultados) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener detalle' });
    }

    const pedidos = {};

    resultados.forEach(row => {
      if (!pedidos[row.id_venta]) {
        pedidos[row.id_venta] = {
          id_venta: row.id_venta,
          fecha: row.fecha,
          iva: row.iva,
          subtotal: row.subtotal,
          total: row.total,
          metodo_pago: row.metodo_pago,
          estado_pago: row.estado_pago,
          productos: []
        };
      }

      pedidos[row.id_venta].productos.push({
        nombre: row.nombre,
        cantidad: row.cantidad,
        precio: row.precio_unitario,
        imagen: row.imagen,
        subtotal: row.precio_unitario * row.cantidad
      });
    });

    res.json(Object.values(pedidos));
  });
}