import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/login';
import { SignUp } from './pages/signup';
import { Portal } from './pages/portal';

export const AuthContext = React.createContext();

export default function App() {
    const [context, setContext] = useState(localStorage.getItem('jwt'));

    return (
        <AuthContext.Provider value={[context, setContext]}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/portal' element={<Portal />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}
