import { Grid } from '@mui/material';
import { useContext, useState } from 'react';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';

import LogoutIcon from '../assets/logout.svg';
import LogoutClosedIcon from '../assets/logout_closed.svg';
import ProfileIcon from '../assets/empty_profile.svg';
import ProfileFilledIcon from '../assets/filled_profile.svg';

export const Header = () => {
    const [hoverLogout, setHoverLogout] = useState(false);
    const [hoverProfile, setHoverProfile] = useState(false);
    const [auth, setAuth, user] = useContext(AuthContext);
    const nav = useNavigate();

    const handleLogout = () => {
        setAuth(null);
        localStorage.removeItem('jwt');
        nav('/');
    };

    const handleProfile = () => {
        nav(`/profile/${user.username}`);
    };

    return (
        <Grid container justifyContent='flex-end'>
            <div
                onClick={handleProfile}
                style={{
                    paddingRight: 10,
                    paddingTop: 10,
                    cursor: 'pointer',
                }}
                onMouseOver={() => setHoverProfile(true)}
                onMouseLeave={() => setHoverProfile(false)}
            >
                {!hoverProfile ? (
                    <img src={ProfileIcon} alt='Profile' />
                ) : (
                    <img src={ProfileFilledIcon} alt='Profile' />
                )}
            </div>
            <div
                onClick={handleLogout}
                style={{
                    paddingRight: 10,
                    paddingTop: 10,
                    cursor: 'pointer',
                }}
                onMouseOver={() => setHoverLogout(true)}
                onMouseLeave={() => setHoverLogout(false)}
            >
                {!hoverLogout ? (
                    <img src={LogoutClosedIcon} alt='Logout' />
                ) : (
                    <img src={LogoutIcon} alt='Logout' />
                )}
            </div>
        </Grid>
    );
};
