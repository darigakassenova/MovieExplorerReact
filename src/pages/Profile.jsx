import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../network/mock.js';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  Paper,
  Avatar,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login'); 
    } else {
      setUser(userData); 
    }
  }, [navigate]);

  const handlePasswordChange = async () => {
    if (oldPassword !== user.password) {
      setError('Old password is incorrect.');
      setSuccess('');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      setSuccess('');
      return;
    }

    try {
      const updatedUser = { ...user, password: newPassword };
      await updateUser(user.id, updatedUser); 
      localStorage.setItem('user', JSON.stringify(updatedUser)); 
      setUser(updatedUser);
      setSuccess('Password successfully updated.');
      setError('');
    } catch (error) {
      setError('Failed to update password. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 600,
          padding: 4,
          borderRadius: 2,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}>
          Profile
        </Typography>
        <Avatar sx={{ bgcolor: '#ffb700' }}>N</Avatar>
        {user && (
          <Box>
            {/* User Info */}
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              <strong>Email:</strong> {user.email}
            </Typography>

            {/* Change Password */}
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
              Change Password
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Old Password"
                type={showPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              <TextField
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              <TextField
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordChange}
                fullWidth
                sx={{ fontWeight: 'bold', padding: '10px' }}
              >
                Update Password
              </Button>
            </Stack>

            {error && (
              <Typography
                variant="body1"
                color="error"
                sx={{ marginTop: 2, textAlign: 'center' }}
              >
                {error}
              </Typography>
            )}
            {success && (
              <Typography
                variant="body1"
                color="success.main"
                sx={{ marginTop: 2, textAlign: 'center' }}
              >
                {success}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;
