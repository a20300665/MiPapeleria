import db from '../config/db.js';


// ======================================================
// 🔥 CREAR VENTA
// ======================================================
export function crearVenta(req, res) {

  console.log('BODY RECIBIDO:', req.body);

  try {
    const { productos, total, metodo_pago, id_transaccion } = req.body;

    const sqlVenta = `
      INSERT INTO ventas (id_usuario, total, fecha, metodo_pago, id_transaccion, estado_pago)
      VALUES (?, ?, NOW(), ?, ?, ?)
    `;

    db.query(
      sqlVenta,
      [1, total, metodo_pago, id_transaccion, 'COMPLETADO'],
      (error, result) => {

        if (error) {
          console.error("❌ ERROR MYSQL:", error);
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
          p.product.idProducto, // ✅ AQUÍ EL FIX
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
// 📦 OBTENER SOLO VENTAS
// ======================================================
export function obtenerVentas(req, res) {

  const sql = `
    SELECT * FROM ventas
    ORDER BY fecha DESC
  `;

  db.query(sql, (error, resultados) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener ventas' });
    }

    res.json(resultados);
  });
}



// ======================================================
// 🚀 OBTENER VENTAS CON PRODUCTOS (PRO 🔥)
// ======================================================
export function obtenerVentasConDetalle(req, res) {

  const sql = `
  SELECT 
    v.id_venta,
    v.fecha,
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
  ORDER BY v.fecha DESC
`;

  db.query(sql, (error, resultados) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener detalle' });
    }

    // 🔥 AGRUPAR POR PEDIDO
    const pedidos = {};

    resultados.forEach(row => {

      if (!pedidos[row.id_venta]) {
        pedidos[row.id_venta] = {
          id_venta: row.id_venta,
          fecha: row.fecha,
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