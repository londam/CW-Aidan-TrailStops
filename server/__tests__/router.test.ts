import request from 'supertest';
import express from 'express';
import router from '../router';

const app = express();
app.use(express.json());
app.use('/', router);

describe('API Routing Tests', () => {
  // Get MAp Markers
  it('should return code 200 and array of markers using GET', async () => {
    const response = await request(app).get('/mapMarkers?user_id=user1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });

  // Using PUT to update all markers
  it('should return code 200 for using PUT to update markers', async () => {
    const markers = {
      marker1: { lat: 5, lng: 8, order: 1 },
      marker2: { lat: 22, lng: 66, order: 2 },
    };

    const response = await request(app)
      .put('/updateAllMarkers')
      .send({ markers });
    expect(response.status).toBe(200);
    expect(response.body).toBe('Markers updated successfully');
  });

  // Adding a user
  it('should return code 200 and add user using POST', async () => {
    const newUser = {
      name: 'Mr Test',
      email: 'test@test.com',
      password: 'bestpassword',
    };

    const response = await request(app).post('/user').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe(newUser.email);
  });

  // Find a user by email using GET)
  it('should return 200 code and the user using GET', async () => {
    const response = await request(app).get('/user?email=test@test.com');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Mr Test');
  });

  // Deleting a marker using DELETE
  it('should return code 200 and deleting a marker using DELETE', async () => {
    const response = await request(app)
      .delete('/mapMarkers')
      .send({ user_id: 'user1', _id: 'marker1' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('deletedCount');
  });

  // Get acomodations nearby
  it('should return code 200 and an Object of accommodations using GET', async () => {
    const response = await request(app).get(
      '/accommodation?user_id=aidan@test.com&markerId=6f2092f9-74c9-4678-bf72-cded45725896'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
  });
});
