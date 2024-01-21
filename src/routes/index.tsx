import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const PageError = lazy(() => import('../components/errors/PageError'));

// LAYOUTS
import DashboardLayout from '../layouts/DashboardLayout';
import { getUserSessionId } from 'utils/localStorageMethods';
import { resetPasswordAccessChecks } from './allowNavigationFunctions';

const UserVehiclepage = lazy(() => import('../pages/user/UserVehiclePage'));

const TransporterProfilePage = lazy(
  () => import('../pages/user/TransporterProfilePage'),
);
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));
const TripLayout = lazy(() => import('../layouts/TripLayout'));
const TripsLayout = lazy(() => import('../layouts/TripsLayout'));
const ChatLayout = lazy(() => import('../layouts/ChatLayout'));

// Auth
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(
  () => import('../pages/auth/ForgotPasswordPage'),
);
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

const VerificationPage = lazy(
  () => import('../pages/verification/VerificationPage'),
);

// DASHBOARD
const MyTripsPage = lazy(() => import('../pages/trips/MyTripsPage'));
const TripDetailsPage = lazy(() => import('../pages/trips/TripDetailsPage'));
const TripBidsPage = lazy(() => import('../pages/trips/TripBidsPage'));

const TransporterJobsPage = lazy(
  () => import('../pages/jobs/TransporterJobsPage'),
);
const ChatPage = lazy(() => import('../pages/chat/ChatPage'));
const AdminsPage = lazy(() => import('../pages/admins/AdminsPage'));

// VEHICLES
const VehiclesPage = lazy(() => import('../pages/vehicles/VehiclesPage'));

// Transactions
const PaymentsPage = lazy(() => import('../pages/payments/PaymentsPage'));
const WalletPage = lazy(() => import('../pages/payments/WalletPage'));
const sessionId = getUserSessionId();
const router = createBrowserRouter([
  {
    path: '/',
    id: 'Dashboard',
    element: (
      <ProtectedRoute allowNavigation={!!sessionId} reRouteUrl="/auth/login">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <PageError />,
    children: [
      {
        path: '/',
        element: <Navigate to="/my-trips" replace />,
      },
      {
        path: '/admins',
        element: <AdminsPage />,
      },
      {
        path: '/chat',
        id: 'Chat',
        element: <ChatLayout />,
        children: [
          {
            path: '/chat/:chatLogId',
            id: 'Message',
            element: <ChatPage />,
          },
        ],
      },
      {
        path: '/my-trips',
        id: 'My Trips Layout',
        element: <TripsLayout />,
        children: [
          {
            path: '',
            id: 'My Trips',
            element: <MyTripsPage />,
          },
          {
            path: '/my-trips/:tripId',
            id: 'Trip Layout',
            element: <TripLayout />,
            children: [
              {
                path: '',
                id: 'TripDetails',
                element: <TripDetailsPage />,
              },
              {
                path: '/my-trips/:tripId/bids',
                id: 'TripBidsLayout',
                element: <TripBidsPage />,
              },
            ],
          },
        ],
      },
      {
        path: '/available-jobs',
        id: 'Jobs',
        element: <TransporterJobsPage />,
      },
      {
        path: '/user/:userId',
        id: 'User detail',
        element: <TransporterProfilePage />,
      },
      {
        path: '/user/:userId/vehicles',
        id: 'User vehicles',
        element: <UserVehiclepage />,
      },
      {
        path: '/vehicles',
        id: 'Vehicles',
        element: <VehiclesPage />,
      },
      {
        path: '/payments',
        id: 'Payments',
        element: <PaymentsPage />,
      },
      {
        path: '/wallet',
        id: 'WalletPage',
        element: <WalletPage />,
      },
    ],
  },
  {
    path: 'transporter-verification',
    element: <VerificationPage />,
  },
  {
    path: 'auth',
    element: (
      <ProtectedRoute allowNavigation={!sessionId} reRouteUrl="/my-trips">
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password',
        element: (
          <ProtectedRoute
            reRouteUrl="/auth/login"
            allowNavigationFunc={resetPasswordAccessChecks}
          >
            <ResetPasswordPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <PageError errorCode={404} />,
  },
]);

export default router;
