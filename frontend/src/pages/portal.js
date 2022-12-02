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
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/SendOutlined';
import theme from './theme';
import { AuthContext } from '../App';
import { makePostRequest } from '../utils/requests';
import { Header } from '../components/header';
import { Post } from '../components/post';
import { invalidUserChecker } from '../utils/checkErrors';

const DEFAULT_RADIUS = 15;
const RAD_CHANGE_DELAY = 0.5;
const MARK_START = 5;
const MARK_END = 30;
const MARK_STEP = 5;

export const Portal = () => {
    const [auth, setAuth] = useContext(AuthContext);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [radius, setRadius] = useState(DEFAULT_RADIUS);
    const [messages, setMessages] = useState(null);
    const nav = useNavigate();

    const timeoutId = useRef();
    const didMount = useRef(false);

    // Generate mark labels
    let marks = [];
    for (let i = MARK_START; i <= MARK_END; i += MARK_STEP) {
        marks.push({
            value: i,
            label: `${i} mi`,
        });
    }

    // Get messages in radius
    const getMessages = () => {
        if (!lat || !lng) return;

        makePostRequest(
            'https://jibjab.azurewebsites.net/api/message/get',
            {
                latitude: lat,
                longitude: lng,
                distance: radius,
            },
            {
                accesstoken: auth,
            }
        )
            .then((res) => {
                const sorted = res.data.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time);
                });
                setMessages(sorted);
            })
            .catch((err) => {
                // Log user out if invalid token
                if (invalidUserChecker(err.errorMessage)) {
                    setAuth(null);
                    localStorage.removeItem('jwt');
                    nav('/');
                }
                console.error(err.errorMessage);
            });
    };

    // Grab location data from browser
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
        if (lat && lng) getMessages();
    }, [lat, lng]);

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
                setMessages(null);
                getMessages();
                timeoutId.current = undefined;
            }, RAD_CHANGE_DELAY * 1000);
            timeoutId.current = id;
        } else didMount.current = true;
    }, [radius]);

    const handlePost = async (message) => {
        try {
            // Dont send request if null values, show error message
            // TODO: Error message
            if (!lat || !lng || !message) {
                throw 'Null values';
            } else if (message > 281) {
                throw 'Message must be at most 281 characters';
            }

            const res = await makePostRequest(
                'https://jibjab.azurewebsites.net/api/message/create',
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
            if (invalidUserChecker(err.errorMessage)) {
                setAuth(null);
                localStorage.removeItem('jwt');
                nav('/');
            }
            throw err.errorMessage;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Container component='main' maxWidth='md'>
                <CssBaseline />
                <MessageBox onPress={handlePost} />
                <RadiusSlider
                    onChange={(val) => setRadius(val)}
                    value={radius}
                    marks={marks}
                />
                <Messages messages={messages} />
            </Container>
        </ThemeProvider>
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
                        multiline
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
                <Grid
                    container
                    item
                    xs={12}
                    alignItems='center'
                    justifyContent='flex-end'
                >
                    {message.length ? (
                        <Typography
                            color={
                                message.length <= 281
                                    ? '#fff'
                                    : theme.palette.error.main
                            }
                            sx={{ mt: 2, p: 1 }}
                        >
                            {message.length}/281
                        </Typography>
                    ) : (
                        <></>
                    )}
                    <Button
                        type='submit'
                        variant='contained'
                        sx={{ mt: 2, p: 1 }}
                        disabled={message.length > 281}
                        onClick={async () => {
                            try {
                                await onPress(message);
                                setMessage('');
                            } catch (err) {
                                console.error(err);
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
            {messages ? (
                messages.map((value, index) => {
                    return (
                        <Post
                            post={value}
                            key={`comments-${value.user.username}-${index}`}
                        />
                    );
                })
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </div>
            )}
        </Box>
    );
};

const RadiusSlider = ({ onChange, value, marks }) => {
    return (
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
                Distance
            </Typography>
            <Slider
                value={value}
                onChange={(_e, val) => onChange(val)}
                valueLabelDisplay='auto'
                step={MARK_STEP}
                marks={marks}
                min={MARK_START}
                max={MARK_END}
                sx={{
                    mx: 1,
                    '& .MuiSlider-markLabel': { color: 'white' },
                }}
            />
        </Box>
    );
};
