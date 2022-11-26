import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login';
import { SignUp } from './pages/signup';
import { Portal } from './pages/portal';
import { Profile } from './pages/profile';

export const AuthContext = React.createContext();

export default function App() {
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('jwt'));
    const user = parseJwt(loggedIn);

    const loginRequired = (component) => {
        return loggedIn ? component : <Navigate to='/' />;
    };

    const loggedInRedirect = (component) => {
        return loggedIn ? <Navigate to='/portal' /> : component;
    };

    return (
        <AuthContext.Provider value={[loggedIn, setLoggedIn, user]}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={loggedInRedirect(<Login />)} />
                    <Route
                        path='/signup'
                        element={loggedInRedirect(<SignUp />)}
                    />
                    <Route path='/portal' element={loginRequired(<Portal />)} />
                    <Route
                        path='/profile/:id'
                        element={loginRequired(<Profile />)}
                    />
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
