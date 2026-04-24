import express from 'express';
import cors from 'cors';

import productosRoutes from './routes/products.routes.js';
import paypalRoutes from './routes/paypal.routes.js';
import ventasRoutes from './routes/ventas.routes.js';

import './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', productosRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/ventas', ventasRoutes);

export default app;