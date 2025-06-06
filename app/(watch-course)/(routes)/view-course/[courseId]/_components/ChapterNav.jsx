import { CompletedChapterContext } from '../../../../../_context/CompletedChapterContext';
import {
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function ChapterNav({ course, userCourse, setActiveChapter }) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [openSection, setOpenSection] = useState(0);
  const { completedChapter, setCompletedChapter } = useContext(
    CompletedChapterContext
  );
  const router = useRouter();

  // State to track chapters that have just been unlocked
  const [justUnlockedChapters, setJustUnlockedChapters] = useState([]);
  const prevCompletedChapterRef = useRef(completedChapter);

  useEffect(() => {
    setActiveChapter(course?.sections[0]?.chapters[0]);
  }, []);

  // Check if the chapter ID is in the completedChapter array
  const isChapterCompleted = (chapterId) => {
    return completedChapter?.includes(chapterId);
  };

  // Check if the chapter is locked based on progression rules
  const isChapterLocked = (
    sectionIndex,
    chapterIndex,
    completed = completedChapter
  ) => {
    // First chapter of the first section is never locked
    if (sectionIndex === 0 && chapterIndex === 0) return false;
    const previousChapter =
      chapterIndex > 0
        ? course.sections[sectionIndex].chapters[chapterIndex - 1]
        : course.sections[sectionIndex - 1]?.chapters?.slice(-1)[0];

    // If previous chapter exists and is not completed, the current chapter is locked
    return previousChapter && !completed?.includes(previousChapter.id);
  };

  // Detect when chapters are newly unlocked (i.e. changed from locked to unlocked)
  useEffect(() => {
    if (prevCompletedChapterRef.current !== completedChapter) {
      const newlyUnlocked = [];
      course.sections?.forEach((section, sectionIndex) => {
        section.chapters?.forEach((chapter, chapterIndex) => {
          const wasLocked = isChapterLocked(
            sectionIndex,
            chapterIndex,
            prevCompletedChapterRef.current
          );
          const isLockedNow = isChapterLocked(sectionIndex, chapterIndex);
          if (wasLocked && !isLockedNow) {
            newlyUnlocked.push(chapter.id);
          }
        });
      });
      if (newlyUnlocked.length > 0) {
        setJustUnlockedChapters(newlyUnlocked);
        // Clear the unlocked highlight after 2 seconds.
        setTimeout(() => setJustUnlockedChapters([]), 2000);
      }
    }
    prevCompletedChapterRef.current = completedChapter;
  }, [completedChapter, course]);

  // Function to handle automatic navigation to the next chapter
  const handleChapterCompletion = (chapter) => {
    // Find the current chapter's index
    let currentSectionIndex = null;
    let currentChapterIndex = null;

    course.sections.forEach((section, sectionIndex) => {
      const chapterIndex = section.chapters.findIndex(
        (c) => c.id === chapter.id
      );
      if (chapterIndex !== -1) {
        currentSectionIndex = sectionIndex;
        currentChapterIndex = chapterIndex;
      }
    });

    if (currentSectionIndex !== null && currentChapterIndex !== null) {
      // Determine the next chapter
      let nextChapter = null;
      if (
        currentChapterIndex <
        course.sections[currentSectionIndex].chapters.length - 1
      ) {
        // Next chapter is in the same section
        nextChapter =
          course.sections[currentSectionIndex].chapters[
            currentChapterIndex + 1
          ];
      } else if (currentSectionIndex < course.sections.length - 1) {
        // Next chapter is in the next section
        nextChapter = course.sections[currentSectionIndex + 1].chapters[0];
      }

      if (nextChapter) {
        // Navigate to the next chapter after 2 seconds
        setTimeout(() => {
          setActiveChapter(nextChapter);
          setActiveIndex(nextChapter.chapterNumber);

          //open next section,
          if (
            course.sections[currentSectionIndex].chapters.length - 1 ==
            currentChapterIndex
          ) {
            setOpenSection(currentSectionIndex + 1);
          }
        }, 2000);
      }
    }
  };

  // useEffect to trigger auto-navigation on chapter completion
  useEffect(() => {
    if (completedChapter && completedChapter.length > 0) {
      // Get the last completed chapter.
      const lastCompletedChapterId =
        completedChapter[completedChapter.length - 1];
      let lastCompletedChapter = null;

      course.sections.forEach((section) => {
        const chapter = section.chapters.find(
          (c) => c.id === lastCompletedChapterId
        );
        if (chapter) {
          lastCompletedChapter = chapter;
        }
      });

      if (lastCompletedChapter) {
        handleChapterCompletion(lastCompletedChapter);
      }
    }
  }, [completedChapter, course]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-5">
        <h2 className="font-semibold text-[18px] text-[#1e3a5fff] uppercase">
          {course.name}
        </h2>
        <h2 className="text-gray-500 text-[14px]">By CL</h2>
      </div>
      <div className="flex-grow overflow-auto">
        {course.sections?.map((section, sectionIndex) => (
          <div key={section.id}>
            {/* Section Header */}
            <div
              onClick={() =>
                setOpenSection(
                  openSection === sectionIndex ? null : sectionIndex
                )
              }
              className="flex justify-between items-center px-5 p-4 cursor-pointer hover:bg-gray-100"
            >
              <h3 className="font-semibold text-[16px] text-gray-700">
                {section.name}
              </h3>
              <span>{openSection === sectionIndex ? '-' : '+'}</span>
            </div>

            {/* Chapters – Only show if section is open */}
            {openSection === sectionIndex && (
              <div>
                {section.chapters?.map((chapter, chapterIndex) => {
                  const isLocked = isChapterLocked(sectionIndex, chapterIndex);
                  const isActive =
                    activeIndex === chapter.chapterNumber && !isLocked;
                  const isCompleted = isChapterCompleted(chapter.id);

                  return (
                    <div
                      key={chapter.id}
                      onClick={() => {
                        if (!isLocked) {
                          setActiveIndex(chapter.chapterNumber);
                          setActiveChapter(chapter);
                        }
                      }}
                      className={`relative flex items-center gap-2 text-[14px] px-5 py-2 cursor-pointer 
                        ${
                          isActive
                            ? 'bg-[#7195c583] text-[#1e3a5fff]'
                            : isCompleted
                            ? 'bg-green-100 text-green-700'
                            : isLocked
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {/* Gradient overlay to highlight unlocked chapter */}
                      {!isLocked &&
                        justUnlockedChapters.includes(chapter.id) && (
                          <motion.div
                            className="absolute right-0 top-0 bottom-0 z-0 pointer-events-none"
                            initial={{ width: '100%' }}
                            animate={{ width: 0 }}
                            transition={{ duration: 2, ease: 'easeInOut' }}
                          >
                            <div
                              className="h-full"
                              style={{
                                background:
                                  'linear-gradient(90deg, hsla(186,33%,94%,1) 0%, hsla(216,41%,79%,1) 100%)',
                              }}
                            />
                          </motion.div>
                        )}

                      {/* Chapter Icon */}
                      <div className="relative z-10 flex items-center gap-2 w-full">
                        {isLocked ? (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200">
                            <Lock
                              height={20}
                              width={20}
                              className="text-gray-400"
                            />
                          </div>
                        ) : isActive ? (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#1e3a5fff]">
                            <PauseCircle
                              height={20}
                              width={20}
                              className="text-white"
                            />
                          </div>
                        ) : isCompleted ? (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                            <CheckCircle2
                              height={20}
                              width={20}
                              className="text-green-700"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                            <PlayCircle
                              height={20}
                              width={20}
                              className="text-gray-700"
                            />
                          </div>
                        )}

                        <div>
                          <h4>{chapter.name}</h4>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Return to Homepage */}
      <div className="p-4 flex justify-start items-center">
        <button
          onClick={() => router.push('/browse')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
        >
          <ArrowLeft height={16} width={16} />
          <span>Back to Homepage</span>
        </button>
      </div>
    </div>
  );
}

export default ChapterNav;
