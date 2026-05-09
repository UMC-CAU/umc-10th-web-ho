import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleOAuthCallbackPage from "./pages/GoogleOAuthCallbackPage";
import Login from "./pages/Login";
import LpCreatePage from "./pages/LpCreatePage";
import LpDetailPage from "./pages/LpDetailPage";
import LpListPage from "./pages/LpListPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import Signup from "./pages/Signup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <LpListPage />,
            },
            {
                path: "lps",
                element: <Navigate to="/" replace />,
            },
            {
                path: "lp/new",
                element: (
                    <ProtectedRoute>
                        <LpCreatePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "lp/:lpid",
                element: (
                    <ProtectedRoute>
                        <LpDetailPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/auth/google/callback",
        element: <GoogleOAuthCallbackPage />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
