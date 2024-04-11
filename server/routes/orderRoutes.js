const express = require('express');
const pool = require('../db');
const router = express.Router();


router.post('/orders', async (req, res) => {
  const client = await pool.connect();

  try {
    const { supplier_id, items } = req.body; 
    await client.query('BEGIN');

    
    const orderRes = await client.query(
      'INSERT INTO orders (supplier_id) VALUES ($1) RETURNING id',
      [supplier_id]
    );
    const orderId = orderRes.rows[0].id;

    
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, inventory_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.inventory_id, item.quantity]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Order created successfully', orderId: orderId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.message);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
});

module.exports = router;

