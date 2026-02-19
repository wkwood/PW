const mongoose = require('mongoose');

/**
 * Car Schema - The top-level root for the BOM.
 * Associates a driver and a chassis (which is the root Asset).
 */
const carSchema = new mongoose.Schema({
    modelName: { type: String, required: true }, // e.g., "RB20"
    carNumber: { type: Number, required: true },
    driver: { type: String },

    // The Car is essentially a root Asset (Chassis)
    chassisAssetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },

    // Snapshots of configurations for specific races
    configurations: [{
        race: String,
        date: Date,
        rootAssetSnapshot: mongoose.Schema.Types.ObjectId // Pointer to Asset hierarchy at that time
    }]
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
