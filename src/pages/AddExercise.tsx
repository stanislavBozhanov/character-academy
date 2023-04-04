import * as React from 'react';
import { Container, FormControl, Typography, Box, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const AddExercise = () => {
  const [values, setValues] = React.useState({
    name: '',
    abbreviation: '',
    difficulty: '',
    equipment: '',
    muscleGroup: '',
    instructions: '',
    variation: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {};
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  return (
    <Container maxWidth='sm'>
      <Typography variant='h4' component='h1' gutterBottom align='center' sx={{ m: 2 }}>
        Add Exercise
      </Typography>
      <Box component='form' onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2} direction='column'>
          <Grid>
            <TextField
              type='text'
              name='name'
              value={values.name}
              onChange={onChangeInput}
              fullWidth
              label='Exercise name'
              variant='outlined'
              autoFocus
            />
          </Grid>
          <Grid>
            <TextField
              type='text'
              name='difficulty'
              value={values.difficulty}
              onChange={onChangeInput}
              fullWidth
              label='Difficulty'
              variant='outlined'
            />
          </Grid>
          <Grid>
            <TextField
              type='text'
              name='equipment'
              value={values.equipment}
              onChange={onChangeInput}
              fullWidth
              label='Equipment'
              variant='outlined'
            />
          </Grid>
          <Grid>
            <TextField
              type='text'
              name='muscleGroup'
              value={values.muscleGroup}
              onChange={onChangeInput}
              fullWidth
              label='Muscle Group'
              variant='outlined'
            />
          </Grid>
          <Grid>
            <TextField
              type='text'
              name='instructions'
              value={values.instructions}
              onChange={onChangeInput}
              fullWidth
              label='Instructions'
              variant='outlined'
            />
          </Grid>
          <Grid>
            <TextField
              type='text'
              name='variation'
              value={values.variation}
              onChange={onChangeInput}
              fullWidth
              label='Variation'
              variant='outlined'
            />
          </Grid>
          <Grid>
            <TextField
              type='text'
              name='notes'
              value={values.notes}
              onChange={onChangeInput}
              fullWidth
              label='Notes'
              variant='outlined'
            />
          </Grid>
          <Grid>
            <Button fullWidth variant='contained' type='submit'>
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AddExercise;
