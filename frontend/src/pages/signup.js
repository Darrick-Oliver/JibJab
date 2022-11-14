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
    Container,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import theme from './theme';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { makePostRequest } from '../utils/requests';

const Copyright = (props) => {
    return (
        <Typography
            variant='body2'
            color='text.secondary'
            align='center'
            {...props}
        >
            {'Copyright © '}
            <Link color='inherit' href='https://mui.com/'>
                The Young Socialites
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
};

export const SignUp = () => {
    const [auth, setAuth] = useContext(AuthContext);
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

        if (user.password != data.get('confirmpassword')) {
            setError('Passwords do not match');
        }

        try {
            const res = await makePostRequest('/api/account/register', user);
            setAuth(res.data.access_token);
            localStorage.setItem('jwt', res.data.access_token);
            nav('/');
        } catch (err) {
            setError(err.errorMessage);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component='main' maxWidth='md'>
                <CssBaseline />
                <Box
                    sx={{
                        boxShadow: 10,
                        p: 10,
                        backgroundColor: 'white',
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 5,
                        fontFamily: 'Inter',
                    }}
                >
                    <Typography
                        component='h1'
                        variant='h2'
                        color='#D17A22'
                        fontWeight='bold'
                    >
                        Jab <span style={{ color: '#000000' }}>with us!</span>
                    </Typography>
                    <Typography component='h1' variant='h5'>
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
                        {error && <Typography>Error: {error}</Typography>}

                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{ mt: 5, mb: 3, p: 2 }}
                        >
                            <Typography component='h1' variant='h5'>
                                Create Account
                            </Typography>
                        </Button>
                        <Grid container justifyContent='flex-end'>
                            <Grid item>
                                <RouterLink to='/'>
                                    <Link color='primary'>
                                        <Typography
                                            component='h1'
                                            variant='body1'
                                        >
                                            Already have an account? Sign in
                                        </Typography>
                                    </Link>
                                </RouterLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
};
