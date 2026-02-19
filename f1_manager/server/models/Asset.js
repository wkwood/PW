const mongoose = require('mongoose');

/**
 * Asset Schema - The "Physical Instance" layer.
 * Tracks specific serialized parts and where they are currently installed.
 */
const assetSchema = new mongoose.Schema({
    serialNumber: { type: String, unique: true, sparse: true }, // Optional for standard parts
    batchNumber: { type: String }, // Batch/Lot number for standard hardware
    componentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Component',
        required: true
    },
    quantity: { type: Number, default: 1, min: 1 },
    status: {
        type: String,
        enum: ['In Stock', 'In Use', 'Maintenance', 'Reserved', 'Retired'],
        default: 'In Stock'
    },
    totalMileage_km: { type: Number, default: 0 },
    totalUsage_hours: { type: Number, default: 0 },

    // Hierarchical Tracking: Physical assembly tree
    parentAssetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        default: null
    },
    rootAssetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        default: null // Usually points to the Car Chassis
    },

    // History of usage and location changes
    history: [{
        event: String,
        date: { type: Date, default: Date.now },
        notes: String,
        metadata: mongoose.Schema.Types.Mixed
    }]
}, { timestamps: true });

// Index for recursive tree lookups (e.g. find all children of an assembly)
assetSchema.index({ parentAssetId: 1 });
assetSchema.index({ rootAssetId: 1 });

module.exports = mongoose.model('Asset', assetSchema);
