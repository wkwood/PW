/**
 * F1 BOM Schema Setup Script for mongosh
 * 
 * Usage: 
 *   mongosh <connection_string> setup_f1_schema.js
 */

// Switch to the "F1" database
db = db.getSiblingDB('F1');

// --- 1. Define Components Collection (Blueprints) ---
db.createCollection("components", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["partNumber", "name", "type", "category"],
            properties: {
                partNumber: { bsonType: "string", description: "Unique part identifier" },
                serialNumber: { bsonType: "string", description: "Optional blueprint-level serial number" },
                name: { bsonType: "string" },
                type: { enum: ["Part", "Assembly", "System"] },
                category: { enum: ["Powertrain", "Aerodynamics", "Chassis", "Electronics", "Suspension", "Standard Hardware"] },
                version: { bsonType: "string" },
                isStandardPart: { bsonType: "bool", description: "True if this is common hardware like a bolt" },
                specifications: {
                    bsonType: "object",
                    properties: {
                        dimensions: { bsonType: "string" },
                        material: { bsonType: "string" },
                        weight_g: { bsonType: "number" },
                        torque_nm: { bsonType: "number" }
                    }
                },
                subComponents: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["componentId", "quantity"],
                        properties: {
                            componentId: { bsonType: "objectId" },
                            serialNumber: { bsonType: "string", description: "Optional specific serial number required for this assembly" },
                            quantity: { bsonType: "number", minimum: 1 }
                        }
                    }
                }
            }
        }
    }
});
db.components.createIndex({ partNumber: 1 }, { unique: true });
db.components.createIndex({ serialNumber: 1 }, { unique: true, sparse: true });

// --- 2. Define Assets Collection (Physical Instances) ---
db.createCollection("assets", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["componentId", "status"],
            properties: {
                serialNumber: { bsonType: "string", description: "Unique serial number (optional for standard parts)" },
                batchNumber: { bsonType: "string", description: "Batch/Lot number for standard hardware" },
                componentId: { bsonType: "objectId", description: "Ref to Components collection" },
                status: { enum: ["In Stock", "In Use", "Maintenance", "Reserved", "Retired"] },
                quantity: { bsonType: "number", minimum: 1, description: "Default 1, but used for bulk hardware" },
                totalMileage_km: { bsonType: "number", minimum: 0 },
                totalUsage_hours: { bsonType: "number", minimum: 0 },
                parentAssetId: { bsonType: ["objectId", "null"] },
                rootAssetId: { bsonType: ["objectId", "null"] }
            }
        }
    }
});
db.assets.createIndex({ serialNumber: 1 }, { unique: true, sparse: true });
db.assets.createIndex({ batchNumber: 1 });
db.assets.createIndex({ parentAssetId: 1 });
db.assets.createIndex({ rootAssetId: 1 });

// --- 3. Define Cars Collection ---
db.createCollection("cars", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["modelName", "carNumber", "chassisAssetId"],
            properties: {
                modelName: { bsonType: "string" },
                carNumber: { bsonType: "number", minimum: 1 },
                driver: { bsonType: "string" },
                chassisAssetId: { bsonType: "objectId", description: "Ref to the root Asset (Chassis)" }
            }
        }
    }
});
db.cars.createIndex({ carNumber: 1 }, { unique: true });

console.log("F1 BOM Schema initialized successfully with validation and indexes.");

/**
 * SAMPLE DATA INSERTION (Optional)
 */
/*
const boltId = ObjectId();
db.components.insertOne({
  _id: boltId,
  partNumber: "B-001",
  name: "Titanium Bolt",
  type: "Part",
  category: "Chassis"
});

const chassisAssetId = ObjectId();
db.assets.insertOne({
  _id: chassisAssetId,
  serialNumber: "RB20-C01",
  componentId: boltId, // Real case: chassis comp id
  status: "In Use"
});

db.cars.insertOne({
  modelName: "RB20",
  carNumber: 1,
  driver: "Max Verstappen",
  chassisAssetId: chassisAssetId
});
*/
