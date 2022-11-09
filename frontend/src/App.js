import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import SignUp from './pages/signupPage';
import Portal from './pages/portal';
//remote build test comment 2

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
