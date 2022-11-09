import React from 'react';
import './loginPage.css';
import logo from './jibJabLogo.png';

const LoginPage = () => {
    return (
        <div className="cover">
            <div className="signup">
                <h1>
                    New to <span style={{ color: '#D17A22' }}>JibJab?</span>
                </h1>
                <h2>
                    Join other young socialites on their journey to cleanse the
                    internet of old socialites
                </h2>
            </div>

            <button className="signUpBut" id="signup">
                {' '}
                Join us!
            </button>

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

                <button className="signUpBut" id="submit">
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
