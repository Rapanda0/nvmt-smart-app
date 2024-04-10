// app.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');



app.use(cors());
app.use(bodyParser.json()); 

// Routes
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const adminRoutes = require('./routes/adminRoutes');

app.use(authRoutes); 
app.use(inventoryRoutes); 
app.use(supplierRoutes); 
app.use(orderRoutes); 
app.use(adminRoutes);

app.get('/', (req, res) => {
    res.send('Hello, world! This is the NVMt restaurant management app backend.');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
