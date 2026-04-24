import { createPaypalOrder, capturePaypalOrder } from '../services/paypal.service.js';

export async function createOrder(req, res) {
  try {
    const { items, total } = req.body;

    const order = await createPaypalOrder({ items, total });

    res.json({
      id: order.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando orden' });
  }
}

export async function captureOrder(req, res) {
  try {
    const { orderId } = req.body;

    const capture = await capturePaypalOrder(orderId);

    res.json(capture);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error capturando orden' });
  }
}