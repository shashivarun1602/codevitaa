import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Earn.css';
import '../GlobalStyles.css';
import ApiService from '../services/api';

const Earn = () => {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showReview, setShowReview] = useState(false);

  // Quiz data from your images
  const quizzes = [
    {
      id: 1,
      title: "Python Fundamentals",
      coins: 25,
      difficulty: "Medium",
      questions: [
        {
          question: "In Python, self",
          options: { A: "cls", B: "this", C: "class", D: "object" },
          correct: "B"
        },
        {
          question: "What is the time complexity O(1)?",
          options: { A: "O(log n)", B: "O(n)", C: "O(n log n)", D: "constant" },
          correct: "A"
        },
        {
          question: "Which built-in data structure is mutable?",
          options: { A: "dict", B: "frozenset", C: "tuple", D: "string" },
          correct: "B"
        },
        {
          question: "A decorator __init__ makes a method:",
          options: { A: "__private", B: "Smagics", C: "__init__", D: "public" },
          correct: "A"
        },
        {
          question: "Which statement about class A(abstract) is true?",
          options: { A: "concrete", B: "interface", C: "abstract", D: "final" },
          correct: "A"
        }
      ]
    },
    {
      id: 2,
      title: "Async Programming",
      coins: 30,
      difficulty: "Hard",
      questions: [
        {
          question: "Which library provides async/await support?",
          options: { A: "asyncio", B: "concurrent", C: "threading", D: "multiprocessing" },
          correct: "B"
        },
        {
          question: "A coroutine is created using:",
          options: { A: "yield from", B: "await", C: "async def", D: "spawn" },
          correct: "B"
        },
        {
          question: "The GIL in Python affects:",
          options: { A: "CPU-bound", B: "I/O-bound", C: "Multiprocessing", D: "Asyncio tasks" },
          correct: "A"
        },
        {
          question: "Which method is used to combine async results?",
          options: { A: "merge", B: "concat", C: "join", D: "stack" },
          correct: "B"
        },
        {
          question: "asyncio.run() is used for:",
          options: { A: "Inside coroutines", B: "In every async function", C: "Entry point", D: "Callbacks" },
          correct: "B"
        }
      ]
    },
    {
      id: 3,
      title: "Data Structures & Algorithms",
      coins: 35,
      difficulty: "Hard",
      questions: [
        {
          question: "The worst-case time complexity of quicksort is:",
          options: { A: "O(n)", B: "O(n log n)", C: "O(n²)", D: "O(log n)" },
          correct: "C"
        },
        {
          question: "Which data structure is LIFO?",
          options: { A: "Queue", B: "Stack", C: "Binary heap", D: "Linked list" },
          correct: "B"
        },
        {
          question: "In Python, a signed integer has:",
          options: { A: "unsigned int", B: "double", C: "unsigned long", D: "arbitrary precision" },
          correct: "B"
        },
        {
          question: "The best sorting algorithm for large datasets:",
          options: { A: "Greedy algorithm", B: "Dynamic programming", C: "Divide & conquer", D: "Backtracking" },
          correct: "B"
        },
        {
          question: "A hash table uses:",
          options: { A: "Linear probing", B: "Symmetric hashing", C: "Hash-based indexing", D: "Binary search" },
          correct: "B"
        }
      ]
    },
    {
      id: 4,
      title: "Advanced Python",
      coins: 40,
      difficulty: "Expert",
      questions: [
        {
          question: "What is the result of: <class 'int'> + <class 'float'>?",
          options: { A: "<class 'int'>", B: "<class 'float'>", C: "<class 'str'>", D: "<class 'complex'>" },
          correct: "B"
        },
        {
          question: "Which keyword is used for creating anonymous functions?",
          options: { A: "def", B: "func", C: "lambda", D: "create" },
          correct: "A"
        },
        {
          question: "my_list = [1, 2, 3, 4] - what does my_list[::2] return?",
          options: { A: "[1, 2]", B: "[2, 4]", C: "[1, 3]", D: "Error" },
          correct: "B"
        },
        {
          question: "How do you create a list comprehension with condition?",
          options: { A: "list.add(x)", B: "list.insert()", C: "list.append()", D: "list.push(x)" },
          correct: "C"
        },
        {
          question: "Which of the following is falsy in Python?",
          options: { A: "[]", B: "TRUE", C: "FALSE", D: "None" },
          correct: "C"
        }
      ]
    }
  ];

  const tasks = [
    { id: 1, type: "Task", title: "Share on Social Media", coins: 10, difficulty: "Easy", description: "Share Vitacoin on your social media" },
    { id: 2, type: "Task", title: "Invite 3 Friends", coins: 50, difficulty: "Medium", description: "Invite 3 friends to join Vitacoin" },
    { id: 3, type: "Task", title: "Complete Profile", coins: 15, difficulty: "Easy", description: "Fill out your complete profile information" },
    { id: 4, type: "Task", title: "Daily Check-in Streak", coins: 25, difficulty: "Medium", description: "Maintain a 7-day check-in streak" },
  ];

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
    setShowReview(false);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const submitAnswer = () => {
    const isCorrect = selectedAnswer === activeQuiz.questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Store user's answer for review
    const newAnswer = {
      questionIndex: currentQuestion,
      question: activeQuiz.questions[currentQuestion].question,
      userAnswer: selectedAnswer,
      correctAnswer: activeQuiz.questions[currentQuestion].correct,
      options: activeQuiz.questions[currentQuestion].options,
      isCorrect: isCorrect
    };
    setUserAnswers([...userAnswers, newAnswer]);

    if (currentQuestion + 1 < activeQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    const percentage = (score / activeQuiz.questions.length) * 100;
    const earnedCoins = Math.floor((score / activeQuiz.questions.length) * activeQuiz.coins);
    
    try {
      // Record quiz completion transaction
      const response = await ApiService.earnCoins(
        user._id,
        earnedCoins,
        `Quiz completed: ${activeQuiz.title} (${score}/${activeQuiz.questions.length})`,
        'quiz'
      );
      
      if (response.success) {
        await refreshUser(); // Update global user state
        showSuccess(`Quiz completed! You earned ${earnedCoins} coins! New balance: ${response.newBalance}`);
      }
    } catch (error) {
      console.error('Error recording quiz completion:', error);
      showError('Failed to record quiz completion. Please try again.');
    }
    
    setActiveQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setQuizCompleted(false);
    setUserAnswers([]);
    setShowReview(false);
  };

  const completeTask = async (task) => {
    if (!user?._id) return;
    
    try {
      // Record task completion transaction
      const response = await ApiService.earnCoins(
        user._id,
        task.coins,
        `Task completed: ${task.title}`,
        'task'
      );
      
      if (response.success) {
        await refreshUser(); // Update global user state
        showSuccess(`Task completed! You earned ${task.coins} coins! New balance: ${response.newBalance}`);
      }
    } catch (error) {
      console.error('Error recording task completion:', error);
      showError('Failed to record task completion. Please try again.');
    }
  };


  // Show quiz review with correct/incorrect answers
  if (showReview) {
    return (
      <div className="page-container">
        <div className="quiz-review">
          <div className="review-header">
            <h2>Quiz Review - {activeQuiz.title}</h2>
            <div className="review-score">
              Final Score: {score}/{activeQuiz.questions.length} ({((score / activeQuiz.questions.length) * 100).toFixed(0)}%)
            </div>
          </div>
          
          <div className="review-content">
            {userAnswers.map((answer, index) => (
              <div key={index} className={`review-question ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="question-header">
                  <span className="question-number">Question {index + 1}</span>
                  <span className={`result-badge ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                    {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                
                <h4 className="review-question-text">{answer.question}</h4>
                
                <div className="answer-options">
                  {Object.entries(answer.options).map(([key, value]) => (
                    <div 
                      key={key}
                      className={`review-option ${
                        key === answer.correctAnswer ? 'correct-answer' : 
                        key === answer.userAnswer && !answer.isCorrect ? 'wrong-answer' : ''
                      }`}
                    >
                      <span className="option-letter">{key}</span>
                      <span className="option-text">{value}</span>
                      {key === answer.correctAnswer && <span className="correct-indicator">✓</span>}
                      {key === answer.userAnswer && !answer.isCorrect && <span className="wrong-indicator">✗</span>}
                    </div>
                  ))}
                </div>
                
                <div className="answer-explanation">
                  {answer.isCorrect ? (
                    <span className="correct-text">Great job! You selected the correct answer.</span>
                  ) : (
                    <span className="incorrect-text">
                      You selected <strong>{answer.userAnswer}</strong>, but the correct answer was <strong>{answer.correctAnswer}</strong>.
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="review-actions">
            <button className="btn-primary" onClick={resetQuiz}>
              Back to Earn Center
            </button>
            <button className="btn-secondary" onClick={() => startQuiz(activeQuiz)}>
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeQuiz && !quizCompleted) {
    const question = activeQuiz.questions[currentQuestion];
    return (
      <div className="page-container">
        <div className="quiz-container">
          <div className="quiz-header">
            <h2>{activeQuiz.title}</h2>
            <div className="quiz-progress">
              Question {currentQuestion + 1} of {activeQuiz.questions.length}
            </div>
            <button className="quiz-exit" onClick={resetQuiz}>✕</button>
          </div>
          
          <div className="quiz-content">
            <h3 className="quiz-question">{question.question}</h3>
            
            <div className="quiz-options">
              {Object.entries(question.options).map(([key, value]) => (
                <button
                  key={key}
                  className={`quiz-option ${selectedAnswer === key ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(key)}
                >
                  <span className="option-letter">{key}</span>
                  <span className="option-text">{value}</span>
                </button>
              ))}
            </div>
            
            <button 
              className="quiz-submit"
              onClick={submitAnswer}
              disabled={!selectedAnswer}
            >
              {currentQuestion + 1 === activeQuiz.questions.length ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = (score / activeQuiz.questions.length) * 100;
    const coinsEarned = percentage >= 60 ? activeQuiz.coins : Math.floor(activeQuiz.coins * 0.3);
    
    return (
      <div className="page-container">
        <div className="quiz-results">
          <div className="results-header">
            <h2>Quiz Complete!</h2>
            <div className="results-score">
              {score}/{activeQuiz.questions.length} Correct ({percentage.toFixed(0)}%)
            </div>
          </div>
          
          <div className="results-content">
            <div className="coins-earned">
              <span className="coin-icon">🪙</span>
              +{coinsEarned} Coins Earned!
            </div>
            
            <div className="results-message">
              {percentage >= 60 ? 
                "Great job! You passed the quiz!" : 
                "Keep studying! You earned partial credit."}
            </div>
            
            <div className="results-actions">
              <button className="btn-primary" onClick={resetQuiz}>
                Back to Tasks
              </button>
              <button className="btn-secondary" onClick={() => setShowReview(true)}>
                Review Answers
              </button>
              <button className="btn-secondary" onClick={() => startQuiz(activeQuiz)}>
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          Vitacoin <span className="page-title-highlight">Earning Center</span>
        </h1>
        <div className="user-coins-display">
          <span className="coin-icon">🪙</span>
          {user?.coins || 0} Coins
        </div>
      </div>
      
      {/* Quizzes Section */}
      <div className="section">
        <h2 className="section-title">📚 Knowledge Quizzes</h2>
        <div className="content-card">
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card">
                <div className="quiz-card-header">
                  <h3 className="quiz-title">{quiz.title}</h3>
                  <span className={`difficulty-badge ${quiz.difficulty.toLowerCase()}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <div className="quiz-card-content">
                  <div className="quiz-info">
                    <span className="quiz-questions">{quiz.questions.length} Questions</span>
                    <span className="quiz-coins">+{quiz.coins} Coins</span>
                  </div>
                  <button 
                    className="quiz-start-btn"
                    onClick={() => startQuiz(quiz)}
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Tasks Section */}
      <div className="section">
        <h2 className="section-title">⚡ Daily Tasks</h2>
        <div className="content-card">
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div className="task-content">
                  <div className="task-header">
                    <h4 className="task-title">{task.title}</h4>
                    <span className={`difficulty-badge ${task.difficulty.toLowerCase()}`}>
                      {task.difficulty}
                    </span>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-footer">
                    <span className="task-coins">+{task.coins} Coins</span>
                    <button 
                      className="task-btn"
                      onClick={() => completeTask(task)}
                    >
                      Complete Task
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Earn;
