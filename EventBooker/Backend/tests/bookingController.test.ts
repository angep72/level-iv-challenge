import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

describe('Booking Controller', () => {
  it('should return 404 for unknown booking route', async () => {
    const res = await request(app).get('/api/bookings/unknown');
    expect(res.status).toBe(404);
  });

  it('should return 401 for GET /bookings without auth', async () => {
    const res = await request(app).get('/bookings');
    expect(res.status).toBe(401);
  });

  it('should return 403 for GET /bookings/:id with invalid id', async () => {
    // Simulate auth by sending a dummy token (will fail at auth)
    const res = await request(app)
      .get('/bookings/invalid-id')
      .set('Authorization', 'Bearer dummy');
    expect(res.status).toBe(403);
  });

  it('should return 403 for GET /bookings/:id with non-existent id', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/bookings/${nonExistentId}`)
      .set('Authorization', 'Bearer dummy');
    expect(res.status).toBe(403);
  });
 
  it('should create a booking for a valid event and user', async () => {
    // Register a new user
    const userRes = await request(app)
      .post('/auth/register')
      .send({
        email: `testuser${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
    expect(userRes.status).toBe(201);
    const token = userRes.body.data.token;
    const userId = userRes.body.data.user.id;

    // Create an event as admin
    // First, register an admin
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
        description: 'A test event for booking',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Test Location',
        maxCapacity: 10,
        price: 20
      });
    expect(eventRes.status).toBe(201);
    const eventId = eventRes.body.data._id;

    // Create a booking for the event as the user
    const bookingRes = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ eventId });
    expect(bookingRes.status).toBe(201);
    expect(bookingRes.body).toHaveProperty('success', true);
    expect(bookingRes.body).toHaveProperty('data');
    expect(bookingRes.body.data).toHaveProperty('eventId');
    expect(bookingRes.body.data).toHaveProperty('userId');
  });

  it('should not allow duplicate active bookings for the same event and user', async () => {
    // Register a new user
    const userRes = await request(app)
      .post('/auth/register')
      .send({
        email: `dupuser${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Dup',
        lastName: 'User'
      });
    const token = userRes.body.data.token;

    // Register an admin and create an event
    const adminRes = await request(app)
      .post('/auth/register')
      .send({
        email: `dupadmin${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    const adminToken = adminRes.body.data.token;
    const eventRes = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Dup Event',
        description: 'Duplicate booking test',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Dup Location',
        maxCapacity: 10,
        price: 20
      });
    const eventId = eventRes.body.data._id;

    // First booking should succeed
    const bookingRes1 = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ eventId });
    expect(bookingRes1.status).toBe(201);

    // Second booking should fail
    const bookingRes2 = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ eventId });
    expect(bookingRes2.status).toBe(400);
    expect(bookingRes2.body).toHaveProperty('message', 'You already have a booking for this event');
  });

  it('should not allow creating a past event', async () => {
    // Register an admin
    const adminRes = await request(app)
      .post('/auth/register')
      .send({
        email: `pastadmin${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    const adminToken = adminRes.body.data.token;
    // Try to create a past event
    const eventRes = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Past Event',
        description: 'Past event test',
        date: new Date(Date.now() - 86400000).toISOString(),
        location: 'Past Location',
        maxCapacity: 10,
        price: 20
      });
    expect(eventRes.status).toBe(400);
    expect(eventRes.body).toHaveProperty('message', 'Validation failed');
    expect(eventRes.body).toHaveProperty('errors');
    expect(Array.isArray(eventRes.body.errors)).toBe(true);
    expect(eventRes.body.errors.some((msg: string) => msg.includes('Event date must be in the future'))).toBe(true);
  });

  it('should not allow overbooking an event', async () => {
    // Register two users
    const user1Res = await request(app)
      .post('/auth/register')
      .send({
        email: `overuser1${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Over',
        lastName: 'User1'
      });
    const token1 = user1Res.body.data.token;
    const user2Res = await request(app)
      .post('/auth/register')
      .send({
        email: `overuser2${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Over',
        lastName: 'User2'
      });
    const token2 = user2Res.body.data.token;

    // Register an admin and create an event with maxCapacity 1
    const adminRes = await request(app)
      .post('/auth/register')
      .send({
        email: `overadmin${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    const adminToken = adminRes.body.data.token;
    const eventRes = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Overbook Event',
        description: 'Overbooking test',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Overbook Location',
        maxCapacity: 1,
        price: 20
      });
    const eventId = eventRes.body.data._id;

    // First booking should succeed
    const bookingRes1 = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${token1}`)
      .send({ eventId });
    expect(bookingRes1.status).toBe(201);

    // Second booking should fail
    const bookingRes2 = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${token2}`)
      .send({ eventId });
    expect(bookingRes2.status).toBe(400);
    expect(bookingRes2.body).toHaveProperty('message', 'Event is fully booked');
  });

  it('should allow cancelling a booking', async () => {
    // Register a user
    const userRes = await request(app)
      .post('/auth/register')
      .send({
        email: `canceluser${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Cancel',
        lastName: 'User'
      });
    const token = userRes.body.data.token;

    // Register an admin and create an event
    const adminRes = await request(app)
      .post('/auth/register')
      .send({
        email: `canceladmin${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    const adminToken = adminRes.body.data.token;
    const eventRes = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Cancel Event',
        description: 'Cancel booking test',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Cancel Location',
        maxCapacity: 10,
        price: 20
      });
    const eventId = eventRes.body.data._id;

    // Create a booking
    const bookingRes = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ eventId });
    expect(bookingRes.status).toBe(201);
    const bookingId = bookingRes.body.data._id;

    // Cancel the booking
    const cancelRes = await request(app)
      .put(`/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body).toHaveProperty('success', true);
    expect(cancelRes.body).toHaveProperty('message', 'Booking cancelled successfully');
  });
});
