import React, { ReactNode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import AddWorkout from './pages/AddWorkout';
import Error from './pages/Error';
import { isAuthenticated } from './services/auth';
import { Test } from './pages/Test';
import AddExercise from './pages/AddExercise';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route
        index
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />} />
      <Route
        path='history'
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route path='add-exercise' element={<AddExercise />} />
      <Route path='add-workout' element={<AddWorkout />} />
      <Route path='test' element={<Test />} />
      <Route path='error' element={<Error />} />
      <Route path='*' element={<p>There's nothing here: 404!</p>} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
