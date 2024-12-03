import React, { useState } from 'react';
import { Stack, Button, TextField, IconButton, InputAdornment, Typography, Box } from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { useNavigate } from 'react-router-dom';
import { getUsers, createUser } from '../network/mock'; 

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const users = await getUsers();
      const userExists = users.some(
        (user) => user.email === formData.email || user.username === formData.username
      );

      if (userExists) {
        setError('Username or email already exists.');
        return;
      }

      await createUser(formData);
      setSuccess(true);
      alert('Sign Up successful! Redirecting to login...');
      navigate('/login');
    } catch (err) {
      console.error('Error during sign up:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  const renderForm = (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 3 }}>
        Sign Up
      </Typography>

      <Stack spacing={3}>
        {/* Username */}
        <TextField
          name="username"
          label="Username"
          variant="outlined"
          fullWidth
          value={formData.username}
          onChange={handleChange}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '4px',
            input: { color: 'white' },
            label: { color: '#b3b3b3' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#b3b3b3' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'red' },
            },
          }}
        />

        {/* Email */}
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '4px',
            input: { color: 'white' },
            label: { color: '#b3b3b3' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#b3b3b3' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'red' },
            },
          }}
        />

        {/* Password */}
        <TextField
          name="password"
          label="Create password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: 'white' }}
                >
                  {showPassword ? <VisibilityRoundedIcon /> : <VisibilityOffRoundedIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '4px',
            input: { color: 'white' },
            label: { color: '#b3b3b3' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#b3b3b3' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'red' },
            },
          }}
        />
      </Stack>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {success && (
        <Typography color="success" sx={{ mt: 2 }}>
          Sign up successful! Redirecting...
        </Typography>
      )}

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{
          mt: 3,
          backgroundColor: '#e50914',
          color: 'white',
          fontWeight: 'bold',
          '&:hover': { backgroundColor: '#f6121d' },
        }}
      >
        Sign Up
      </Button>

      <Typography
        variant="body2"
        align="center"
        sx={{
          color: 'white',
          mt: 2,
        }}
      >
        OR
      </Typography>

      <Button
        fullWidth
        size="large"
        variant="contained"
        sx={{
          mt: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          color: 'black',
          fontWeight: 'bold',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
        }}
        onClick={() => navigate('/login')}
      >
        Sign In
      </Button>
    </form>
  );

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: `url(https://assets.nflxext.com/ffe/siteui/vlv3/f272782d-cf96-4988-a675-6db2afd165e0/web/KZ-en-20241008-TRIFECTA-perspective_beae9240-d29b-416c-a73d-e6757b41d714_large.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          padding: 4,
          borderRadius: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {renderForm}
      </Box>
    </Box>
  );
}
