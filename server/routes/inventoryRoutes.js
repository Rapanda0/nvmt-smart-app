const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/categories', async (req, res) => {
  try {
    const allCategories = await pool.query('SELECT * FROM categories');
    res.json(allCategories.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;

    
    const trimmedName = name.trim();
    const existingCategory = await pool.query('SELECT * FROM categories WHERE LOWER(name) = LOWER($1)', [trimmedName]);

    if (existingCategory.rows.length > 0) {
      
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [trimmedName] 
    );

    res.status(201).json(newCategory.rows[0]);
  } catch (error) {
    console.error(error.message);
  
    res.status(500).send('Server error');
  }
});



router.post('/inventory', async (req, res) => {
  try {
    const { name, quantity, price, category_id, threshold_quantity, unit_of_measurement, supplier_id } = req.body;

    
    const trimmedName = name.trim().toLowerCase();
    
   
    const existingItem = await pool.query(
      'SELECT * FROM inventory WHERE LOWER(name) = $1 AND category_id = $2',
      [trimmedName, category_id]
    );

    if (existingItem.rows.length > 0) {
      
      const updatedQuantity = existingItem.rows[0].quantity + quantity;
      const updateResponse = await pool.query(
        'UPDATE inventory SET quantity = $1 WHERE id = $2 RETURNING *',
        [updatedQuantity, existingItem.rows[0].id]
      );
      res.json({ message: 'Inventory updated successfully', item: updateResponse.rows[0] });
    } else {
     
      const newInventoryItem = await pool.query(
        'INSERT INTO inventory (name, quantity, price, category_id, threshold_quantity, unit_of_measurement, supplier_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, quantity, price, category_id, threshold_quantity, unit_of_measurement, supplier_id]
      );
      
      res.status(201).json(newInventoryItem.rows[0]);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/inventory', async (req, res) => {
  try {
    const allInventoryItems = await pool.query(
      `SELECT inventory.id, inventory.name, inventory.quantity, inventory.price, inventory.category_id, inventory.threshold_quantity, inventory.unit_of_measurement, inventory.supplier_id, categories.name AS category_name, suppliers.name AS supplier_name
      FROM inventory
      INNER JOIN categories ON inventory.category_id = categories.id
      LEFT JOIN suppliers ON inventory.supplier_id = suppliers.id`
    );
    res.json(allInventoryItems.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.delete('/inventory/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const existingItem = await pool.query('SELECT * FROM inventory WHERE id = $1', [itemId]);

    if (existingItem.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await pool.query('DELETE FROM inventory WHERE id = $1', [itemId]);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


router.put('/inventory/:id', async (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;

  try {
    // Check if the item exists
    const existingItem = await pool.query('SELECT * FROM inventory WHERE id = $1', [itemId]);

    if (existingItem.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update the item in the database
    const updatedInventoryItem = await pool.query(
      'UPDATE inventory SET name = $1, quantity = $2, price = $3, category_id = $4, threshold_quantity = $5, unit_of_measurement = $6, supplier_id = $7 WHERE id = $8 RETURNING *',
      [
        updatedItem.name,
        updatedItem.quantity,
        updatedItem.price,
        updatedItem.category_id,
        updatedItem.threshold_quantity,
        updatedItem.unit_of_measurement,
        updatedItem.supplier_id,
        itemId,
      ]
    );

    res.json(updatedInventoryItem.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
