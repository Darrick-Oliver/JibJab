import { useContext, useEffect, useState, useRef } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    ThemeProvider,
    Slider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/SendOutlined';
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

const DEFAULT_RADIUS = 15;
const RAD_CHANGE_DELAY = 1000;
const MARK_START = 5;
const MARK_END = 30;
const MARK_STEP = 5;

export const Portal = () => {
    const [auth] = useContext(AuthContext);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [radius, setRadius] = useState(DEFAULT_RADIUS);
    const [messages, setMessages] = useState([]);

    const timeoutId = useRef();
    const didMount = useRef(false);

    const nav = useNavigate();

    // Generate mark labels
    let marks = [];
    for (let i = MARK_START; i <= MARK_END; i += MARK_STEP) {
        marks.push({
            value: i,
            label: `${i} mi`,
        });
    }

    const getMessages = () => {
        // TODO: get messages in range
        makeGetRequest('/api/message/getAll', {
            accesstoken: auth,
        })
            .then((res) => {
                const sorted = res.data.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time);
                });
                setMessages(sorted);
            })
            .catch((err) => {
                console.error(err.errorMessage);
            });
    };

    useEffect(() => {
        // Return to login if not logged in
        if (!auth) {
            nav('/');
        }
    });

    // Grab location
    useEffect(() => {
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by your browser');
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude);
                    setLng(position.coords.longitude);
                },
                () => {
                    console.error('Unable to retrieve your location');
                }
            );
        }
    }, []);

    // Grab all messages in the area
    useEffect(() => {
        getMessages();
    }, []);

    // Set timer to grab new messages every time radius is updated
    useEffect(() => {
        if (didMount.current) {
            // Get rid of old timer if it exists
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
                timeoutId.current = undefined;
            }

            // Wait before grabbing more messages
            const id = setTimeout(() => {
                setMessages([]);
                getMessages();
                timeoutId.current = undefined;
            }, RAD_CHANGE_DELAY);
            timeoutId.current = id;
        } else didMount.current = true;
    }, [radius]);

    const handlePost = async (message) => {
        try {
            // Dont send request if null values, show error message
            // TODO: Error message
            if (!lat || !lng || !message) {
                throw 'Null values';
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
            setMessages([res.data, ...messages]);
            return;
        } catch (err) {
            console.error(err.errorMessage);
            throw err.errorMessage;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Container component='main' maxWidth='md'>
                <CssBaseline />
                <MessageBox onPress={handlePost} />
                <Box
                    backgroundColor={'#2B333D'}
                    borderRadius={5}
                    sx={{
                        p: 2,
                        my: 2,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    flexDirection={'row'}
                >
                    <Typography color={'#D17A22'} fontSize={18} sx={{ pr: 3 }}>
                        Range
                    </Typography>
                    <Slider
                        value={radius}
                        onChange={(_e, val) => setRadius(val)}
                        valueLabelDisplay='auto'
                        step={5}
                        marks={marks}
                        min={5}
                        max={30}
                        sx={{
                            mx: 1,
                            '& .MuiSlider-markLabel': { color: 'white' },
                        }}
                    />
                </Box>
                <Messages messages={messages} />
            </Container>
        </ThemeProvider>
    );
};

const Header = () => {
    const [hover, setHover] = useState(false);
    const [auth, setAuth] = useContext(AuthContext);
    const nav = useNavigate();

    const handleLogout = () => {
        setAuth(null);
        localStorage.removeItem('jwt');
        nav('/');
    };

    return (
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
    );
};

const MessageBox = ({ onPress }) => {
    const [message, setMessage] = useState('');

    return (
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
                        label="What's on your mind?"
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
                        onClick={async () => {
                            try {
                                await onPress(message);
                                setMessage('');
                            } catch (err) {
                                return;
                            }
                        }}
                    >
                        <Typography fontWeight='bold'>
                            Jab&nbsp;&nbsp;
                        </Typography>
                        <SendIcon />
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

const Messages = ({ messages }) => {
    return (
        <Box sx={{ mt: 15 }}>
            {messages.map((value, index) => {
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
    );
};
