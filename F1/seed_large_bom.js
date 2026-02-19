/**
 * Large Scale Seeding Script for F1 BOM
 * Generates 30,000+ parts across nested assemblies.
 */
const mongoose = require('mongoose');
const Component = require('./models/Component');
const Asset = require('./models/Asset');
const Car = require('./models/Car');

async function seedLargeBOM() {
    console.log("Connecting to Database...");
    await mongoose.connect('mongodb://localhost:27017/F1');

    // Clear existing data
    await Component.deleteMany({});
    await Asset.deleteMany({});
    await Car.deleteMany({});

    console.log("Generating 30,000+ components...");

    const TOTAL_PARTS = 30000;
    const BATCH_SIZE = 1000;
    const categories = ["Powertrain", "Aerodynamics", "Chassis", "Electronics", "Suspension"];

    const nameLibrary = {
        Powertrain: ["Piston", "Connecting Rod", "Turbine Housing", "MGU-K Rotor", "Cylinder Head", "Fuel Injector", "Exhaust Manifold", "Intercooler Pipe", "Crankshaft"],
        Aerodynamics: ["Wing Endplate", "Vortex Generator", "Bargeboard Fin", "Front Wing Flap", "Rear Wing Pillar", "Diffuser Strakes", "S-Duct Intake", "Floor Edge Wing"],
        Chassis: ["Survival Cell Plate", "Headrest Cushion", "Roll Hoop Structure", "Bulkhead Fitting", "Fuel Cell Liner", "Anti-Intrusion Panel", "Skid Block Plank"],
        Electronics: ["Telemetry Loom", "E-Box Housing", "Steering Wheel Button", "Temperature Sensor", "Pressure Transducer", "ECU Mounting Bracket", "LCD Display Module"],
        Suspension: ["Wishbone Pivot", "Pushrod Joint", "Heave Damper Valve", "Anti-Roll Bar Bushing", "Upright Casting", "Torsion Bar Nut", "Wheel Spindle"]
    };

    const standardHardware = ["M5 Titanium Bolt", "M6 Nut", "Custom Washer", "O-Ring Seal", "Clip-On Fastener", "Hex Screw", "Clevis Pin"];

    // 1. Generate Leaf Parts
    let leafParts = [];
    for (let i = 1; i <= TOTAL_PARTS; i++) {
        const cat = categories[i % categories.length];
        const isStandard = Math.random() < 0.25;
        const baseName = isStandard
            ? standardHardware[Math.floor(Math.random() * standardHardware.length)]
            : nameLibrary[cat][Math.floor(Math.random() * nameLibrary[cat].length)];

        leafParts.push({
            partNumber: `P-${i.toString().padStart(6, '0')}`,
            name: `${baseName} (v${(i % 5) + 1}.${i % 10})`,
            type: "Part",
            category: isStandard ? "Standard Hardware" : cat,
            isStandardPart: isStandard,
            specifications: {
                weight_g: Math.floor(Math.random() * 500),
                material: isStandard ? "Titanium / Steel" : "Carbon Fiber / Alloy"
            }
        });

        if (leafParts.length === BATCH_SIZE) {
            await Component.insertMany(leafParts);
            leafParts = [];
            process.stdout.write(`\rCreated ${i} parts...`);
        }
    }
    if (leafParts.length > 0) await Component.insertMany(leafParts);
    console.log("\nLeaf parts created with realistic names.");

    // 2. Roll up into Sub-Assemblies
    const allLeafIds = await Component.find({ type: "Part" }).select('_id name category');
    const SUB_ASSY_COUNT = 800;
    const assyTemplates = ["Cluster", "Module", "Unit", "Sub-System", "Bracket Assembly", "Array", "Housing Group"];
    let subAssemblies = [];

    for (let i = 1; i <= SUB_ASSY_COUNT; i++) {
        const cat = categories[i % categories.length];
        const template = assyTemplates[Math.floor(Math.random() * assyTemplates.length)];

        // Pick 20-50 random parts for each sub-assembly
        const subCount = Math.floor(Math.random() * 30) + 20;
        const subComponents = [];
        for (let j = 0; j < subCount; j++) {
            const randId = allLeafIds[Math.floor(Math.random() * allLeafIds.length)]._id;
            subComponents.push({ componentId: randId, quantity: Math.floor(Math.random() * 4) + 1 });
        }

        subAssemblies.push({
            partNumber: `SA-${i.toString().padStart(4, '0')}`,
            serialNumber: i % 10 === 0 ? `SA-SN-${i.toString().padStart(4, '0')}` : undefined, // 10% get serials
            name: `${cat} ${template} #${i}`,
            type: "Assembly",
            category: cat,
            subComponents: subComponents
        });
    }
    await Component.insertMany(subAssemblies);
    console.log(`Created ${SUB_ASSY_COUNT} Sub-Assemblies.`);

    // 3. Roll up into Systems
    const allSubAssyIds = await Component.find({ type: "Assembly" }).select('_id');
    const systems = categories.map((cat, i) => {
        // Pick ~100 sub-assemblies per system
        const subCompIds = allSubAssyIds
            .sort(() => 0.5 - Math.random())
            .slice(0, 100)
            .map(s => ({ componentId: s._id, quantity: 1 }));

        return {
            partNumber: `SYS-${cat.toUpperCase().substring(0, 3)}`,
            serialNumber: `SYS-SN-${cat.toUpperCase().substring(0, 3)}`, // All systems get serials
            name: `${cat} System`,
            type: "System",
            category: cat,
            subComponents: subCompIds
        };
    });
    await Component.insertMany(systems);
    console.log("Major Systems created.");

    // 4. Create the Root Chassis & Car
    const allSystemIds = await Component.find({ type: "System" }).select('_id subComponents');
    const chassisComp = await Component.create({
        partNumber: "CH-2026-X1",
        name: "Formula 1 Chassis Root",
        type: "Assembly",
        category: "Chassis",
        subComponents: allSystemIds.map(s => ({ componentId: s._id, quantity: 1 }))
    });

    const rootAssetInDB = await Asset.create({
        serialNumber: "SN-F1-2026-001",
        componentId: chassisComp._id,
        status: "In Use"
    });

    await Car.create({
        modelName: "RB22",
        carNumber: 1,
        driver: "Max Verstappen",
        chassisAssetId: rootAssetInDB._id
    });

    // 5. Instantiate Assets (Target: 10,000)
    console.log("Instantiating 10,000 physical assets...");
    let assetsCreated = 1; // Starting with Chassis root
    const ASSET_TARGET = 10000;

    // We'll use a queue to BFS through the hierarchy and create assets
    let queue = [{ componentId: chassisComp._id, parentAssetId: rootAssetInDB._id }];

    while (queue.length > 0 && assetsCreated < ASSET_TARGET) {
        let current = queue.shift();
        let comp = await Component.findById(current.componentId).select('subComponents type');

        if (!comp || !comp.subComponents || comp.subComponents.length === 0) continue;

        let assetBatch = [];
        for (let sub of comp.subComponents) {
            if (assetsCreated >= ASSET_TARGET) break;

            const subComp = await Component.findById(sub.componentId).select('_id type isStandardPart name partNumber');
            if (!subComp) continue;

            const isStandard = subComp.isStandardPart;
            const assetData = {
                componentId: subComp._id,
                status: "In Use",
                parentAssetId: current.parentAssetId,
                rootAssetId: rootAssetInDB._id,
                quantity: isStandard ? sub.quantity : 1
            };

            if (isStandard) {
                assetData.batchNumber = `BATCH-${Math.floor(Math.random() * 100000)}`;
            } else {
                // Ensure globally unique serial number by combining part number, count, and random tag
                assetData.serialNumber = `SN-${subComp.partNumber}-${assetsCreated}-${Math.floor(Math.random() * 1000)}`;
            }

            assetBatch.push(assetData);
            assetsCreated++;
        }

        if (assetBatch.length > 0) {
            try {
                const insertedAssets = await Asset.insertMany(assetBatch);

                // Re-add assemblies/systems to queue to process their children
                for (let i = 0; i < insertedAssets.length; i++) {
                    const subCompRef = await Component.findById(insertedAssets[i].componentId).select('type');
                    if (subCompRef && subCompRef.type !== "Part") {
                        queue.push({ componentId: insertedAssets[i].componentId, parentAssetId: insertedAssets[i]._id });
                    }
                }
                process.stdout.write(`\rCreated ${assetsCreated} assets...`);
            } catch (err) {
                console.error("\nBatch insertion failed:", err.message);
                if (err.writeErrors) {
                    console.error("First Write Error:", err.writeErrors[0].errmsg);
                }
                process.exit(1);
            }
        }
    }

    console.log(`\nSeeding complete! Root Car #1 has ${assetsCreated} physical assets instantiated.`);
    process.exit(0);
}

seedLargeBOM().catch(console.error);
