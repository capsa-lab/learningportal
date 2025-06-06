import React, { useState, useEffect } from 'react';

function OptionsSection({ courseDetail, userCourse }) {
  const [infoMessage, setInfoMessage] = useState(""); // Store info message dynamically
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [hasProgress, setHasProgress] = useState(false); // Track if user has completed any chapters
  const [animatedProgress, setAnimatedProgress] = useState(0); // Animated progress bar


  const totalPoints = courseDetail?.coursePoints || 0;

  useEffect(() => {
    if (!userCourse) {
      // Before enrollment message
      setInfoMessage("Your learning adventure awaits! Enroll now and progress through each chapter to unlock new knowledge.");
      setHasProgress(false); 
      setProgressPercentage(0); 
    } else {
      // After enrollment message (without progress)
      let info = "You're enrolled! Sharpen your skills one chapter at a time—let’s get started!";
      let earned = 0;

      // If enrolled, calculate earned & remaining points
      const completedChapterIds = userCourse?.completedChapterIds?.split(',') || [];
      if (completedChapterIds.length > 0 && completedChapterIds[0] !== "") {
        courseDetail?.sections?.forEach(section => {
          section.chapters.forEach(chapter => {
            if (completedChapterIds.includes(chapter.id)) {
              earned += chapter.chapterPoints || 0;
            }
          });
        });

        const remaining = totalPoints - earned;
        const percentage = Math.round((earned / totalPoints) * 100);

        setEarnedPoints(earned);
        setRemainingPoints(remaining);
        setProgressPercentage(percentage);
        setHasProgress(true); // User has completed at least one chapter

        // If the user has completed the course, show a different message
        if (earned === totalPoints) {
          info = "Congratulations! You've completed the course and earned all available points! 🎉";
        } else {
          info = "You're making great progress!";
        }
      } else {
        setHasProgress(false); // If user has no chapters completed
      }

      setInfoMessage(info);
    }
  }, [courseDetail, userCourse]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 300);

    return () => clearTimeout(timeout); 
  }, [progressPercentage]);

  return (
    <div className="flex items-center gap-3 relative">
      <div className="p-3 border rounded-lg flex flex-col items-center w-full relative">
        <span className="text-2xl">🏅</span>
        <h2 className="text-xs text-[#1E3A5F] mt-2 mb-2 font-semibold">
          Course Completion Reward: {totalPoints} Points ⭐
        </h2>
        <p  className={`text-xs text-center mt-1 ${
              hasProgress ? (earnedPoints === totalPoints ? "text-green-600" : "text-[#333333]") : "text-[#333333]"
          }`}
        >
          {infoMessage}
        </p>


        {/* Show progress bar only if at least one chapter is completed */}
        {hasProgress && (
            <div className="w-full mt-3">
              <div className="bg-gray-200 rounded-full h-3 w-full">
                <div
                  className="h-3 rounded-full transition-all duration-[1500ms] ease-out"
                  style={{
                    width: `${animatedProgress}%`,
                    background: "linear-gradient(90deg, hsla(1, 84%, 80%, 1) 0%, hsla(51, 100%, 50%, 1) 100%)",
                  }}
                ></div>
              </div>

            {/* Show progress details only if the course is not fully completed */}
            {earnedPoints < totalPoints && (
              <p className="text-xs text-gray-500 mt-1 text-center">
                <span className="text-yellow-500 font-semibold">{earnedPoints} points</span> earned so far,  
                <span className="text-gray-500 font-semibold"> {remainingPoints}</span> more still available.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OptionsSection;
