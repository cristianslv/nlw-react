import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}

export const AuthConstext = createContext({} as AuthContextData);

type AuthProvider = {
    children: ReactNode;
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
};

export function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null);

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=0caa1132a6fc0d70a347`;

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>("authenticate", {
            code: githubCode
        });

        const { token, user } = response.data;

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        localStorage.setItem("@dowhile:token", token);

        setUser(user);
    }

    function signOut() {
        setUser(null);
        localStorage.removeItem("@dowhile:token");
    }

    useEffect(() => {
        const token = localStorage.getItem("@dowhile:token");

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`;

            api.get<User>('profile').then(response => {
                setUser(response.data);
            });
        }
    }, []);

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes("?code=");

        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split("?code=");

            window.history.pushState({}, "", urlWithoutCode);
            
            signIn(githubCode);
        }
    }, []);

    return (
        <AuthConstext.Provider value={{signInUrl, user, signOut}}>
            {props.children}
        </AuthConstext.Provider>
    );
}