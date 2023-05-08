export type httpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type exerciseDifficulty = 'Begginer' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Exercise {
  name: string;
  abbreviation: string;
  difficulty: exerciseDifficulty;
  muscleGroup: string;
  variations: string;
  notes: string;
}
