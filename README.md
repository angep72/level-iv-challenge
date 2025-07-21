Here's a clear, well-structured `README.md` for your Full Stack Developer Challenge project based on the description you provided:

---

# Full Stack Developer Challenge – Event Booking Platform

## 📝 Project Description

Build a minimal event booking platform where users can browse events, book tickets, and manage their bookings. The system includes an admin dashboard for event organizers to create and manage events.

This project tests skills in API design, database modeling, authentication, and building a React frontend using TypeScript for both backend and frontend.

---

## 🎯 Goals

Build a functional MVP (Minimum Viable Product) with the following features:

### 👥 User Roles

* **Admin (Event Organizer):**

  * Create, update, and delete events.
  * View all bookings for their events.

* **Customer (Event Attendee):**

  * View a list of upcoming events.
  * View event details and book tickets.
  * Manage (view/cancel) their own bookings.

---

## 📦 Functional Requirements

### 🗓️ Events

Each event should have the following attributes:

* `id`: UUID
* `title`: string
* `description`: string
* `location`: string
* `date`: DateTime
* `capacity`: number (max attendees)
* `price`: number

### ✅ Booking

* Users can book tickets for available events.
* Prevent overbooking (no more bookings once capacity is reached).
* Users can cancel their bookings.

### 🔐 Authentication

* JWT-based authentication.
* Role-based access control for Admins and Customers.

---

## 🔄 API Endpoints

### Public

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| GET    | `/events`        | List all upcoming events        |
| GET    | `/events/:id`    | Get details of a specific event |
| POST   | `/auth/register` | Register a new user             |
| POST   | `/auth/login`    | Login and receive a JWT token   |

### Customer Protected (Requires Auth)

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| POST   | `/bookings`     | Book a ticket      |
| GET    | `/bookings`     | View own bookings  |
| PUT    | `/bookings/:id` | Cancel own booking |

### Admin Protected (Requires Admin Role)

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| POST   | `/events`              | Create a new event             |
| PUT    | `/events/:id`          | Update an event                |
| GET    | `/events/:id/bookings` | View all bookings for an event |

---

## 🛠 Tech Stack

### Backend

* Node.js + Express (TypeScript)
* PostgreSQL or MongoDB
* TypeORM or Prisma
* JWT for authentication

### Frontend

* React (TypeScript)
* TailwindCSS or Material-UI (optional for styling)

---

## ✨ Bonus Features (Optional)

* Payment integration for paid events.
* Email notifications for booking confirmations and cancellations.
* Pagination & filtering for events list.
* Admin dashboard UI with charts for event attendance.
* React Query (or SWR) for API calls.
* Form management with React Hook Form.
* Host on AWS EC2 free tier (if applicable).

---

## 📂 Deliverables

* Frontend and Backend source code in a GitHub repository.
* Backend tests with at least 65% coverage.
* A comprehensive README including:

  * Setup instructions.
  * API documentation or a Postman collection.

---

## ⚡ Challenge Expectations

This challenge evaluates your ability to:

* Design clean, maintainable backend APIs and database models.
* Implement frontend state management and modular component architecture.
* Secure applications with JWT-based authentication and role-based access control.
* Write clean, reusable, and well-documented code.

---

## 🚀 Setup Instructions (Example)

### Backend

1. Clone the repo and navigate to backend:

   ```bash
   cd EventBooker
   cd Backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file with necessary environment variables (e.g., database URI, JWT secret).
4. Run the development server:

   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to frontend folder:

   ```bash
   cd EventBooker
   cd Frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start React dev server:

   ```bash
   npm start
   ```
4. Open browser at `http://localhost:3000`

---

## 📖 API Documentation

API endpoints are documented in the [Postman Collection](http://localhost:3000/api-doc) (or alternatively, use inline comments and Swagger if implemented).

---

## 👩‍💻 Author

* Your Name
* GitHub: [angep72](https://github.com/angep72)


