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
            const res = await makePostRequest('/api/account/login', {
                username: username,
                password: password,
            });
            console.log(res.data.access_token);
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
                                    id='username'
                                    label='Username'
                                    name='username'
                                    autoComplete='username'
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
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
                        Join other young socialites on their journey to cleanse
                        the internet of old socialites
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
