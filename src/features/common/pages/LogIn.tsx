import React, { useState } from 'react';
import { Box, Button, Typography, Paper, TextField, Alert, CircularProgress } from '@mui/material';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { tokenAtom, userAtom } from '../../../core/store/authAtom';
import { loginRequest } from '../../../core/server/api/appRequests';

const useStyles = makeStyles()((theme) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
    background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
  },
  paper: {
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    borderRadius: Number(theme.shape.borderRadius) * 2,
    background: 'rgba(18, 24, 38, 0.7)',
    backdropFilter: 'blur(12px)',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
    fontSize: '1.1rem',
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  }
}));

const extractErrorMessage = (err: unknown): string => {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
  ) {
    return (err as { response?: { data?: { message?: string } } }).response?.data?.message as string;
  }

  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as { message?: string }).message === 'string'
  ) {
    return (err as { message?: string }).message as string;
  }

  return 'Error logging in. Please try again.';
};

export const LogIn: React.FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);

  const [username, setUsername] = useState('1234567@idf.il');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginRequest({ username, password });
      
      // Store token and user data in Jotai atoms
      setToken(response.token);
      setUser(response.user);
      
      // Navigate to operational screen
      navigate('/');
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={`${classes.container} fade-in`} dir="rtl">
      <Paper elevation={0} className={classes.paper}>
        <Typography component="h1" variant="h4" className={classes.title}>
          ברוכים הבאים
        </Typography>
        <Typography variant="body1" className={classes.subtitle}>
          התחבר למרכז הבקרה
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }} variant="outlined">
            {error}
          </Alert>
        )}

        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="שם משתמש"
            name="username"
            autoComplete="username"
            autoFocus
            slotProps={{ htmlInput: { maxLength: 25 } }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="סיסמה"
            type="password"
            id="password"
            autoComplete="current-password"
            slotProps={{ htmlInput: { maxLength: 25 } }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'inherit' }} />
            ) : (
              'התחבר'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
