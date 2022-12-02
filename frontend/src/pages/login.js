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
import logo from '../assets/jibJabLogo.png';
import theme from './theme';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { makePostRequest } from '../utils/requests';

export const Login = () => {
    const [auth, setAuth] = useContext(AuthContext);
    const [error, setError] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const nav = useNavigate();

    const handleSubmit = async () => {
        try {
            const res = await makePostRequest(
                'https://jibjab.azurewebsites.net/api/account/login',
                {
                    email: email,
                    password: password,
                }
            );
            setAuth(res.data.access_token);
            localStorage.setItem('jwt', res.data.access_token);
        } catch (err) {
            setError(err.errorMessage);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    height: '100vh',
                    flexDirection: 'row',
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        boxShadow: 20,
                        backgroundColor: 'white',
                        display: 'flex',
                        flex: 2,
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
                    <Box component='form' noValidate sx={{ mt: 5, width: 500 }}>
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
                                    id='email'
                                    label='Email'
                                    name='email'
                                    autoComplete='email'
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Grid>
                            {error && (
                                <Typography sx={{ color: 'red' }}>
                                    Error: {error}
                                </Typography>
                            )}
                        </Grid>
                        <Button
                            fullWidth
                            variant='contained'
                            sx={{ mt: 5, mb: 3, p: 2 }}
                            onClick={() => handleSubmit()}
                        >
                            <Typography variant='h1' fontSize={24}>
                                Login
                            </Typography>
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: 'Inter',
                        p: 5,
                    }}
                >
                    <Typography
                        component='h1'
                        color='#fff'
                        fontWeight='bold'
                        fontSize={32}
                    >
                        New to <span style={{ color: '#D17A22' }}>JibJab</span>?
                    </Typography>
                    <Typography
                        component='body'
                        sx={{ color: '#fff' }}
                        fontSize={20}
                        fontWeight='light'
                        textAlign='center'
                    >
                        Join now to build connections with other young
                        socialites around you, and engage with others in a fun
                        environment
                    </Typography>
                    <Button
                        variant='secondary'
                        sx={{
                            mt: 5,
                            p: 2,
                            width: 300,
                        }}
                        onClick={() => nav('/signup')}
                    >
                        <Typography
                            variant='h1'
                            fontSize={24}
                            color={'#D17A22'}
                        >
                            Sign up
                        </Typography>
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
