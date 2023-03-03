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
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { handleLogin, setAccessJwtToken, setRefreshJwtToken } from '../services/auth';
import { LoginResponse, responseSuccess } from '../interfaces/index';
import { clientRoutes } from '../services/routes';
import { myLocalStorage } from '../services/utils';

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
    const response: LoginResponse = await handleLogin(values.email, values.password);

    if (response.error) {
      navigate(`/${clientRoutes.error}`); // TODO: fix this with better error handling
      return;
    }

    const { user, accessToken, refreshToken } = response.data;

    setStoredUser(user);
    setAccessJwtToken(accessToken);
    setRefreshJwtToken(refreshToken);

    if (response.status === responseSuccess) {
      navigate(clientRoutes.dashboard);
    } else {
      navigate(clientRoutes.login);
    }
  };

  //disable submit button if email or password are empty

  return (
    <div>
      <Container maxWidth='sm'>
        <Grid container spacing={2} direction='column' style={{ minHeight: '100vh' }} justifyContent='center'>
          <Paper elevation={2} sx={{ padding: 5 }}>
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
