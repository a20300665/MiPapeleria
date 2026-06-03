import express from 'express';
import { getProductos, getCategoriasPublic } from '../controllers/products.controller.js';

const router = express.Router();

router.get('/productos', getProductos);
router.get('/categorias', getCategoriasPublic);

export default router;