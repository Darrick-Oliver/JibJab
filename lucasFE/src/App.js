import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import SignUp from './pages/signupPage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/signup"
                    element={
                        <Container maxWidth="lg">
                            <Box
                                sx={{
                                    my: 10,
                                }}
                            >
                                <SignUp />
                            </Box>
                        </Container>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
