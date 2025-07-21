# Event Booking API

A comprehensive Node.js REST API for event booking management with authentication, role-based access control, and complete CRUD operations.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Customer/Admin)
  - Secure password hashing with bcrypt

- **Event Management**
  - Create, read, update events (Admin only)
  - Public event listing with upcoming events
  - Event capacity management

- **Booking System**
  - Create and cancel bookings
  - View user's booking history
  - Prevent duplicate bookings and overbooking

- **Database**
  - Supabase PostgreSQL database
  - Row Level Security (RLS) policies
  - Proper foreign key relationships

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: bcrypt, helmet, cors

## API Endpoints

### Authentication (Public)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Events
- `GET /events` - List all upcoming events (Public)
- `GET /events/:id` - Get event details (Public)
- `POST /events` - Create new event (Admin only)
- `PUT /events/:id` - Update event (Admin only)
- `GET /events/:id/bookings` - View event bookings (Admin only)

### Bookings (Protected)
- `POST /bookings` - Create booking (Customer/Admin)
- `GET /bookings` - View user's bookings (Customer/Admin)
- `PUT /bookings/:id` - Cancel booking (Customer/Admin)

## Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and configure:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h
   PORT=3000
   ```

3. **Database Setup**
   - Set up Supabase project
   - Run the migration file in `supabase/migrations/`

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Usage Examples

### Register a User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "customer"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Event (Admin)
```bash
curl -X POST http://localhost:3000/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "date": "2024-12-01T10:00:00Z",
    "location": "Convention Center",
    "max_capacity": 100,
    "price": 99.99
  }'
```

### Book Event
```bash
curl -X POST http://localhost:3000/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "EVENT_UUID"
  }'
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `name`
- `role` (customer/admin)
- `created_at`, `updated_at`

### Events Table
- `id` (UUID, Primary Key)
- `title`, `description`, `location`
- `date` (Event date/time)
- `max_capacity`, `current_bookings`
- `price`
- `created_by` (Foreign Key to Users)
- `created_at`, `updated_at`

### Bookings Table
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key to Users)
- `event_id` (Foreign Key to Events)
- `status` (active/cancelled)
- `booking_date`
- `created_at`, `updated_at`

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for customers and admins
- **Row Level Security**: Database-level security policies
- **Input Validation**: Comprehensive request validation
- **Password Security**: bcrypt hashing with salt
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers middleware

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation errors if any"]
}
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
