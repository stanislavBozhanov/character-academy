import React from 'react';
import { redirect } from 'react-router-dom';
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
import { handleLogin } from '../services/auth';
import { ResponseData, responseSuccess } from '../interfaces/index';
import { clientRoutes } from '../services/routes';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response: ResponseData = await handleLogin(email, password);
    console.log(response);
    console.log(sessionStorage);
    if (response.status === responseSuccess) {
      redirect(clientRoutes.dashboard);
    } else {
      redirect(clientRoutes.login);
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
