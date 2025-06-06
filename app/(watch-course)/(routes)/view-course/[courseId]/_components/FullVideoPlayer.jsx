// FullVideoPlayer.jsx
import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircle2 } from 'lucide-react';
import { MarkChapterCompleted } from '../../../../../_services/index';
import { CompletedChapterContext } from '../../../../../_context/CompletedChapterContext';
import { marked } from 'marked';
import QuizSection from './QuizSections';
import Confetti from 'react-confetti';
import confetti from 'canvas-confetti';
import { usePoints } from '@/app/_context/PointsContext';
import { motion, AnimatePresence } from 'framer-motion';
import CompletionSection from './CompletionSection'; //

function FullVideoPlayer({ userCourse, activeChapter, course, onPointsUpdate }) {
  const { addPoints } = usePoints();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false); // Animation state
  const { completedChapter, setCompletedChapter } = useContext(CompletedChapterContext);
  const [completedChapterIds, setCompletedChapterIds] = useState([]); // Track completed chapter IDs
  const [showCompletionSection, setshowCompletionSection] = useState(false); // Modal visibility state

  const isChapterCompleted = (chapterId) => {
    return completedChapterIds.includes(chapterId);
  };

  const customConfetti = () => {
    confetti({
      particleCount: 100,
    });
  };

  const isLastChapter = () => {
    const lastSection = course?.sections?.[course?.sections.length - 1];
    const lastChapter = lastSection?.chapters?.[lastSection.chapters.length - 1];
    const lastChapterName = lastChapter?.name;
    return lastChapterName === activeChapter?.name;
  };

  const markChapterCompleted = async () => {
    if (!activeChapter || !userCourse[0]) {
      console.error('Active chapter or user course ID is missing.');
      return;
    }

    const chapterId = activeChapter?.id;
    const userId = userCourse[0]?.id;
    if (!userCourse || !userCourse[0]) {
      return null; // Or display a loading state
    }

    if (completedChapterIds.includes(chapterId)) {
      return;
    }

    const updatedCompletedChapterIds = [...completedChapterIds, chapterId];

    try {
      setCompletedChapterIds(updatedCompletedChapterIds);
      setCompletedChapter(updatedCompletedChapterIds);

      await MarkChapterCompleted({
        userId,
        courseId: userCourse[0].courseId,
        completedChapterIds: updatedCompletedChapterIds.join(','),
      });

      const chapterPoints = activeChapter?.chapterPoints || 0; // Fetch points from Hygraph
      addPoints(chapterPoints); // Award the correct points
      onPointsUpdate(); // Notify parent to animate star icon
      setTimeout(() => setShowPointsAnimation(false), 1500); // Hide animation after 1.5 seconds

      toast.success(`🎉 You earned ${chapterPoints} points for completing this chapter!`, {
        position: 'bottom-left',
      });
    } catch (error) {
      console.error('Failed to mark chapter as completed:', error);
      toast.error('❌ Failed to mark chapter as completed. Please try again.', {
        position: 'bottom-left',
      });
      setCompletedChapterIds(completedChapterIds);
      setCompletedChapter(completedChapterIds);
    }
  };

  useEffect(() => {
    const completedChapterIdsFromDb = userCourse[0]?.completedChapterIds?.split(',') || [];
    setCompletedChapterIds(completedChapterIdsFromDb);
    setCompletedChapter(completedChapterIdsFromDb);
  }, [userCourse]);

  // When the active chapter is the last one and it is completed, show the modal.
  useEffect(() => {
    if (activeChapter && isLastChapter() && isChapterCompleted(activeChapter.id)) {
      setshowCompletionSection(true);
    }
  }, [activeChapter, completedChapterIds]);
  

  return (
    activeChapter && (
      <div className="relative h-[65vh] p-5">
        {showPointsAnimation && (
          <AnimatePresence>
            <motion.div
              className="absolute top-0 right-0 bg-yellow-400 text-white p-3 px-5 rounded-lg shadow-lg flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>+10 Points!</span>
            </motion.div>
          </AnimatePresence>
        )}

        {activeChapter?.youtubeUrl ? (
          <>
            <iframe
              key={activeChapter?.youtubeUrl}
              className="w-full h-[calc(65vh-3rem)]"
              src={activeChapter?.youtubeUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="border rounded-lg mt-5 flex justify-between items-center p-4">
              <h2 className="text-[20px] font-medium">{activeChapter?.name}</h2>
            </div>
            <div className="border rounded-lg mt-5 flex justify-between items-center p-4">
              <p
                className="text-gray-500 text-sm"
                dangerouslySetInnerHTML={{
                  __html: marked(activeChapter?.description || ''),
                }}
              />
            </div>
          </>
        ) : (
          <QuizSection
            chapter={activeChapter}
            markChapterCompleted={markChapterCompleted}
            isLastChapter={isLastChapter}
          />
        )}

        {activeChapter?.youtubeUrl && (
          <div className="flex justify-end mt-4">
            {!isChapterCompleted(activeChapter?.id) && (
              <button
                className="bg-[#1e3a5fff] text-white p-2 px-5 rounded-lg flex items-center gap-2 hover:opacity-80 text-lg w-[8rem] h-[4rem] justify-center"
                style={{ fontSize: '1.25rem' }}
                onClick={markChapterCompleted}
              >
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-lg">Next</span>
              </button>
            )}
          </div>
        )}

        {/* Render the full-screen completion modal */}
        {showCompletionSection && (
          <CompletionSection
            isVisible={showCompletionSection}
            onClose={() => setshowCompletionSection(false)}
            chapterPoints={activeChapter?.chapterPoints || 0}
            coursePoints={course?.coursePoints || 0}
            course={course} 
            userCourse={userCourse?.[0]}
          />
        )}
      </div>
    )
  );
}

export default FullVideoPlayer;
