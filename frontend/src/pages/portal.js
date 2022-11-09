import * as React from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/SendOutlined';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as RouterLink } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

export default function Portal() {
    return (
        <ThemeProvider theme={theme}>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <RouterLink to="/">
                        <Button>
                            <Typography component="h1" variant="body1">
                                Logout
                            </Typography>
                        </Button>
                    </RouterLink>
                </Grid>
            </Grid>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box
                    sx={{
                        boxShadow: 10,
                        p: 4,
                        backgroundColor: '#2B333D',
                        marginTop: 5,
                        borderRadius: 5,
                        fontFamily: 'Inter',
                    }}
                >
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="jab"
                                label="What's on your mind?"
                                name="jab"
                                variant="filled"
                                sx={{
                                    background: '#FFFFFF',
                                    borderRadius: 1,
                                }}
                            />
                        </Grid>
                        <Grid container item xs={12} justifyContent="flex-end">
                            <RouterLink to="/portal">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 2, mb: -2, p: 1 }}
                                >
                                    <Typography fontWeight="bold">
                                        Jab&nbsp;&nbsp;
                                    </Typography>
                                    <SendIcon />
                                </Button>
                            </RouterLink>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
