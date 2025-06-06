import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import confetti from 'canvas-confetti';
import { Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizSection = ({ chapter, markChapterCompleted, isLastChapter }) => {
  const { name, quizzes } = chapter;
  const quiz = quizzes[0];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [passed, setPassed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isAnswerSelected = selectedAnswers[currentQuestion?.id];
  const totalQuestions = quiz?.questions.length;

  useEffect(() => {
    if (!showIntro && !quizCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showIntro, timeLeft, quizCompleted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: option });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz?.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOption) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / totalQuestions) * 100;
    setScore(finalScore);
    setPassed(finalScore >= 80);
    setQuizCompleted(true);

    if (finalScore >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      markChapterCompleted();

      if (isLastChapter()) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(null);
    setPassed(false);
    setShowConfetti(false);
    setTimeLeft(120);
    setQuizCompleted(false);
  };

  const handleStartQuiz = () => {
    setShowIntro(false);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen relative"
      style={{
        background:
          'linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)',
      }}
    >
      {showConfetti && (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            gravity={0.1}
            wind={0.02}
          />
        </div>
      )}

      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-6 relative">
        {!showIntro && !quizCompleted && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold font-dmsans text-[#1e3a5f]">{name}</h2>
              <div className="flex items-center text-[#1e3a5f] font-semibold">
                <Timer className="text-lg mr-1" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-1">
              {quiz?.questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    index <= currentQuestionIndex ? 'bg-[#009688ff]' : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-500 mb-4 font-dmsans">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </>
        )}

        {showIntro ? (
          <div className="text-center font-lexend">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Welcome to the Chapter Quiz! ✍️
            </h3>
            <p className="text-[#333333] font-dmsans text-[15px]">
              This quiz consists of multiple-choice questions. To pass, you need to score at least
              80% within 2 minutes. Read each question carefully and select the best answer.  Once you're ready, click
              the button below to begin.
            </p>
            <button
              onClick={handleStartQuiz}
              className="mt-6 px-6 py-3 rounded-lg bg-[#009688ff] hover:opacity-80 text-white font-semibold transition-all shadow-lg transform hover:scale-105"
            >
              Start Quiz
            </button>
          </div>
        ) : score === null ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-[15px] font-semibold font-dmsans text-[#333333] mb-4">
                  {currentQuestion.questionText}
                </h3>
                <div className="space-y-4 font-dmsans">
                  {Object.entries(JSON.parse(currentQuestion.options)).map(([key, value]) => (
                    <label
                      key={key}
                      className={`flex items-center p-4 shadow-md rounded-xl cursor-pointer transition-all hover:scale-105 ${
                        selectedAnswers[currentQuestion?.id] === key
                          ? 'bg-[#e0f2f1] border border-[#009688ff]'
                          : 'bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={currentQuestion?.id}
                        value={key}
                        checked={selectedAnswers[currentQuestion?.id] === key}
                        onChange={() => handleAnswerSelect(key)}
                        className="hidden"
                      />
                      <div
                        className={`w-5 h-5 flex justify-center items-center rounded-full border-2 transition-all ${
                          selectedAnswers[currentQuestion?.id] === key
                            ? 'bg-[#009688ff] border-[#009688ff]'
                            : 'border-gray-400'
                        }`}
                      >
                        {selectedAnswers[currentQuestion?.id] === key && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="ml-4 text-[#333333] text-[13px]">{value}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-6 text-sm font-dmsans">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-3 py-2 rounded-lg text-white transition-all ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-[#1e3a5f] hover:opacity-80'
                }`}
              >
                Previous
              </button>
              <button
                onClick={
                  currentQuestionIndex === totalQuestions - 1
                    ? handleSubmit
                    : handleNext
                }
                disabled={!isAnswerSelected}
                className={`px-3 py-2 rounded-lg text-white transition-all ${
                  currentQuestionIndex === totalQuestions - 1
                    ? 'bg-gradient-to-r from-[#009688ff] to-[#1e3a5fff] hover:opacity-80'
                    : 'bg-[#009688ff] hover:opacity-80'
                }`}
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center font-poppins">
            {passed ? (
              <>
                <h2 className="text-2xl font-semibold  text-green-500">
                  🎉 Woohoo! You did it!
                </h2>
                <p className="text-md text-[#1e3a5fff] mt-4">
                  You passed the quiz with <span className="font-bold">{score.toFixed(2)}%</span>!
                </p>
                <p className="text-[#333333] text-md mt-2">
                  Your dedication and hard work has paid off. <br />Keep it up!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-red-500">
                  Oops! Try again!
                </h2>
                <p className="text-md text-[#1e3a5fff] mt-4">
                  You scored <span className="font-bold">{score.toFixed(2)}%</span>, but don't let that stop you!
                </p>
                <p className="text-[#333333]  text-sm mt-2">
                  Take a deep breath, review the questions, and give it another shot. You’re learning and improving every time!
                </p>
                <button
                  onClick={handleRetry}
                  className="mt-6 px-6 py-3 rounded-lg bg-[#1e3a5f] hover:opacity-80 text-white font-semibold transition-all"
                >
                  Retry
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
