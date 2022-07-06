import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExercisePage from './pages/AddExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import { useState } from 'react';
import Navigation from './components/Navigation';

function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState();

  return (
    <div className="App">
      <div>
        <header className="App-header">
          <h1>Exercise Tracker</h1>
        </header>
      </div>
      <Router>
        <div className="App-header">
          <Navigation />
          <Route path="/" exact>
            <HomePage setExerciseToEdit={setExerciseToEdit} />
          </Route>
          <Route path="/add-exercise">
            <AddExercisePage />
          </Route>
          <Route path="/edit-exercise">
            <EditExercisePage exerciseToEdit={exerciseToEdit} />
          </Route>
          </div>
      </Router>
      <div>
        <footer className="App-footer">
          <h1>© 2022 Carleton Foster</h1>
        </footer>
      </div>
    </div>
  );
}

export default App;