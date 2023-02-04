import React, { useState } from 'react';
import { Container, Paper, TextField, Button, InputAdornment, IconButton, Box, Link } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Visibility, VisibilityOff } from '@mui/icons-material';
// import ReCAPTCHA from 'react-google-recaptcha';
import { handleRegister } from '../services/auth';
import { ResponseData, responseSuccess } from '../interfaces/index';
import { useNavigate } from 'react-router-dom';
import { clientRoutes } from '../services/routes';

const TEST_RECAPTCHA_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

const Register = () => {
  const [values, setValues] = useState({
    email: '',
    username: '',
    password: '',
    passwordRepeat: '',
    showPassword: false,
    showPasswordRepeat: false,
  });
  const navigate = useNavigate();

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };
  const handleClickShowPassword = () => setValues({ ...values, showPassword: !values.showPassword });
  const handleClickShowPasswordRepeat = () => setValues({ ...values, showPasswordRepeat: !values.showPasswordRepeat });
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response: ResponseData = await handleRegister(values.email, values.password, values.username);
    console.log(response);
    if (response.status === responseSuccess) {
      navigate(clientRoutes.login);
    } else {
      navigate(clientRoutes.register);
    }
  };

  // const onChangeRecaptcha = (value: any) => {
  //   console.log('clicked', value);
  // };
  //disable submit button if email or password are empty

  console.log(values);
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
                    // helperText='Email field cannot be empty!'
                    // error
                  />
                </Grid>
                <Grid>
                  <TextField
                    type={values.showPassword ? 'text' : 'password'}
                    name='password'
                    value={values.password}
                    onChange={onChangeInput}
                    fullWidth
                    label='Enter your password'
                    placeholder='Password'
                    variant='outlined'
                    // helperText='Password field cannot be empty!'
                    // error
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
                  <TextField
                    type={values.showPasswordRepeat ? 'text' : 'password'}
                    name='passwordRepeat'
                    value={values.passwordRepeat}
                    onChange={onChangeInput}
                    fullWidth
                    label='Confirm your password'
                    placeholder='Password Confirm'
                    variant='outlined'
                    // helperText='Passwords do not match!'
                    // error
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPasswordRepeat}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPasswordRepeat ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    type='text'
                    name='username'
                    value={values.username}
                    onChange={onChangeInput}
                    fullWidth
                    label='Username'
                    placeholder='Username'
                    variant='outlined'
                    // helperText='Username field cannot be empty!'
                    // error
                  />
                </Grid>
                {/* <Grid>
                  <ReCAPTCHA sitekey={TEST_RECAPTCHA_KEY} onChange={onChangeRecaptcha} />
                </Grid> */}
                <Grid>
                  <Button fullWidth variant='contained' type='submit'>
                    Register
                  </Button>
                </Grid>
              </Grid>
              <Grid container justifyContent='flex-end'>
                <Grid>
                  <Link href='/login' variant='body2'>
                    Already have an account? Sign in
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

export default Register;
