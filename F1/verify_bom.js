/**
 * Verification script for the F1 BOM Schema.
 * This demonstrates how to create a hierarchy from a bolt to a car.
 */
const mongoose = require('mongoose');
const Component = require('./models/Component');
const Asset = require('./models/Asset');
const Car = require('./models/Car');

async function verifySchema() {
    console.log('Starting F1 BOM Schema Verification...');

    // 1. Create Definitions (Components)
    const boltComp = await Component.create({
        partNumber: 'B-5-30',
        name: '5x30mm Case-Hardened Bolt',
        category: 'Standard Hardware',
        type: 'Part',
        isStandardPart: true,
        specifications: {
            dimensions: '5x30mm',
            material: 'Steel Grade 12.9',
            torque_nm: 12
        }
    });

    const frontWingPartComp = await Component.create({
        partNumber: 'FW-01',
        name: 'Front Wing Main Plane',
        category: 'Aerodynamics',
        type: 'Part'
    });

    const frontWingAssyComp = await Component.create({
        partNumber: 'FWA-100',
        name: 'Front Wing Assembly',
        category: 'Aerodynamics',
        type: 'Assembly',
        subComponents: [
            { componentId: frontWingPartComp._id, quantity: 1 },
            { componentId: boltComp._id, quantity: 4 }
        ]
    });

    console.log('Definitions created.');

    // 2. Create Instances (Assets)
    const carChassis = await Asset.create({
        serialNumber: 'RB20-C01',
        componentId: await Component.create({ partNumber: 'CH-20', name: 'RB20 Chassis', category: 'Chassis', type: 'Assembly' }),
        status: 'In Use'
    });

    const fwAsset = await Asset.create({
        serialNumber: 'FW-2024-001',
        componentId: frontWingAssyComp._id,
        parentAssetId: carChassis._id,
        rootAssetId: carChassis._id,
        status: 'In Use'
    });

    const boltAsset = await Asset.create({
        batchNumber: 'LOT-2026-A1',
        componentId: boltComp._id,
        parentAssetId: fwAsset._id,
        rootAssetId: carChassis._id,
        status: 'In Use',
        quantity: 4 // Using 4 bolts in this assembly
    });

    console.log('Asset hierarchy created: Chassis -> Front Wing -> Bolt');

    // 3. Create the Car
    const car = await Car.create({
        modelName: 'RB20',
        carNumber: 1,
        driver: 'Max Verstappen',
        chassisAssetId: carChassis._id
    });

    console.log('Car instance linked to root chassis.');

    // 4. Verification Query: Find all sub-assets of the Front Wing
    const children = await Asset.find({ parentAssetId: fwAsset._id }).populate('componentId');
    console.log(`Verification: Found ${children.length} sub-assets for Front Wing.`);
    children.forEach(c => console.log(` - ${c.componentId.name} (${c.serialNumber})`));
}

// Note: This script is for demonstration and would require 
// a local MongoDB instance to run successfully.
module.exports = { verifySchema };
