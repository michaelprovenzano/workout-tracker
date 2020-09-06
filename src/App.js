import React from 'react';
import { Route } from 'react-router-dom';
import './styles/bootstrap/bootstrap-grid.css';
import './App.scss';

import Navigation from './components/Navigation/Navigation.component';

// Pages
import Dashboard from './layouts/Dashboard/Dashboard.component';
import WorkoutPage from './layouts/WorkoutPage/WorkoutPage.component';
import ExercisePage from './layouts/ExercisePage/ExercisePage.component';
import SignupPage from './layouts/SignupPage/SignupPage.component';
import SigninPage from './layouts/SigninPage/SigninPage.component';
import MyProgramsPage from './layouts/MyProgramsPage/MyProgramsPage.component';
import MySchedulePage from './layouts/MySchedulePage/MySchedulePage.component';

import TestPage from './layouts/test/Test.component';

function App() {
  return (
    <div className='App'>
      <Navigation />
      <Route exact path='/test' component={TestPage} />
      <Route exact path='/my-programs' component={MyProgramsPage} />
      <Route exact path='/sign-up' component={SignupPage} />
      <Route exact path='/sign-in' component={SigninPage} />
      <Route exact path='/dashboard' component={Dashboard} />
      <Route exact path='/program-logs/:programLogId' component={MySchedulePage} />
      <Route exact path='/workout-logs/:workoutLogId' component={WorkoutPage} />
      <Route exact path='/workout-logs/:workoutLogId/:exerciseLogId' component={ExercisePage} />
    </div>
  );
}

export default App;
