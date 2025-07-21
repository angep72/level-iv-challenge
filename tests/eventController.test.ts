import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

describe('Event Controller', () => {
  it('should return 200 and an array for GET /events', async () => {
    const res = await request(app).get('/events');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return 400 for GET /events/:id with invalid id', async () => {
    const res = await request(app).get('/events/invalid-id');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Validation failed');
  });

  it('should return 404 for GET /:id with non-existent id', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/events/${nonExistentId}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Event not found');
  });

  it('should create an event as admin', async () => {
    // Register an admin
    const adminRes = await request(app)
      .post('/auth/register')
      .send({
        email: `admin${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    expect(adminRes.status).toBe(201);
    const adminToken = adminRes.body.data.token;

    // Create the event
    const eventRes = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Event',
        description: 'A test event for event controller',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Test Location',
        maxCapacity: 10,
        price: 20
      });
    expect(eventRes.status).toBe(201);
    expect(eventRes.body).toHaveProperty('success', true);
    expect(eventRes.body).toHaveProperty('data');
    expect(eventRes.body.data).toHaveProperty('title', 'Test Event');
    expect(eventRes.body.data).toHaveProperty('location', 'Test Location');
  });

  it('should update an event as admin', async () => {
    // Register an admin
    const adminRes = await request(app)
      .post('/auth/register')
      .send({
        email: `updateadmin${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    const adminToken = adminRes.body.data.token;
    // Create the event
    const eventRes = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Update Event',
        description: 'Event to update',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Update Location',
        maxCapacity: 10,
        price: 20
      });
    const eventId = eventRes.body.data._id;
    // Update the event
    const updateRes = await request(app)
      .put(`/events/${eventId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Updated Event',
        description: 'Updated description',
        date: new Date(Date.now() + 172800000).toISOString(),
        location: 'Updated Location',
        maxCapacity: 20,
        price: 30
      });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toHaveProperty('success', true);
    expect(updateRes.body.data).toHaveProperty('title', 'Updated Event');
  });

  it('should delete an event as admin', async () => {
    // Register an admin
    const adminRes = await request(app)
      .post('/auth/register')
      .send({
        email: `deleteadmin${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    const adminToken = adminRes.body.data.token;
    // Create the event
    const eventRes = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Delete Event',
        description: 'Event to delete',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Delete Location',
        maxCapacity: 10,
        price: 20
      });
    const eventId = eventRes.body.data._id;
    // Delete the event
    const deleteRes = await request(app)
      .delete(`/events/${eventId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body).toHaveProperty('success', true);
    expect(deleteRes.body).toHaveProperty('message', 'Event deleted successfully');
  });

  it('should return 400 for update with invalid id', async () => {
    const adminRes = await request(app)
      .post('/auth/register')
      .send({
        email: `badidadmin${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    const adminToken = adminRes.body.data.token;
    const updateRes = await request(app)
      .put('/events/invalid-id')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Should Fail' });
    expect(updateRes.status).toBe(400);
    expect(updateRes.body).toHaveProperty('success', false);
    expect(updateRes.body).toHaveProperty('message', 'Validation failed');
  });

  it('should return 404 for update with non-existent id', async () => {
    const adminRes = await request(app)
      .post('/auth/register')
      .send({
        email: `notfoundadmin${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    const adminToken = adminRes.body.data.token;
    const nonExistentId = new mongoose.Types.ObjectId();
    const updateRes = await request(app)
      .put(`/events/${nonExistentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Should Fail' });
    expect(updateRes.status).toBe(404);
    expect(updateRes.body).toHaveProperty('success', false);
    expect(updateRes.body).toHaveProperty('message', 'Event not found');
  });

  it('should get bookings for an event as admin', async () => {
    // Register an admin
    const adminRes = await request(app)
      .post('/auth/register')
      .send({
        email: `bookingsadmin${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    const adminToken = adminRes.body.data.token;
    // Create the event
    const eventRes = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Bookings Event',
        description: 'Event for bookings',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Bookings Location',
        maxCapacity: 10,
        price: 20
      });
    const eventId = eventRes.body.data._id;
    // Get bookings for the event
    const bookingsRes = await request(app)
      .get(`/events/${eventId}/bookings`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(bookingsRes.status).toBe(200);
    expect(bookingsRes.body).toHaveProperty('success', true);
    expect(Array.isArray(bookingsRes.body.data)).toBe(true);
  });
}); 