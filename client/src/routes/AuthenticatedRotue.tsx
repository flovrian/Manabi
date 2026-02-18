import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import LoadingScreen from "../components/hud/loading/LoadingScreen";

export default function AuthenticatedRoute() {
    const { user } = useAuth();

    if (user === 'loading') {
        return <LoadingScreen />;
    }
    if (user === null) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}