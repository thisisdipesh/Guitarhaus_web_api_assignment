import React, { lazy, Suspense } from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-700"></div>
  </div>
);

// Error fallback component
const ErrorFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
      <p className="text-gray-600">Please try refreshing the page</p>
    </div>
  </div>
);

// Lazy Imports
const Home = lazy(() => import("./components/public/Home"));
const Login = lazy(() => import("./components/public/Login"));
const Register = lazy(() => import("./components/public/Register"));
const Layout = lazy(() => import("./components/private/Layout"));
const Checkout = lazy(() => import("./components/public/Checkout"));
const Faq = lazy(() => import("./components/public/Faq"));
const Terms = lazy(() => import("./components/public/Terms"));
const Privacy = lazy(() => import("./components/public/Privacy"));
const Aboutus = lazy(() => import("./components/public/Aboutus"));
const Contact = lazy(() => import("./components/public/Contact"));
const Review = lazy(() => import("./components/public/Review"));

const Favorite = lazy(() => import("./components/public/Favorite"));
const Myprofile = lazy(() => import("./components/public/Myprofile"));
const Mycart = lazy(() => import("./components/public/Mycart"));
const EditProfile = lazy(() => import("./components/public/Editprofile"));
const Guitars = lazy(() => import("./components/public/Guitars"));
const GuitarDetail = lazy(() => import("./components/public/GuitarDetail"));

const Dashboard = lazy(() => import("./components/private/dashboard/Dashboard"));
const AddGuitar = lazy(() => import("./components/private/packages/AddGuitar"));
const ManageGuitars = lazy(() => import("./components/private/packages/ManageGuitars"));
const PendingOrders = lazy(() => import("./components/private/orders/PendingOrders"));
const ConfirmedOrders = lazy(() => import("./components/private/orders/ConfirmedOrders"));
const Payments = lazy(() => import("./components/private/payments/Payments"));
const Users = lazy(() => import("./components/private/users/Users"));
const Reviews = lazy(() => import("./components/private/reviews/Reviews"));
const Profile = lazy(() => import("./components/private/profile/Profile"));
const Settings = lazy(() => import("./components/private/setting/settings"));

function App() {
  // Retrieve role from localStorage
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin"; // Assuming 'admin' is the role for admin users

  const publicRoutes = [
    {
      path: "/",
      element: <Suspense fallback={<LoadingFallback />}><Home /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/login",
      element: <Suspense fallback={<LoadingFallback />}><Login /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/register",
      element: <Suspense fallback={<LoadingFallback />}><Register /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/checkout",
      element: <Suspense fallback={<LoadingFallback />}><Checkout /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/checkout/:id",
      element: <Suspense fallback={<LoadingFallback />}><Checkout /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/faq",
      element: <Suspense fallback={<LoadingFallback />}><Faq /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/terms",
      element: <Suspense fallback={<LoadingFallback />}><Terms /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/privacy",
      element: <Suspense fallback={<LoadingFallback />}><Privacy /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/aboutus",
      element: <Suspense fallback={<LoadingFallback />}><Aboutus /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/contact",
      element: <Suspense fallback={<LoadingFallback />}><Contact /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/review",
      element: <Suspense fallback={<LoadingFallback />}><Review /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/favorite",
      element: <Suspense fallback={<LoadingFallback />}><Favorite /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/myprofile",
      element: <Suspense fallback={<LoadingFallback />}><Myprofile /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/mycart",
      element: <Suspense fallback={<LoadingFallback />}><Mycart /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/editprofile",
      element: <Suspense fallback={<LoadingFallback />}><EditProfile /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/guitars",
      element: <Suspense fallback={<LoadingFallback />}><Guitars /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    {
      path: "/guitars/:id",
      element: <Suspense fallback={<LoadingFallback />}><GuitarDetail /></Suspense>,
      errorElement: <ErrorFallback />,
    },
    // Admin routes - accessible only to admins
    ...(isAdmin ? [
      {
        path: "/admin",
        element: <Suspense fallback={<LoadingFallback />}><Layout /></Suspense>,
        errorElement: <ErrorFallback />,
        children: [
          { path: "dashboard", element: <Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>, errorElement: <ErrorFallback /> },
          { path: "addguitar", element: <Suspense fallback={<LoadingFallback />}><AddGuitar /></Suspense>, errorElement: <ErrorFallback /> },
          { path: "manageguitars", element: <Suspense fallback={<LoadingFallback />}><ManageGuitars /></Suspense>, errorElement: <ErrorFallback /> },
          { path: "pending", element: <Suspense fallback={<LoadingFallback />}><PendingOrders /></Suspense>, errorElement: <ErrorFallback /> },
          { path: "confirmed", element: <Suspense fallback={<LoadingFallback />}><ConfirmedOrders /></Suspense>, errorElement: <ErrorFallback /> },
          { path: "payments", element: <Suspense fallback={<LoadingFallback />}><Payments /></Suspense>, errorElement: <ErrorFallback /> },
          { path: "users", element: <Suspense fallback={<LoadingFallback />}><Users /></Suspense>, errorElement: <ErrorFallback /> },
          { path: "reviews", element: <Suspense fallback={<LoadingFallback />}><Reviews /></Suspense>, errorElement: <ErrorFallback /> },
          { path: "profile", element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense>, errorElement: <ErrorFallback /> },
          { path: "settings", element: <Suspense fallback={<LoadingFallback />}><Settings /></Suspense>, errorElement: <ErrorFallback /> },
        ],
      }
    ] : []),
    { path: "*", element: <div className="flex items-center justify-center min-h-screen"><div className="text-center"><h1 className="text-2xl font-bold text-red-600 mb-4">404: Page not found</h1><p className="text-gray-600">The page you're looking for doesn't exist</p></div></div> },
  ];

  return <RouterProvider router={createBrowserRouter(publicRoutes)} />;
}

export default App;
