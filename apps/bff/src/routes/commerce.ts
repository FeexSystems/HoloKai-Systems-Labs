import { Router } from 'express';
import { mockProducts, mockSubscriptions } from '../data/commerce.js';

export const commerceRouter = Router();

commerceRouter.get('/products', (req, res) => {
  res.json(mockProducts);
});

commerceRouter.get('/subscriptions', (req, res) => {
  res.json(mockSubscriptions);
});

commerceRouter.post('/checkout', (req, res) => {
  const { items } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Mock checkout process
  res.json({
    success: true,
    transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`,
    message: 'Checkout successful! Welcome to the Vanguard.'
  });
});
