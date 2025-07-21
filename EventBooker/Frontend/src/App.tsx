import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import { ROUTES, ROLES } from './utils/constants';

// Components
import PrivateRoute from './components/auth/PrivateRoute';
import RoleRoute from './components/auth/RoleRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateEvent from './pages/admin/CreateEvent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.EVENTS} replace />} />
                <Route path={ROUTES.LOGIN} element={<LoginForm />} />
                <Route path={ROUTES.REGISTER} element={<RegisterForm />} />
                <Route path={ROUTES.EVENTS} element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />

                {/* Customer Routes */}
                <Route
                  path={ROUTES.MY_BOOKINGS}
                  element={
                    <PrivateRoute>
                      <RoleRoute allowedRoles={[ROLES.CUSTOMER]}>
                        <MyBookings />
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path={ROUTES.ADMIN_DASHBOARD}
                  element={
                    <PrivateRoute>
                      <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdminDashboard />
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path={ROUTES.ADMIN_CREATE_EVENT}
                  element={
                    <PrivateRoute>
                      <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                        <CreateEvent />
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to={ROUTES.EVENTS} replace />} />
              </Routes>
            </div>
          </ErrorBoundary>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;