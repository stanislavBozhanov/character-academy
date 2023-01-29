import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import AddWorkout from './pages/AddWorkout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<Dashboard />}></Route>
      <Route path='register' element={<Register />}></Route>
      <Route path='login' element={<Login />}></Route>
      <Route path='history' element={<History />}></Route>
      <Route path='add-workout' element={<AddWorkout />}></Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
