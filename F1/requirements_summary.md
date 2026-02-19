# F1 Bill of Materials (BOM) System Requirements

This document summarizes the technical requirements and design principles implemented for the Formula 1 BOM system.

## 1. Data Architecture: Blueprints vs. Physical Reality
The system is divided into two distinct layers to separate design from physical assets:
- **`components` (The Blueprint)**: Defines *what* the part is (Part Number, Name, Material, Design Version).
- **`assets` (The Physical Instance)**: Tracks *which* specific piece of carbon or metal is on the car (Serial Number, Batch, Current Mileage).

## 2. Hierarchical Depth
The schema supports an infinite recursive hierarchy to represent:
- **Entire F1 Car**: Linked to a root Chassis Asset.
- **Major Systems**: Powertrain, Aerodynamics, Electronics, etc.
- **Assemblies/Sub-Assemblies**: Complex groups like a Turbocharger or Front Wing.
- **Individual Parts**: The smallest tracked units.

## 3. Dual Serialization Strategy
Traceability is implemented at two distinct levels:
- **Blueprint Serialization**: Optional unique IDs for specific designs or one-off prototypes.
- **Asset Serialization**: Mandatory unique IDs for high-value/critical physical parts (Chassis, Gearbox, Wings).
- **Sub-Component Requirements**: Blueprints can specify that a specific serialized part *must* be used in a given assembly.

## 4. Standard Hardware & Common Parts
To prevent database bloat, the system handles "Common Parts" (e.g., bolts, washers, nuts) differently:
- **Batch Tracking**: Uses `batchNumber` instead of individual serial numbers.
- **Bulk Quantity**: Multiple instances of the same hardware can be tracked in a single Asset record via a `quantity` field.
- **Specifications**: Dedicated fields for technical specs like torque limits, dimensions, and material grade.

## 5. Performance & Indexing at Scale
Designed to handle **30,000+ parts** per car:
- **Component Blueprint Scale**: 30,000 unique part definitions.
- **Asset Instantiation Scale**: Supports 10,000+ concurrent physical asset records for a single car.
- **Root Indexing**: Every asset stores a `rootAssetId` (the Chassis), allowing a single query to retrieve every part on a car without recursive CPU-intensive lookups.
- **Sparse Unique Indexes**: Ensures global uniqueness for serial numbers while allowing them to be optional for bulk hardware.

## 6. Physical Traceability & Lifecycle
- **Status Tracking**: Assets track states like `In Use`, `Maintenance`, `In Stock`, or `Retired`.
- **Usage Metrics**: Supports tracking `totalMileage_km` and `totalUsage_hours` at the individual asset level.
- **Parentage**: Every asset knows its immediate `parentAssetId`, allowing for rapid "where is this installed?" lookups.
