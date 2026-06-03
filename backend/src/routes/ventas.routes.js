import express from 'express';
import { 
  crearVenta, 
  obtenerVentas, 
  obtenerVentasConDetalle,
  registrarPedidoCancelado
} from '../controllers/ventas.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, crearVenta);
router.post('/cancelado', authMiddleware, registrarPedidoCancelado);
router.get('/', authMiddleware, obtenerVentas);
router.get('/detalle', authMiddleware, obtenerVentasConDetalle);

export default router;