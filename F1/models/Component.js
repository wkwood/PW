const mongoose = require('mongoose');

/**
 * Component Schema - The "Blueprint" layer.
 * Defines the static structure of parts and assemblies.
 */
const componentSchema = new mongoose.Schema({
    partNumber: { type: String, required: true, unique: true },
    serialNumber: { type: String, sparse: true, unique: true }, // Blueprint-level serialization
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['Part', 'Assembly', 'System'],
        default: 'Part'
    },
    category: {
        type: String,
        enum: ['Powertrain', 'Aerodynamics', 'Chassis', 'Electronics', 'Suspension', 'Standard Hardware'],
        required: true
    },
    isStandardPart: { type: Boolean, default: false },
    version: { type: String, default: '1.0' },
    specifications: {
        material: String,
        weight_g: Number,
        dimensions: String,
        torque_nm: Number
    },
    // Recursive BOM: Points to other component definitions
    subComponents: [{
        componentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        serialNumber: { type: String }, // Optional required serial for this assembly
        quantity: { type: Number, default: 1 }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Component', componentSchema);
