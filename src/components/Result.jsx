import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const score = new URLSearchParams(location.search).get('score');
  console.log("score: ", score)
  return (
    <div className="view-score">
      <h1>Your Score</h1>
      {score !== null ? (
        <p>{`You got ${score} out of 5 questions correct!`}</p>
      ) : (
        <p>Score not available.</p>
      )}
      <Link to="/">
        <button className="quiz-button">HOME</button>
      </Link>
      <Link to="/quiz">
        <button className="quiz-button">Play Again</button>
      </Link>

    </div>
  )
}

export default Result
