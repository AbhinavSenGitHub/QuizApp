import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="home">
    <div>
       <h1>Welcome to the Quiz App!</h1>
      <p>Test your knowledge with our quiz. Choose the correct answers to the questions and see how well you score!</p>
      <p>Click the "Start Quiz" button below to begin.</p>
      </div>
      <Link to="/quiz">
        <button>Start Quiz</button>
      </Link>
    </div>
  )
}

export default Home
