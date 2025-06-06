import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { CircleCheckBig } from 'lucide-react';

const CompletionSection = ({
  isVisible,
  onClose,
  coursePoints,
  course,
  userCourse,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const completedChapters = userCourse?.completedChapterIds?.split(',') || [];
  const totalModules = course?.sections?.length || 0;
  const totalChapters = course?.totalChapters || 0;

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-gradient-to-r from-[#009688ff] to-[#1e3a5fff] text-white p-10 rounded-3xl shadow-2xl text-center relative max-w-lg w-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        {showConfetti && (
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              numberOfPieces={400}
              gravity={0.1}
              wind={0.02}
            />
          </div>
        )}

        <CircleCheckBig className="w-16 h-16 text-[#ffd700ff] mx-auto" />

        <h2 className="text-3xl font-bold font-poppins mt-4">
          Congratulations!{' '}
        </h2>
        <p className="mt-4 text-lg font-poppins">
          You’ve successfully completed the course!
        </p>

        {/* Display Course Recap */}
        <div className="mt-6 text-center p-5 bg-white bg-opacity-20 rounded-lg font-poppins font-medium">
          <h3 className="text-lg text-[#ffd700ff]">Course Recap </h3>
          <p className="mt-2">
            {' '}
            Modules Completed: <strong>{totalModules}</strong>
          </p>
          <p className="mt-2">
            {' '}
            Chapters Completed: <strong>{totalChapters}</strong>
          </p>
          <p className="mt-2">
            {' '}
            Points Earned: <strong>{coursePoints}</strong>
          </p>
        </div>

        {/* Course Name Award */}
        <div className="mt-6">
          <h3 className="text-[24px] font-bold font-poppins text-[#ffd700ff]">
            {course.name}
          </h3>

          {/* Trophy Glow */}
          <motion.div className="flex items-center justify-center mt-3">
            <motion.div
              className="w-24 h-24 bg-white flex items-center justify-center rounded-full shadow-lg"
              animate={{
                boxShadow: [
                  '0px 0px 15px #ffd700ff',
                  '0px 0px 25px #ffd700ff',
                  '0px 0px 15px #ffd700ff',
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: 'easeInOut',
              }}
            >
              <p className="text-gray-600 text-[30px]">🏆</p>
            </motion.div>
          </motion.div>
        </div>

        <p className="mt-8 text-left ml-2 font-poppins font-medium">
          Next Steps:
        </p>

        {/* Next Steps Options */}
        <div className="mt-2 flex flex-col sm:flex-row justify-center gap-2">
          <button
            onClick={() => (window.location.href = '/browse')}
            className="px-4 py-3 bg-[#ffd700ff] text-[#1e3a5fff] text-md rounded-lg hover:opacity-80 transition-all"
          >
            Explore More Courses
          </button>
          <button
            onClick={() => (window.location.href = '/dashboard')}
            className="px-4 py-3 bg-white text-[#1e3a5fff] text-md rounded-lg hover:opacity-80 transition-all"
          >
            My Courses
          </button>
          <button
            onClick={() => (window.location.href = '/redeem')}
            className="px-4 py-3 bg-[#009688ff] text-white text-md rounded-lg hover:opacity-80 transition-all"
          >
            Rewards
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl"
        >
          ✖
        </button>
      </motion.div>
    </motion.div>
  );
};

export default CompletionSection;
