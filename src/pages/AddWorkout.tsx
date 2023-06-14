import { Box, Button, Container, Grid, MenuItem, TextField, Typography } from '@mui/material';
import * as React from 'react';

enum DifficultyEnum {
  Easy = 'Easy',
  Moderate = 'Moderate',
  Hard = 'Hard',
}

const AddWorkout = () => {
  const [values, setValues] = React.useState({
    name: '',
    difficulty: '',
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log(values);
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ m: 2 }}>
        Add Workout
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2} direction="column">
          <Grid>
            <TextField
              type="text"
              name="name"
              value={values.name}
              onChange={onChangeInput}
              fullWidth
              label="Workout name"
              variant="outlined"
              autoFocus
            />
          </Grid>
          <Grid>
            <TextField
              name="difficulty"
              select
              id="difficulty-select"
              value={values.difficulty}
              label="Difficulty"
              helperText="Please select difficulty"
              onChange={onChangeInput}
              fullWidth
            >
              {Object.values(DifficultyEnum).map((difficulty) => (
                <MenuItem key={difficulty} value={difficulty}>
                  {difficulty}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid>
            <Button fullWidth variant="contained" type="submit">
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AddWorkout;
