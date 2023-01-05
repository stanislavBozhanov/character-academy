import React from 'react';
import { Container, Paper, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <Container maxWidth='sm'>
        <Grid container spacing={2} direction='column' style={{ minHeight: '100vh'}} justifyContent='center'>
          <Paper elevation={2} sx={{ padding: 5}}>
            <Grid container spacing={2} direction='column'>
              <Grid>
                <TextField type='email' fullWidth label='Enter your email' placeholder='Email address' variant='outlined'/>
              </Grid>
              <Grid>
                <TextField
                  type={showPassword ? 'text': 'password'}
                  fullWidth label='Enter your password'
                  placeholder='Password'
                  variant='outlined'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid>
                <Button fullWidth variant='contained'>Sign In</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Container>
    </div>
  )
};

export default Login;
