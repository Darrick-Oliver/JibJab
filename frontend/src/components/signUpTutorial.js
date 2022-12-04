import React, { useContext, useState, useEffect } from 'react';
import { Button, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './signUpTutorial.css';
import { usingMobile } from '../hooks/windowDimensions';
import { makePostRequest } from '../utils/requests';
import { host } from '../utils/host';
import { AuthContext } from '../App';

const TRANSITION_TIMEOUT_SEC = 0.6;

const steps = {
    INTRO: 0,
    NAME: 1,
    USERNAME: 2,
    EMAIL: 3,
    PASSWORD: 4,
};

export const SignUpTutorial = () => {
    const [visible, setVisible] = useState(true);
    const [transitionInProgress, setTransitionInProgress] = useState(false);
    const [step, setStep] = useState(steps.INTRO);
    const [error, setError] = useState();
    const nav = useNavigate();
    const mobile = usingMobile();
    const { setAuth } = useContext(AuthContext);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleNext = async () => {
        setError();
        if (
            (step >= steps.NAME && (!firstName || !lastName)) ||
            (step >= steps.USERNAME && !username) ||
            (step >= steps.EMAIL && !email) ||
            (step >= steps.PASSWORD && !password)
        ) {
            setError('Cannot include empty fields');
            return;
        }

        if (step == steps.USERNAME) {
            if (username.length <= 3) {
                setError('Username must be longer than 3 characters');
                return;
            }

            const res = await makePostRequest(`${host}/api/account/available`, {
                username: username,
            });
            if (res.error || res.data.username == false) {
                setError(res.errorMessage || 'Username is unavailable');
                return;
            }
        }

        if (step == steps.EMAIL) {
            const res = await makePostRequest(`${host}/api/account/available`, {
                email: email,
            });
            if (res.error || res.data.email == false) {
                setError(res.errorMessage || 'Email is already in use');
                return;
            }
        }

        if (step == steps.PASSWORD) {
            const user = {
                first_name: firstName,
                last_name: lastName,
                username,
                email,
                password,
            };
            try {
                const res = await makePostRequest(
                    `${host}/api/account/register`,
                    user
                );
                setAuth(res.data.access_token);
                localStorage.setItem('jwt', res.data.access_token);
                nav('/');
                return;
            } catch (err) {
                setError(err.errorMessage);
                return;
            }
        }

        setVisible(false);
    };

    useEffect(() => {
        if (!visible) {
            setError(null);
            setTransitionInProgress(true);
            setTimeout(() => {
                setTransitionInProgress(false);
            }, TRANSITION_TIMEOUT_SEC * 1000);
        }
    }, [visible]);

    useEffect(() => {
        if (!transitionInProgress && !visible) {
            // Change step
            setStep(step + 1);
            setVisible(true);
        }
    }, [transitionInProgress]);

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
                className={visible ? 'fade-in' : 'fade-out'}
            >
                {step == steps.INTRO ? (
                    <>
                        <Typography
                            color='#fff'
                            fontWeight='bold'
                            fontSize={32}
                            textAlign='center'
                        >
                            New to{' '}
                            <span style={{ color: '#D17A22' }}>JibJab</span>?
                        </Typography>
                        <Typography
                            sx={{ color: '#fff' }}
                            fontSize={20}
                            fontWeight='light'
                            textAlign='center'
                        >
                            Join now to build connections with other young
                            socialites around you, and engage with others in a
                            fun environment
                        </Typography>
                    </>
                ) : step == steps.NAME ? (
                    <>
                        <Typography
                            sx={{ color: '#fff' }}
                            fontSize={20}
                            fontWeight='light'
                            textAlign='center'
                        >
                            Start by entering your{' '}
                            <span
                                style={{ color: '#D17A22', fontWeight: 'bold' }}
                            >
                                name
                            </span>
                        </Typography>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: mobile ? 'column' : 'row',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: 10,
                                borderRadius: 10,
                                marginTop: 10,
                                minWidth: mobile && 300,
                            }}
                        >
                            <TextField
                                value={firstName}
                                sx={{ m: 1 }}
                                required
                                fullWidth
                                id='firstName'
                                label='First name'
                                name='firstName'
                                autoComplete='given-name'
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                value={lastName}
                                sx={{ m: 1 }}
                                required
                                fullWidth
                                id='lastName'
                                label='Last name'
                                name='lastName'
                                autoComplete='family-name'
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </>
                ) : step == steps.USERNAME ? (
                    <>
                        <Typography
                            sx={{ color: '#fff' }}
                            fontSize={20}
                            fontWeight='light'
                            textAlign='center'
                        >
                            Next, create a{' '}
                            <span
                                style={{ color: '#D17A22', fontWeight: 'bold' }}
                            >
                                username
                            </span>
                        </Typography>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: 10,
                                borderRadius: 10,
                                marginTop: 10,
                                minWidth: mobile ? 300 : 400,
                            }}
                        >
                            <TextField
                                value={username}
                                sx={{ m: 1 }}
                                required
                                fullWidth
                                id='username'
                                label='Username'
                                name='username'
                                autoComplete='username'
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </>
                ) : step == steps.EMAIL ? (
                    <>
                        <Typography
                            sx={{ color: '#fff' }}
                            fontSize={20}
                            fontWeight='light'
                            textAlign='center'
                        >
                            Next, enter your{' '}
                            <span
                                style={{ color: '#D17A22', fontWeight: 'bold' }}
                            >
                                email
                            </span>
                        </Typography>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: 10,
                                borderRadius: 10,
                                marginTop: 10,
                                minWidth: mobile ? 300 : 400,
                            }}
                        >
                            <TextField
                                value={email}
                                sx={{ m: 1 }}
                                required
                                fullWidth
                                id='email'
                                label='Email'
                                name='email'
                                autoComplete='email'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </>
                ) : step == steps.PASSWORD ? (
                    <>
                        <Typography
                            sx={{ color: '#fff' }}
                            fontSize={20}
                            fontWeight='light'
                            textAlign='center'
                        >
                            Finally, create a{' '}
                            <span
                                style={{ color: '#D17A22', fontWeight: 'bold' }}
                            >
                                password
                            </span>
                        </Typography>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: 10,
                                borderRadius: 10,
                                marginTop: 10,
                                minWidth: mobile ? 300 : 400,
                            }}
                        >
                            <TextField
                                value={password}
                                sx={{ m: 1 }}
                                required
                                fullWidth
                                name='password'
                                label='Password'
                                type='password'
                                id='password'
                                autoComplete='new-password'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : null}
                {error && (
                    <Typography sx={{ mt: 2, color: 'red' }}>
                        Error: {error}
                    </Typography>
                )}
                <Button
                    variant='secondary'
                    sx={{
                        mt: 2,
                        p: 2,
                        width: 300,
                    }}
                    onClick={() => handleNext()}
                >
                    <Typography variant='h1' fontSize={24} color={'#D17A22'}>
                        {step == steps.INTRO
                            ? 'Sign up'
                            : step == steps.NAME
                            ? 'Next'
                            : step == steps.USERNAME
                            ? 'Next'
                            : step == steps.EMAIL
                            ? 'Next'
                            : 'Submit'}
                    </Typography>
                </Button>
            </div>
        </>
    );
};
