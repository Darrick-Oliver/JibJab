import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
//import Container from '@mui/material/Container';
import logo from './jibJabLogo.png';
import { Link as RouterLink } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
// import { Image } from 'mui-image';

// function Copyright(props) {
//     return (
//         <Typography
//             variant="body2"
//             color="text.secondary"
//             align="center"
//             {...props}
//         >
//             {'Copyright © '}
//             <Link color="inherit" href="https://mui.com/">
//                 The Young Socialites
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

export default function SignUp() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    width: 1138 / 1920,
                    height: '100vh',
                    boxShadow: 20,
                    p: 10,
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontFamily: 'Inter',
                }}
            >
                <img
                    src={logo}
                    style={{
                        width: 200,
                        border: 8,
                        borderColor: '#465362',
                    }}
                />
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 5 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <RouterLink to="/portal">
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 5, mb: 3, p: 3 }}
                        >
                            <Typography component="h1" variant="h5">
                                Login
                            </Typography>
                        </Button>
                    </RouterLink>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <RouterLink to="/">
                                <Link color="primary">
                                    <Typography component="h1" variant="body1">
                                        Already have an account? Sign in
                                    </Typography>
                                </Link>
                            </RouterLink>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
