// AI-generated, to test back-end jest is working

import request from 'supertest';
import express from 'express';
import router from '../router';
import * as DB from '../controllers/DBController';

const app = express();
app.use(express.json());
app.use(router);

jest.mock('../controllers/DBController');

describe('GET /mapMarkers', () => {
  it('should respond with 200 and return markers data', async () => {
    (DB.getMarkers as jest.Mock).mockImplementation((req, res) => {
      res.status(200).json({ markers: ['marker1', 'marker2'] });
    });

    const response = await request(app).get('/mapMarkers');

    expect(response.status).toBe(200);

    expect(response.body).toEqual({ markers: ['marker1', 'marker2'] });
  });
});
