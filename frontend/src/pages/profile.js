import { useParams, useNavigate } from 'react-router-dom';
import { Container, ThemeProvider, Typography } from '@mui/material';
import theme from './theme';
import { Header } from '../components/header';
import { useEffect, useContext, useState } from 'react';
import { makeGetRequest } from '../utils/requests';
import { AuthContext } from '../App';
import { invalidUserChecker } from '../utils/checkErrors';

export const Profile = () => {
    const { id } = useParams();
    const [auth, setAuth] = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState(null);
    const nav = useNavigate();

    // Get user info
    useEffect(() => {
        makeGetRequest(`/api/account/${id}`, {
            accesstoken: auth,
        })
            .then((data) => {
                setUserInfo(data);
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
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Container component='main' maxWidth='md'>
                {userInfo ? (
                    <>
                        <Typography
                            color={'#D17A22'}
                            fontSize={48}
                            fontWeight={'bold'}
                        >
                            {userInfo.first_name} {userInfo.last_name}
                        </Typography>
                        <Typography color={'#fff'} fontSize={20}>
                            {userInfo.bio}
                        </Typography>
                    </>
                ) : null}
            </Container>
        </ThemeProvider>
    );
};
