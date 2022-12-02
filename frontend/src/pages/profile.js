import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    ThemeProvider,
    Typography,
    Box,
    Button,
    TextField,
    CircularProgress,
} from '@mui/material';
import theme from './theme';
import { Header } from '../components/header';
import { useEffect, useContext, useState } from 'react';
import { makeGetRequest, makePostRequest } from '../utils/requests';
import { AuthContext } from '../App';
import { invalidUserChecker } from '../utils/checkErrors';
import { Post } from '../components/post';

const States = {
    viewing: 0,
    editing: 1,
};

export const Profile = () => {
    const { id } = useParams();
    const [auth, setAuth, currUser] = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState(null);
    const [userMessages, setUserMessages] = useState(null);
    const [state, setState] = useState(States.viewing);
    const [bio, setBio] = useState('');
    const nav = useNavigate();

    // Get user info
    const getUserInfo = () => {
        makeGetRequest(`/api/account/${id}`, {
            accesstoken: auth,
        })
            .then((data) => {
                setUserInfo(data.data);
            })
            .catch((err) => {
                // Log user out if invalid token
                if (invalidUserChecker(err.errorMessage)) {
                    setAuth(null);
                    localStorage.removeItem('jwt');
                    nav('/');
                } else {
                    console.error(err.errorMessage);
                    nav('/404');
                }
            });
    };

    const handleBioSubmit = () => {
        if (bio > 240) return;
        else if (bio == userInfo.bio) {
            setState(States.viewing);
            return;
        }

        makePostRequest(
            '/api/account/update/bio',
            { bio: bio },
            {
                accesstoken: auth,
            }
        )
            .then(() => {
                // Update user info
                userInfo.bio = bio;
                setUserInfo(userInfo);

                // Switch back to viewing
                setState(States.viewing);
            })
            .catch((err) => {
                // Log user out if invalid token
                if (invalidUserChecker(err.errorMessage)) {
                    setAuth(null);
                    localStorage.removeItem('jwt');
                    nav('/');
                } else {
                    console.error(err.errorMessage);
                }
            });
    };

    // Get user info on mount and id change
    useEffect(() => {
        getUserInfo();
    }, [id]);

    useEffect(() => {
        if (!userInfo) return;

        makeGetRequest(`/api/account/messages/${id}`, {
            accesstoken: auth,
        })
            .then((res) => {
                // Update user info
                setUserMessages(res.data);
            })
            .catch((err) => {
                // Log user out if invalid token
                if (invalidUserChecker(err.errorMessage)) {
                    setAuth(null);
                    localStorage.removeItem('jwt');
                    nav('/');
                } else {
                    console.error(err.errorMessage);
                }
            });
    }, [userInfo]);

    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Container component='main' maxWidth='md'>
                {userInfo && (
                    <>
                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: '#2B333D',
                                borderRadius: 5,
                                fontFamily: 'Inter',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    color={'#D17A22'}
                                    fontSize={48}
                                    fontWeight={'bold'}
                                >
                                    {userInfo.first_name} {userInfo.last_name}
                                </Typography>
                                <div style={{ flex: 1 }} />
                                <Typography color={'#fff'} fontSize={20}>
                                    Jabbin{"'"} since{' '}
                                    {new Date(
                                        userInfo.joined
                                    ).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Typography>
                            </div>

                            {state == States.editing ? (
                                <>
                                    <TextField
                                        label='Bio'
                                        placeholder={userInfo.bio}
                                        multiline
                                        variant='filled'
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        sx={{
                                            '& .MuiFormLabel-root': {
                                                color: '#aaaaaa',
                                            },
                                            '& .MuiInputBase-input': {
                                                color: '#fff',
                                            },
                                        }}
                                    />
                                    <Typography
                                        sx={{ mt: 1 }}
                                        color={
                                            bio.length <= 240
                                                ? '#fff'
                                                : theme.palette.error.main
                                        }
                                    >
                                        {bio.length}/240
                                    </Typography>
                                </>
                            ) : (
                                <Typography color={'#fff'} fontSize={20}>
                                    {userInfo.bio}
                                </Typography>
                            )}

                            {currUser.username == userInfo.username && (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Button
                                        variant={
                                            state == States.editing
                                                ? 'secondary'
                                                : 'contained'
                                        }
                                        sx={{ mr: 1, mt: 2, p: 1, width: 80 }}
                                        onClick={() => {
                                            setState(
                                                state == States.editing
                                                    ? States.viewing
                                                    : States.editing
                                            );
                                            setBio(userInfo.bio || '');
                                        }}
                                    >
                                        {state == States.editing
                                            ? 'Cancel'
                                            : 'Edit'}
                                    </Button>
                                    {state == States.editing && (
                                        <Button
                                            variant='contained'
                                            sx={{ mt: 2, p: 1, width: 80 }}
                                            onClick={handleBioSubmit}
                                            disabled={bio.length > 240}
                                        >
                                            Submit
                                        </Button>
                                    )}
                                </div>
                            )}
                        </Box>
                        {userMessages ? (
                            <Box sx={{ mt: 15 }}>
                                {userMessages.map((value, index) => {
                                    return (
                                        <Post
                                            post={value}
                                            key={`comments-${value.user.username}-${index}`}
                                        />
                                    );
                                })}
                            </Box>
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <CircularProgress />
                            </div>
                        )}
                    </>
                )}
            </Container>
        </ThemeProvider>
    );
};
