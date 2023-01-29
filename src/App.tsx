import * as React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <h1>Character Academy</h1>
      <nav>
        <NavLink to='register'>Register</NavLink>
        <NavLink to='login'>Login</NavLink>
        <NavLink to='history'>History</NavLink>
        <NavLink to='add-workout'>Add Workout</NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
