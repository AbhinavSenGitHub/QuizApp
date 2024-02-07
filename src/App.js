import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';
import './App.css';

//scss
import "./styles/Home.scss"
import "./styles/Quiz.scss"
import "./styles/Result.scss"

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
