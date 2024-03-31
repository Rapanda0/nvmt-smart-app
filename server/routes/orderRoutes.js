

const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/orders', async (req, res) => {
  try {
    const { supplier_id, total_amount } = req.body;
    const newOrder = await pool.query(
      'INSERT INTO orders (supplier_id, total_amount) VALUES ($1, $2) RETURNING *',
      [supplier_id, total_amount]
    );
    res.status(201).json(newOrder.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


router.get('/orders', async (req, res) => {
  try {
    const allOrders = await pool.query('SELECT * FROM orders');
    res.json(allOrders.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (order.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


router.put('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier_id, total_amount } = req.body;
    const updatedOrder = await pool.query(
      'UPDATE orders SET supplier_id = $1, total_amount = $2 WHERE id = $3 RETURNING *',
      [supplier_id, total_amount, id]
    );
    if (updatedOrder.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


router.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    if (deletedOrder.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
