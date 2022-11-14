import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/SendOutlined';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from './logout.svg';
import LogoutClosedIcon from './logout_closed.svg';
import { makeGetRequest, makePostRequest } from '../utils/requests';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export const Portal = () => {
    const [auth, setAuth] = useContext(AuthContext);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [displayed, setDisplayed] = useState([]);
    const [hover, setHover] = useState(false);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        if (!auth) {
            nav('/');
        }
    });

    const handleLogout = () => {
        setAuth(null);
        localStorage.removeItem('jwt');
        nav('/');
    };

    const handlePost = async () => {
        try {
            if (!lat || !lng || !message) {
                return;
            }

            const res = await makePostRequest(
                '/api/message/create',
                {
                    message: message,
                    latitude: lat,
                    longitude: lng,
                },
                {
                    accesstoken: auth,
                }
            );
            setDisplayed([res.data, ...displayed]);
            setMessage('');
        } catch (err) {
            setError(err.errorMessage);
        }
    };

    // Grab location
    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude);
                    setLng(position.coords.longitude);
                },
                () => {
                    setError('Unable to retrieve your location');
                }
            );
        }
    }, []);

    useEffect(() => {
        makeGetRequest('/api/message/getAll', {
            accesstoken: auth,
        })
            .then((res) => {
                const sorted = res.data.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time);
                });
                setDisplayed(sorted);
            })
            .catch((err) => {
                setError(err.errorMessage);
            });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Grid container justifyContent='flex-end'>
                <div
                    onClick={handleLogout}
                    style={{
                        paddingRight: 10,
                        paddingTop: 10,
                        cursor: 'pointer',
                    }}
                    onMouseOver={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    {!hover ? (
                        <img src={LogoutClosedIcon} alt='Logout' />
                    ) : (
                        <img src={LogoutIcon} alt='Logout' />
                    )}
                </div>
            </Grid>
            <Container component='main' maxWidth='md'>
                <CssBaseline />
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: '#2B333D',
                        borderRadius: 5,
                        fontFamily: 'Inter',
                    }}
                >
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id='jab'
                                label="What's on your mind?"
                                name='jab'
                                variant='filled'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                sx={{
                                    background: '#FFFFFF',
                                    borderRadius: 2,
                                }}
                            />
                        </Grid>
                        <Grid container item xs={12} justifyContent='flex-end'>
                            <Button
                                type='submit'
                                variant='contained'
                                sx={{ mt: 2, p: 1 }}
                                onClick={handlePost}
                            >
                                <Typography fontWeight='bold'>
                                    Jab&nbsp;&nbsp;
                                </Typography>
                                <SendIcon />
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mt: 15 }}>
                    {displayed.map((value, index) => {
                        return (
                            <Box
                                key={`comments-${value.username}-${index}`}
                                backgroundColor={'#2B333D'}
                                height={120}
                                borderRadius={5}
                                sx={{
                                    p: 2,
                                    my: 2,
                                }}
                            >
                                <Typography color={'#D17A22'} fontSize={22}>
                                    {value.message}
                                </Typography>
                                <Typography color={'#fff'} fontSize={16}>
                                    {value.username} •{' '}
                                    {timeAgo.format(new Date(value.time))}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Container>
        </ThemeProvider>
    );
};
