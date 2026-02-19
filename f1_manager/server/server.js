const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Component = require('./models/Component');
const Asset = require('./models/Asset');
const Car = require('./models/Car');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/F1')
    .then(() => console.log('Connected to MongoDB (F1 Database)'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// --- API Endpoints ---

// 1. Get all cars
app.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find().populate('chassisAssetId');
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get component by ID (BOM Drilldown)
app.get('/api/components/:id', async (req, res) => {
    try {
        const component = await Component.findById(req.params.id)
            .populate('subComponents.componentId');
        if (!component) return res.status(404).json({ error: 'Component not found' });
        res.json(component);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Search components
app.get('/api/components', async (req, res) => {
    try {
        const query = req.query.q ? { name: new RegExp(req.query.q, 'i') } : {};
        const components = await Component.find(query).limit(50);
        res.json(components);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Update component
app.patch('/api/components/:id', async (req, res) => {
    try {
        const updated = await Component.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(`Successfully updated component ${req.params.id}`);
        res.json(updated);
    } catch (err) {
        console.error(`Update failed for ${req.params.id}:`, err.message);
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/assets/:id', async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id).populate('componentId');
        if (!asset) {
            console.warn(`Asset not found: ${req.params.id}`);
            return res.status(404).json({ error: 'Asset not found' });
        }
        const children = await Asset.find({ parentAssetId: req.params.id }).populate('componentId');
        console.log(`Asset tree loaded for ${req.params.id} (${children.length} children)`);
        res.json({ asset, children });
    } catch (err) {
        console.error(`Asset tree failed for ${req.params.id}:`, err.message);
        res.status(500).json({ error: err.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`F1 Manager API running on http://localhost:${PORT}`);
    });
}

module.exports = app;
