import React from "react";
import {getProfileData, getUserSession, UserData, SessionData, ProfileData} from "../helpers/UserHelper";
import {config} from "../../config";

interface AuthContextType {
    user: UserData | null | 'loading';
    setUser: React.Dispatch<React.SetStateAction<UserData | null | 'loading'>>;
    loginUser: (sessionData: SessionData) => Promise<void>;
    logoutUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
    loginUser(sessionData: SessionData): Promise<void> { return Promise.resolve(undefined); },
    logoutUser(): Promise<void> { return Promise.resolve(undefined); },
    user: null,
    setUser: (() => {}) as React.Dispatch<React.SetStateAction<UserData | null | 'loading'>>
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<UserData | null | 'loading'>('loading');

    const requestId = React.useRef(0);

    React.useEffect(() => {
        const id = ++requestId.current;

        fetchUserData()
            .then(data => {
                if (id === requestId.current) {
                    setUser(data);
                }
            })
            .catch(() => {
                if (id === requestId.current) {
                    setUser(null);
                }
            });
    }, []);

    const loginUser = React.useCallback(async (sessionData: SessionData) => {
        const profileData = await getProfileData(sessionData.user_id);
        if(!profileData){
            setUser(null);
            return;
        }
        setUser({ sessionData, profileData });
    }, []);

    const logoutUser = React.useCallback(async() : Promise<void> => {
        requestId.current++;
        setUser(null);
        await fetch(`${config.apiUrl}/auth/logout`, { method: 'POST',  credentials: 'include' });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useProfileData() : ProfileData | null {
    const { user } = useAuth();
    if (user && user !== 'loading'){
        return user.profileData;
    }
    return null;
}


async function fetchUserData(): Promise<UserData | null> {
    const sessionData = await getUserSession();
    if (!sessionData){
        return null;
    }
    const profileData = await getProfileData(sessionData.user_id);
    if (!profileData){
        return null;
    }
    return { sessionData, profileData };
}

export function useAuth() {
    const ctx = React.useContext(AuthContext);
    if (!ctx) throw new Error("useAuth can't be used outside AuthProvider");
    return ctx;

}


