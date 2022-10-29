import React from 'react';
import './loginPage.css';
import logo from './jibJabLogo.png';
// import { Link as RouterLink } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div className="cover">
            <div className="loginBack">
                <img src={logo} className="logo" alt="jibJabLogo"></img>
                <div className="input">
                    <input
                        type="text"
                        placeholder="username"
                        className="username"
                    />
                    <input
                        type="password"
                        placeholder="password"
                        className="password"
                    />
                </div>
                <input type="submit" value="Login"></input>
            </div>
        </div>
    );
};

export default LoginPage;

/*
    <img src ={require('./jibJabLogo.png')} alt="jibjablogo"></img>
*/
