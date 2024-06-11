const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/inventory', { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    supplier: String,
    sales: Number,
    price: Number,
    quantity: Number,
    image: String
});

const Product = mongoose.model('Product', productSchema);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
});

app.put('/products/:id', async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
});

app.delete('/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
