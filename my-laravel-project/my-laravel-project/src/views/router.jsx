import { createBrowserRouter } from "react-router-dom";
import Login from "./login.jsx";
import Register from "./register.jsx";
import Users from "./Users.jsx";
import UserForm from "./UserForm";
import DefaultLayout from "../Components/DefaultLayout.jsx";
import GuestLayout from "../Components/GuestLayout.jsx";
import Products from "../Components/Products.jsx";
import ProductForm from "../Components/ProductForm.jsx";
import Category from "../Components/Category.jsx";
import CategoryForm from "../Components/CategoryForm";
import ProductView from "../Components/ProductView";
import Majors from "../Components/Major.jsx";
import MajorForm from "../Components/MajorForm";
import Minors from "../Components/Minor.jsx";
import MinorForm from "../Components/MinorForm";
import Vendors from "../Components/Vendor.jsx";
import VendorForm from "../Components/VendorForm.jsx";
import ProtectedRoute from '../Components/ProtectedRoute';
import Dashboard from '../Components/Dashboard';
import ProductQR from "../Components/ProductQR";
import ProductLabel from "../Components/ProductLabel";

const router = createBrowserRouter([
  // GUEST ROUTES
  {
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  // AUTHENTICATED ROUTES
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      

      // USERS (superadmin)
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Users />
          </ProtectedRoute>
        ),
      },

      {
        path: "/users/create",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <UserForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/edit/:id",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <UserForm />
          </ProtectedRoute>
        ),
      },

      // CATEGORIES (superadmin)
      {
        path: "/categories",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Category />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-category",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <CategoryForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-category/:id",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <CategoryForm />
          </ProtectedRoute>
        ),
      },

      // MAJORS (superadmin)
      {
        path: "/majors",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Majors />
          </ProtectedRoute>
        ),
      },
      {
        path: "/majors/create",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <MajorForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/majors/edit/:id",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <MajorForm />
          </ProtectedRoute>
        ),
      },

      // MINORS (superadmin)
      {
        path: "/minors",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Minors />
          </ProtectedRoute>
        ),
      },
      {
        path: "/minors/create",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <MinorForm />
          </ProtectedRoute>
        ),
      },

      // VENDORS (superadmin)
      {
        path: "/vendors",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Vendors />
          </ProtectedRoute>
        ),
      },
      {
        path: "/vendors/new",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <VendorForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/vendors/edit/:id",
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <VendorForm />
          </ProtectedRoute>
        ),
      },

      // PRODUCTS (admin + superadmin)
      {
        path: "/products",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <Products />
          </ProtectedRoute>
        ),
      },
      {
        path: "/products/new",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <ProductForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/products/edit/:id",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <ProductForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/products/view/:id",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <ProductView />
          </ProtectedRoute>
        ),
      },

      {
        path:"/products/qr/:id",
        element:  (
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
          <ProductQR />
          </ProtectedRoute>
        )
      },

      {
        path:"/products/qr/:id",
        element:(
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <ProductLabel />
          </ProtectedRoute>
        )
      },

      // DASHBOARD ROUTE
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
