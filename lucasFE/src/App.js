import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import SignUp from './pages/signupPage';
import Portal from './pages/portal';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/portal" element={<Portal />} />
            </Routes>
        </BrowserRouter>
    );
}
