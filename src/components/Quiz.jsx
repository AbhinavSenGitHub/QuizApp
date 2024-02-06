import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// shuffle incorrect answers with correct answer
const shuffleOptions = (correctAnswer, incorrectAnswers) => {
  const allOptions = [correctAnswer, ...incorrectAnswers];
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }
  return allOptions;
};
//to send score to the result component
let getScore = 0;

//quiz page 
const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  // timmer
  const quizDurationSeconds = 4; // (40 seconds)
  const [timeRemaining, setTimeRemaining] = useState(quizDurationSeconds);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=5&difficulty=medium');
      const data = await response.json();
      const quizData = data.results;

      if (Array.isArray(data.results) && data.results.length > 0) {
        setQuestions(quizData.map(question => ({
          ...question,
          options: shuffleOptions(question.correct_answer, question.incorrect_answers)
        })));
        setTimeRemaining(quizDurationSeconds);
      } else {
        console.error('Invalid data structure received from the API.');
      }
    } catch (error) {
      console.error('Error fetching data from the API:', error);
    }
  };

  const handleSubmit = () => {
    setTimeUp(true);
    setShowResult(true);
    getScore = calculateCorrectAnswers();
    console.log(getScore);

    // Force state update immediately
    setUserAnswers(prevAnswers => ({ ...prevAnswers }));
  };
  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeRemaining === 0) {
      setTimeUp(true);
      handleSubmit();
    } else if (!showResult) {
      const timer = setTimeout(() => {
        setTimeRemaining(prevTime => Math.max(prevTime - 1, 0));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, showResult]);

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    if (!timeUp) {
      setUserAnswers(prevAnswers => ({ ...prevAnswers, [questionIndex]: selectedAnswer }));
    }
  };

  const handlePlayAgain = () => {
    setUserAnswers({}); // Reset userAnswers
    setShowResult(false);
    setTimeUp(false);
    fetchQuestions();
  };

  const viewScore = () => {
    let resultUrl = `/result?score=${getScore}`;
    window.location.href = resultUrl;
  }
  const calculateCorrectAnswers = () => {
    return questions.reduce((correctCount, question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = question.correct_answer;
      return userAnswer === correctAnswer ? correctCount + 1 : correctCount;
    }, 0);
  };

  return (
    <div className="quiz-main">
      <h1 className="heading">Start Quiz</h1>
      <div className="timer">Time Remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
      <div className="question-section">
        {questions.map((question, index) => (
          <div key={index} className="question-div">
            <h2>{`Q ${index + 1}: ${question.question}`}</h2>
            <hr className="hr-link" />
            <div className="answer-div">
              <ul>
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      disabled={timeUp}
                      checked={userAnswers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                    />
                    <label>{option}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="button-section">
        <button className="quiz-button" onClick={handleSubmit}>SUBMIT</button>
        {(showResult && !(timeRemaining === 0)) &&
          (<button onClick={handlePlayAgain} className="quiz-button">PLAY AGAIN</button>)
        }
        <Link to="/">
          <button className="quiz-button">HOME</button>
        </Link>
        
        {showResult &&
          <button onClick={viewScore} className="quiz-button">VIEW SCORE</button>
        }
      </div>
      
      {timeUp && (
        <div>
          {timeRemaining === 0 ? <p>Time's up! Your response has been submitted</p> : <p>Your response has been submited</p>}

        </div>
      )}
    </div>
  );
}

export default Quiz;
