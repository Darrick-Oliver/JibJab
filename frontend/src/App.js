import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login';
import { Portal } from './pages/portal';
import { Profile } from './pages/profile';
import { NotFound } from './pages/notFound';

export const AuthContext = React.createContext();

export default function App() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('jwt'));
    const [user, setUser] = useState(null);

    // Keep user info updated
    useEffect(() => {
        setUser(parseJwt(accessToken));
    }, [accessToken]);

    const loginRequired = (component) => {
        return accessToken ? component : <Navigate to='/' />;
    };

    const loggedInRedirect = (component) => {
        return accessToken ? <Navigate to='/portal' /> : component;
    };

    return (
        <AuthContext.Provider
            value={{
                auth: accessToken,
                setAuth: setAccessToken,
                user,
            }}
        >
            <BrowserRouter>
                <Routes>
                    <Route
                        exact
                        path='/'
                        element={loggedInRedirect(<Login />)}
                    />
                    <Route
                        exact
                        path='/portal'
                        element={loginRequired(<Portal />)}
                    />
                    <Route
                        exact
                        path='/profile/:id'
                        element={loginRequired(<Profile />)}
                    />
                    <Route exact path='/404' element={<NotFound />} />
                    <Route path='*' element={<Navigate to='/404' />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

function parseJwt(token) {
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload);
}
