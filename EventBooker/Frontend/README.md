# Event Booking Platform Frontend

A modern, responsive event booking platform built with React, TypeScript, and Tailwind CSS. This application provides a complete solution for event management and ticket booking with role-based access control.

## 🚀 Features

### Authentication & Authorization

- JWT-based authentication with secure token storage
- Role-based access control (Admin & Customer)
- Protected routes with automatic redirects
- User registration and login with form validation

### Customer Features

- Browse upcoming events with detailed information
- View event details including date, location, price, and availability
- Book tickets with quantity selection
- View and manage personal bookings
- Cancel bookings (when allowed)
- Responsive design for mobile and desktop

### Admin Features

- Comprehensive admin dashboard with analytics
- Create and manage events
- View event statistics and booking data
- Monitor ticket sales and availability
- Professional admin interface with sidebar navigation

### Technical Features

- Modern React with TypeScript for type safety
- React Query for efficient API state management
- React Hook Form with Zod validation
- Responsive Tailwind CSS design
- Toast notifications for user feedback
- Loading states and error handling
- Clean, modular component architecture

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable UI components
│   ├── events/         # Event-related components
│   ├── bookings/       # Booking management components
│   └── admin/          # Admin-specific components
├── pages/              # Main page components
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and constants
└── App.tsx             # Main application component
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A running backend API server (see backend setup instructions)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd event-booking-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   copy .env.example .env
   ```

   Update the `.env` file with your backend API URL:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/events
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🔧 Environment Variables

| Variable            | Description          | Default                 |
| ------------------- | -------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |

## 🎯 User Roles & Permissions

### Customer Role

- ✅ View all events
- ✅ View event details
- ✅ Book tickets
- ✅ View personal bookings
- ✅ Cancel bookings
- ❌ Create or manage events

### Admin Role

- ✅ Access admin dashboard
- ✅ Create new events
- ✅ Edit existing events
- ✅ View event analytics
- ✅ View all bookings for events
- ❌ Book tickets as customer

## 🔌 API Integration

The frontend integrates with a REST API backend. Key endpoints include:

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Events

- `GET /events` - List all events
- `GET /events/:id` - Get event details
- `POST /events` - Create event (admin only)
- `PUT /events/:id` - Update event (admin only)

### Bookings

- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `PUT /bookings/:id` - Update booking (cancel)
- `GET /events/:id/bookings` - Get event bookings (admin only)

## 🎨 Design System

### Color Palette

- **Primary**: Orange (#3B82F6) - Main actions and links
- **Secondary**: Emerald (#10B981) - Success states and positive actions
- **Accent**: Orange (#F97316) - Highlights and attention
- **Success**: Green - Confirmations and success messages
- **Warning**: Yellow - Warnings and cautions
- **Error**: Red - Errors and destructive actions
- **Neutral**: Gray scales for text and backgrounds

### Typography

- **Font Family**: Inter (system fonts fallback)
- **Headings**: Bold weights with proper hierarchy
- **Body Text**: Regular weight with 150% line height
- **UI Text**: Medium weight for labels and buttons

### Spacing

- Consistent 8px spacing system
- Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)

## 🧪 Development Guidelines

### Code Organization

- Each file focuses on a single component or functionality
- Files are kept under 200 lines when possible
- Clear separation of concerns between components
- Proper TypeScript typing throughout

### Form Handling

- React Hook Form for form state management
- Zod schemas for validation
- Consistent error messaging and UX

### API State Management

- React Query for server state
- Proper loading and error states
- Optimistic updates where appropriate
- Cache invalidation strategies

### Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface elements
- Optimized for various screen sizes

## 🚀 Deployment

This application can be deployed to any static hosting service:

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This frontend requires a compatible backend API to function properly. Make sure your backend server is running and accessible at the configured API URL.
