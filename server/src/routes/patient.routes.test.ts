import request from 'supertest';
import express from 'express';
import patientRoutes from './patient.routes';
import { connectDB } from '../config/db';

const app = express();
app.use(express.json());
app.use('/patients', patientRoutes);

beforeAll(async () => {
  await connectDB();
});

describe('GET /patients', () => {
  it('should return 3 seeded patients', async () => {
    const res = await request(app).get('/patients');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(3);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
  });
});