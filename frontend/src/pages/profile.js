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
import {
    makeGetRequest,
    makePostRequest,
    makeDeleteRequest,
} from '../utils/requests';
import { AuthContext } from '../App';
import { invalidUserChecker } from '../utils/checkErrors';
import { Post } from '../components/post';
import { host } from '../utils/host';
import { usingMobile } from '../hooks/windowDimensions';

const States = {
    viewing: 0,
    editing: 1,
};

export const Profile = () => {
    const { id } = useParams();
    const { auth, setAuth, user } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState(undefined);
    const [userMessages, setUserMessages] = useState(undefined);
    const [state, setState] = useState(States.viewing);
    const [bio, setBio] = useState('');
    const nav = useNavigate();
    const mobile = usingMobile();

    // Get user info
    const getUserInfo = () => {
        makeGetRequest(`${host}/api/account/${id}`, {
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
            `${host}/api/account/update/bio`,
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

        makeGetRequest(`${host}/api/account/messages/${id}`, {
            accesstoken: auth,
        })
            .then((res) => {
                // Update user info
                const sorted = res.data.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time);
                });
                setUserMessages(sorted);
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

    const handleReaction = async (message, reaction, increment) => {
        if (
            (message.reactions[reaction] == true && increment) ||
            (message.reactions[reaction] == false && !increment)
        )
            return;

        // Update before post
        for (let i = 0; i < userMessages.length; i++) {
            if (message._id == userMessages[i]._id) {
                message.numReactions[reaction] = String(
                    increment
                        ? Number(message.numReactions[reaction]) + 1
                        : Number(message.numReactions[reaction]) - 1
                );
                message.reactions[reaction] = increment;
                break;
            }
        }
        setUserMessages([...userMessages]);

        makePostRequest(
            `${host}/api/message/react`,
            {
                reaction: reaction,
                messageid: message._id,
                increment: increment,
            },
            {
                accesstoken: auth,
            }
        )
            .then(() => {
                return;
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

                // Undo previous update on error
                for (let i = 0; i < userMessages.length; i++) {
                    if (message._id == userMessages[i]._id) {
                        message.numReactions[reaction] = String(
                            increment
                                ? Number(message.numReactions[reaction]) - 1
                                : Number(message.numReactions[reaction]) + 1
                        );
                        message.reactions[reaction] = !increment;
                        break;
                    }
                }
                setUserMessages([...userMessages]);
            });
    };

    const handleDelete = async (message) => {
        makeDeleteRequest(`${host}/api/message/delete/${message._id}`, {
            accesstoken: auth,
        })
            .then(() => {
                for (let i = 0; i < userMessages.length; i++) {
                    if (message._id == userMessages[i]._id) {
                        userMessages.splice(i, 1);
                    }
                }
                setUserMessages([...userMessages]);
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

    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Container component='main' maxWidth='md'>
                {userInfo !== undefined && (
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
                            {/* User's name and join date */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: mobile ? 'column' : 'row',
                                    alignItems: !mobile && 'center',
                                }}
                            >
                                <Typography
                                    color={'#D17A22'}
                                    fontSize={45}
                                    fontWeight={'bold'}
                                >
                                    {userInfo.first_name} {userInfo.last_name}
                                </Typography>
                                <div style={{ flex: 1 }} />
                                <Typography color={'#fff'} fontSize={18}>
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

                            {/* Separate bio from user info */}
                            {mobile && userInfo.bio && (
                                <div
                                    style={{
                                        marginTop: 10,
                                        marginBottom: 10,
                                        height: 1,
                                        width: '100%',
                                        backgroundColor: '#D17A22',
                                        alignSelf: 'center',
                                    }}
                                />
                            )}

                            {/* Display or edit bio */}
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

                            {/* Modify bio buttons (edit, cancel, submit) */}
                            {user.username == userInfo.username && (
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

                        {/* Display user's messages */}
                        {userMessages !== undefined ? (
                            <Box sx={{ mt: 15 }}>
                                {userMessages.map((value, index) => {
                                    return (
                                        <Post
                                            post={value}
                                            key={`comments-${value.user.username}-${index}`}
                                            reactCallback={handleReaction}
                                            deleteCallback={handleDelete}
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
