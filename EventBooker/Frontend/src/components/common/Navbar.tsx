import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, User, LogOut, Settings, Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES, ROLES } from "../../utils/constants";
import { useState } from "react";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLink = ({
    to,
    children,
    onClick,
  }: {
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <Link
      to={to}
      onClick={onClick}
      className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <Calendar className="w-8 h-8 text-orange-600" />
            <span className="text-xl font-bold text-gray-900">EventBooker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to={ROUTES.EVENTS}>Events</NavLink>

            {isAuthenticated ? (
              <>
                {user?.role === ROLES.CUSTOMER && (
                  <NavLink to={ROUTES.MY_BOOKINGS}>My Bookings</NavLink>
                )}

                {user?.role === ROLES.ADMIN && (
                  <NavLink to={ROUTES.ADMIN_DASHBOARD}>Dashboard</NavLink>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} />
                    <span>
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <NavLink to={ROUTES.LOGIN}>Login</NavLink>
                <Link
                  to={ROUTES.REGISTER}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
            <div className="flex flex-col space-y-2">
              <NavLink
                to={ROUTES.EVENTS}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Events
              </NavLink>

              {isAuthenticated ? (
                <>
                  {user?.role === ROLES.CUSTOMER && (
                    <NavLink
                      to={ROUTES.MY_BOOKINGS}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Bookings
                    </NavLink>
                  )}

                  {user?.role === ROLES.ADMIN && (
                    <NavLink
                      to={ROUTES.ADMIN_DASHBOARD}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                  )}

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600 px-3 py-2">
                      <User size={16} />
                      <span>
                        {user?.firstName} {user?.lastName}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors px-3 py-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <NavLink
                    to={ROUTES.LOGIN}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
