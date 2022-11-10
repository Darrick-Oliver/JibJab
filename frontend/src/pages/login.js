import React, { useContext, useEffect, useState } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Link,
    Box,
    Typography,
    ThemeProvider,
} from '@mui/material';
import logo from './jibJabLogo.png';
import theme from './theme';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { makePostRequest } from '../utils/requests';

export const Login = () => {
    const [auth, setAuth] = useContext(AuthContext);
    const [error, setError] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const nav = useNavigate();

    useEffect(() => {
        if (auth) {
            nav('/portal');
        }
    }, [auth]);

    const handleSubmit = async () => {
        console.log(username, password);
        try {
            const res = await makePostRequest(
                'http://localhost:3001/api/account/login',
                { username: username, password: password }
            );
            setAuth(res.data.access_token);
        } catch (err) {
            setError(err.errorMessage);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    width: '60%',
                    height: '100vh',
                    boxShadow: 20,
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'Inter',
                }}
            >
                <img
                    src={logo}
                    style={{
                        width: 200,
                        border: '5px solid #465362',
                        borderColor: '#465362',
                        borderRadius: 5,
                        paddingTop: 10,
                        paddingBottom: 10,
                    }}
                />
                <Box component='form' noValidate sx={{ mt: 5 }}>
                    <Grid
                        container
                        spacing={2}
                        alignItems='center'
                        justifyContent='center'
                    >
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id='username'
                                label='Username'
                                name='username'
                                autoComplete='username'
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name='password'
                                label='Password'
                                type='password'
                                id='password'
                                autoComplete='password'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Typography variant='body1'>
                            Forgot your password? Click <Link>here</Link>
                        </Typography>

                        {error && <Typography>{error}</Typography>}
                    </Grid>
                    <Button
                        fullWidth
                        variant='contained'
                        sx={{ mt: 5, mb: 3, p: 2 }}
                        onClick={() => handleSubmit()}
                    >
                        <Typography variant='h1' fontSize={20}>
                            Login
                        </Typography>
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
