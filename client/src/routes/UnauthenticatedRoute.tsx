import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import LoadingScreen from "../components/hud/loading/LoadingScreen";

export default function UnauthenticatedRoute() {
    const { user } = useAuth();
    return user === 'loading'
        ?  <LoadingScreen />
        : (
            user === null
            ?  <Outlet />
            : <Navigate to="/space" replace />
        );
}