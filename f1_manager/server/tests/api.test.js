const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('F1 Manager API Requirements Tests', () => {
    let chassisId;
    let systemId;

    beforeAll(async () => {
        // Connect if not connected (server.js already connects, but wait for it)
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect('mongodb://localhost:27017/F1');
        }

        // Find a car to get a starting chassis ID
        const car = await mongoose.model('Car').findOne();
        if (car) {
            chassisId = car.chassisAssetId.toString();
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('GET /api/cars should return at least one car with driver', async () => {
        const res = await request(app).get('/api/cars');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('driver');
    });

    test('GET /api/assets/:id should return children for Chassis', async () => {
        if (!chassisId) return console.warn('Skipping test: No car found in DB');

        const res = await request(app).get(`/api/assets/${chassisId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('asset');
        expect(res.body).toHaveProperty('children');
        expect(Array.isArray(res.body.children)).toBe(true);

        if (res.body.children.length > 0) {
            systemId = res.body.children[0]._id;
            expect(res.body.children[0]).toHaveProperty('componentId');
            // Verify population
            expect(typeof res.body.children[0].componentId).toBe('object');
        }
    });

    test('GET /api/assets/:id should return sub-assemblies for a System', async () => {
        if (!systemId) return console.warn('Skipping test: No system found in hierarchy');

        const res = await request(app).get(`/api/assets/${systemId}`);
        expect(res.status).toBe(200);
        expect(res.body.children.length).toBeGreaterThan(0);
    });

    test('GET /api/components should support search', async () => {
        const res = await request(app).get('/api/components?q=nut');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body.length > 0) {
            expect(res.body[0].name.toLowerCase()).toContain('nut');
        }
    });
});
