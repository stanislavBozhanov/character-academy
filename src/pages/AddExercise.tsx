import * as React from 'react';
import { Container, Typography, Box, TextField, Button, MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { handledFetch } from '../services/utils';
import { clientRoutes, serverRoutes } from '../services/routes';
import { useNavigate } from 'react-router-dom';

enum DifficultyEnum {
  Begginer = 'Begginer',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

const AddExercise = () => {
  const [values, setValues] = React.useState({
    name: '',
    abbreviation: '',
    difficulty: '',
    muscleGroup: '',
    variation: '',
    notes: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const [response, error] = await handledFetch(serverRoutes.addExercise, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(values),
    });

    if (error) {
      console.error(error);
      navigate(`/${clientRoutes.error}`); // TODO: fix this with better error handling
      return;
    }

    if (!response.ok) {
      const data = await response.json();
      console.log(data?.message);
    }

    navigate(`/${clientRoutes.exercises}`);
  };

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
              name='abbreviation'
              value={values.abbreviation}
              onChange={onChangeInput}
              fullWidth
              label='Exercise abbreviation'
              variant='outlined'
            />
          </Grid>
          <Grid>
            <TextField
              name='difficulty'
              select
              id='difficulty-select'
              value={values.difficulty}
              label='Difficulty'
              helperText='Please select difficulty'
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
