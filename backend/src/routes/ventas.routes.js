import express from 'express';
import { 
  crearVenta, 
  obtenerVentas, 
  obtenerVentasConDetalle 
} from '../controllers/ventas.controller.js';

const router = express.Router();

router.post('/', crearVenta);
router.get('/', obtenerVentas);


router.get('/detalle', obtenerVentasConDetalle);

export default router;