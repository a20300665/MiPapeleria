import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin.middleware.js';
import {
  getProductosAdmin,
  createProductoAdmin,
  updateProductoAdmin,
  deleteProductoAdmin,
  getCategoriasAdmin,
  createCategoriaAdmin,
  updateCategoriaAdmin,
  deleteCategoriaAdmin
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminOnly);

// Productos
router.get('/productos', getProductosAdmin);
router.post('/productos', createProductoAdmin);
router.put('/productos/:id', updateProductoAdmin);
router.delete('/productos/:id', deleteProductoAdmin);

// Categorías
router.get('/categorias', getCategoriasAdmin);
router.post('/categorias', createCategoriaAdmin);
router.put('/categorias/:id', updateCategoriaAdmin);
router.delete('/categorias/:id', deleteCategoriaAdmin);

export default router;