import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
  FormControlLabel,
  Checkbox,
  Link,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setAccessJwtToken, setRefreshJwtToken } from '../services/auth';
import { clientRoutes, serverRoutes } from '../services/routes';
import { handledFetch, myLocalStorage } from '../services/utils';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
  });
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = myLocalStorage('user');

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };
  const handleClickShowPassword = () => setValues({ ...values, showPassword: !values.showPassword });
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const [response, error] = await handledFetch(serverRoutes.login, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ email: values.email, password: values.password }),
    });

    if (error) {
      console.error(error);
      navigate(`/${clientRoutes.error}`); // TODO: fix this with better error handling
      return;
    }

    if (!response.ok) {
      const data = await response.json();
      console.log(data?.message);
      navigate(`/${clientRoutes.login}`);
      return;
    }

    const { user, accessToken, refreshToken } = await response.json();

    if (!user || !accessToken || !refreshToken) {
      console.error('missing data from sever');
      navigate(`/${clientRoutes.error}`);
      return;
    }

    setStoredUser(user);
    setAccessJwtToken(accessToken);
    setRefreshJwtToken(refreshToken);
    navigate(clientRoutes.dashboard);
  };

  //disable submit button if email or password are empty

  return (
    <div>
      <Container maxWidth='sm'>
        <Grid container spacing={2} direction='column' style={{ minHeight: '100vh' }} justifyContent='center'>
          <Paper elevation={2} sx={{ padding: 5 }}>
            <Typography variant='h4' component='h1' gutterBottom align='center'>
              Login
            </Typography>
            <Box component='form' onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2} direction='column'>
                <Grid>
                  <TextField
                    type='email'
                    name='email'
                    value={values.email}
                    onChange={onChangeInput}
                    fullWidth
                    label='Enter your email'
                    placeholder='Email address'
                    variant='outlined'
                    autoFocus
                    autoComplete='email'
                  />
                </Grid>
                <Grid>
                  <TextField
                    name='password'
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={onChangeInput}
                    fullWidth
                    label='Enter your password'
                    placeholder='Password'
                    variant='outlined'
                    autoComplete='current-password'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid>
                  <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
                </Grid>
                <Grid>
                  <Button fullWidth variant='contained' type='submit'>
                    Sign In
                  </Button>
                </Grid>
              </Grid>
              <Grid container justifyContent='space-between'>
                <Grid>
                  <Link href='#' variant='body2'>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid>
                  <Link href='/register' variant='body2'>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Container>
    </div>
  );
};

export default Login;
