import { describe, it, expect } from 'vitest';
import { SafeStatusPipe } from './pipes/safe-status.pipe';
import { Component, Asset, Car } from './models/f1-bom.model';

describe('F1 BOM Requirements Validation', () => {
    const pipe = new SafeStatusPipe();

    describe('Status Formatting (Standard Hardware)', () => {
        it('should split multi-word statuses for CSS (e.g., "In Use")', () => {
            const classes = pipe.transform('In Use');
            expect(classes).toContain('in');
            expect(classes).toContain('use');
        });

        it('should handle null status gracefully', () => {
            const classes = pipe.transform(null);
            expect(classes).toEqual([]);
        });

        it('should handle undefined status gracefully', () => {
            const classes = pipe.transform(undefined);
            expect(classes).toEqual([]);
        });
    });

    describe('Model Hierarchy (Traceability)', () => {
        it('should support recursive Component (Blueprint) structure', () => {
            const subComp: Component = {
                _id: 'c1',
                partNumber: 'P-001',
                name: 'Bolt',
                type: 'Part',
                category: 'Hardware',
                isStandardPart: true
            };

            const parentComp: Component = {
                _id: 'c2',
                partNumber: 'A-001',
                name: 'Wing',
                type: 'Assembly',
                category: 'Aero',
                isStandardPart: false,
                subComponents: [{ componentId: subComp, quantity: 10 }]
            };

            expect(parentComp.subComponents![0].componentId).toBe(subComp);
        });

        it('should support physical Asset (Physical Instance) trace', () => {
            const asset: Asset = {
                _id: 'a1',
                serialNumber: 'SN-001',
                componentId: 'c1',
                status: 'In Use',
                quantity: 1,
                parentAssetId: 'p1', // Physical parent
                rootAssetId: 'r1'    // Top car root
            };

            expect(asset.parentAssetId).toBeDefined();
            expect(asset.rootAssetId).toBeDefined();
        });
    });

    describe('Dual-Serialization Requirement', () => {
        it('should allow both Blueprint-level and Asset-level serials', () => {
            const blueprint: Component = {
                partNumber: 'B-001',
                name: 'Steering Wheel',
                serialNumber: 'BSN-001', // Assigned during design
                type: 'System',
                category: 'Electronics',
                isStandardPart: false
            };

            const physical: Asset = {
                serialNumber: 'PSN-001-ALPHA', // Assigned to physical unit
                componentId: 'B-001',
                status: 'In Stock',
                quantity: 1
            };

            expect(blueprint.serialNumber).toBeTruthy();
            expect(physical.serialNumber).toBeTruthy();
        });
    });
});
