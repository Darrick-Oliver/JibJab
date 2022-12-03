import { useContext, useState } from 'react';
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
import theme from './theme';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { makePostRequest } from '../utils/requests';
import { host } from '../utils/host';

const usingMobile = () => window.screen.width < 480;

export const SignUp = () => {
    const { setAuth } = useContext(AuthContext);
    const [error, setError] = useState();
    const nav = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const user = {
            first_name: data.get('firstName'),
            last_name: data.get('lastName'),
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
        };

        if (
            !user.first_name ||
            !user.last_name ||
            !user.username ||
            !user.email ||
            !user.password
        ) {
            setError('Cannot include empty fields');
            return;
        }

        if (user.password != data.get('confirmpassword')) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await makePostRequest(
                `${host}/api/account/register`,
                user
            );
            setAuth(res.data.access_token);
            localStorage.setItem('jwt', res.data.access_token);
            nav('/');
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
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        boxShadow: 10,
                        p: 4,
                        maxWidth: 700,
                        minHeight: '90%',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        borderRadius: 5,
                        fontFamily: 'Inter',
                    }}
                >
                    <Typography color='#D17A22' fontWeight='bold' fontSize={50}>
                        Jab <span style={{ color: '#000000' }}>with us!</span>
                    </Typography>
                    <Typography fontSize={20}>
                        We just need some information to get you started
                    </Typography>
                    <Box
                        component='form'
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 5 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete='given-name'
                                    name='firstName'
                                    required
                                    fullWidth
                                    id='firstName'
                                    label='First Name'
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id='lastName'
                                    label='Last Name'
                                    name='lastName'
                                    autoComplete='family-name'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id='email'
                                    label='Email Address'
                                    name='email'
                                    autoComplete='email'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id='username'
                                    label='Username'
                                    name='username'
                                    autoComplete='username'
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
                                    autoComplete='new-password'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name='confirmpassword'
                                    label='Confirm Password'
                                    type='password'
                                    id='confirmpassword'
                                    autoComplete='new-password'
                                />
                            </Grid>
                        </Grid>
                        {error && (
                            <Typography
                                variant='h1'
                                sx={{ mt: 2 }}
                                color={theme.palette.error.main}
                            >
                                Error: {error}
                            </Typography>
                        )}

                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{ my: 2, p: 1.5 }}
                        >
                            <Typography fontSize={20}>Register</Typography>
                        </Button>
                    </Box>
                    <Link
                        style={{ cursor: 'pointer' }}
                        color='primary'
                        onClick={() => nav('/')}
                    >
                        <Typography>
                            Already have an account? Sign in
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
