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
    Link,
} from '@mui/material';
import SendIcon from '@mui/icons-material/SendOutlined';
import theme from './theme';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { makeGetRequest, makePostRequest } from '../utils/requests';
import { Header } from '../components/header';
import { Post } from '../components/post';

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

    // Generate mark labels
    let marks = [];
    for (let i = MARK_START; i <= MARK_END; i += MARK_STEP) {
        marks.push({
            value: i,
            label: `${i} mi`,
        });
    }

    const getMessages = () => {
        makePostRequest(
            '/api/message/get',
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
                console.error(err.errorMessage);
            });
    };

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
                    <Post
                        post={value}
                        key={`comments-${value.username}-${index}`}
                    />
                );
            })}
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
                Range
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
