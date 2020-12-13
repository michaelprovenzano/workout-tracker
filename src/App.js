import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import './styles/bootstrap/bootstrap-grid.css';
import './App.scss';

import Navigation from './components/Navigation/Navigation.component';

// Pages
import Dashboard from './pages/Dashboard/Dashboard.component';
import WorkoutPage from './pages/WorkoutPage/WorkoutPage.component';
import ExercisePage from './pages/ExercisePage/ExercisePage.component';
import SignupPage from './pages/SignupPage/SignupPage.component';
import SigninPage from './pages/SigninPage/SigninPage.component';
import MyProgramsPage from './pages/MyProgramsPage/MyProgramsPage.component';
import ProgramsPage from './pages/ProgramsPage/ProgramsPage.component';
import MySchedulePage from './pages/MySchedulePage/MySchedulePage.component';

import TestPage from './pages/_TestPage/TestPage.component';

function App({ user }) {
  return (
    <div className='App'>
      <Navigation />
      <Route exact path='/test' component={TestPage} />
      <Route exact path='/sign-up' component={SignupPage} />
      <Route exact path='/sign-in' component={SigninPage} />
      {!user.token ? (
        <Redirect to='/sign-in' />
      ) : (
        <Fragment>
          <Route exact path='/my-programs' component={MyProgramsPage} />
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/programs' component={ProgramsPage} />
          <Route exact path='/program-logs/:programLogId' component={MySchedulePage} />
          <Route exact path='/workout-logs/:workoutLogId' component={WorkoutPage} />
          <Route exact path='/workout-logs/:workoutLogId/:exerciseLogId' component={ExercisePage} />
        </Fragment>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, null)(App);
