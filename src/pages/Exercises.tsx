import React from 'react';
import { Alert, Box, CircularProgress, Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Exercise } from '../interfaces/index';
import { handledFetch } from '../services/utils';
import { serverRoutes } from '../services/routes';

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        boxShadow: 1,
        paddingLeft: 1,
        m: 1,
        borderRadius: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <h2>{exercise.name}</h2>
        <p>{exercise.abbreviation}</p>
        <p>{exercise.difficulty}</p>
        <p>{exercise.muscleGroup}</p>
        <p>{exercise.variations}</p>
      </Box>
      <Box>
        <p>{exercise.notes}</p>
      </Box>
    </Box>
  );
};

const Exercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExercises = async () => {
      const [response, error] = await handledFetch(serverRoutes.getAllExercises);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setError(data?.message);
        setLoading(false);
        return;
      }

      const exercises = await response.json();
      setLoading(false);
      setExercises(exercises);
    };
    fetchExercises();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity='error'>{error}</Alert>;
  }

  return (
    <div>
      <Container maxWidth='sm'>
        <Box my={4}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {exercises.map((exercise) => (
              <Grid key={exercise.name} item xs={12} sm={6} md={4}>
                <ExerciseCard exercise={exercise} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Exercises;
