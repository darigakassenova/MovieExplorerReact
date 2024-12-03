import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AppBar, Box, Toolbar, Typography, Menu, MenuItem  } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';

import SearchBar from './SearchBar';

import i18next from '../i18n';
import '../index.css';

function Header() {
    const [language, setLanguage] = useState('en');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsAuthenticated(!!user);
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setAnchorEl(null);
        navigate('/');
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    const watchlist = () => {
        navigate('/watchlist');
        setAnchorEl(null);
    };

    const seeProfile = () => {
        navigate('/profile');
        setAnchorEl(null);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        setLanguage(selectedLanguage);
        i18next.changeLanguage(selectedLanguage);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ backgroundColor: '#000000' }}>
                <Toolbar>
                    <Typography
                        variant="p"
                        component="a"
                        href="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: '#ffb700',
                            fontWeight: 'bold',
                        }}
                    >
                        Movie Explorer
                    </Typography>
                    <SearchBar onMovieSelect={(movie) => navigate(`/movie/${movie.id}`)} />
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="select"
                        style={{
                            marginLeft: '10px',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            backgroundColor: 'transparent',
                            border: '1px solid #ffb700',
                            color: '#ffb700',
                            fontWeight: 'bold',
                        }}
                    >
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                    </select>
                    {isAuthenticated ? (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={seeProfile}>Profile</MenuItem>
                                <MenuItem onClick={watchlist}>Watchlist</MenuItem>
                                <MenuItem onClick={handleSignOut}>{t('sign_out')}</MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <button
                            onClick={handleSignIn}
                            className="button"
                            style={{
                                marginLeft: '10px',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                backgroundColor: 'transparent',
                                color: '#ffb700',
                                fontWeight: 'bold',
                                border: '1px solid #ffb700',
                            }}
                        >
                            {t('sign_in')}
                        </button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;
