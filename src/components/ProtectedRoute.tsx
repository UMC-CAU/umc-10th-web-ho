import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ProtectedRouteProps = {
    children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();
    const { getItem } = useLocalStorage<string>("ACCESS_TOKEN");
    const token = getItem();

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}