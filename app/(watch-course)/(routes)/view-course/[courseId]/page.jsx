'use client';
import React, { useEffect, useState } from 'react';
import ChapterNav from './_components/ChapterNav';
import FullVideoPlayer from './_components/FullVideoPlayer';
import { getCourseById } from '../../../../_services/index';
import { UserButton, useUser } from '@clerk/nextjs';
import { CompletedChapterContext } from '../../../../_context/CompletedChapterContext';
import { Star } from 'lucide-react';
import { usePoints } from '@/app/_context/PointsContext';
import { motion } from 'framer-motion';

function ViewCourse({ params }) {
  const { user } = useUser();
  const { points } = usePoints();
  const [course, setCourse] = useState([]);
  const [userCourse, setUserCourse] = useState();
  const [activeChapter, setActiveChapter] = useState();
  const [completedChapter, setCompletedChapter] = useState();
  const [highlightPoints, setHighlightPoints] = useState(false); // Animation state for points

  useEffect(() => {
    user ? getCourse() : null;
  }, [user]);

  const getCourse = async () => {
    await getCourseById(
      params?.courseId,
      user?.primaryEmailAddress?.emailAddress
    ).then((res) => {
      setCourse(res.courseList);
      setUserCourse(res.userEnrollCourses);
      setCompletedChapter(res?.userEnrollCourses[0]?.completedChapter);
    });
  };

  const handlePointsAnimation = () => {
    setHighlightPoints(true);
    setTimeout(() => setHighlightPoints(false), 1500);
  };

  return (
    course?.name && (
      <CompletedChapterContext.Provider
        value={{ completedChapter, setCompletedChapter }}
      >
        <div className="flex">
          <div className="w-72 border shadow-sm h-screen z-50">
            <ChapterNav
              course={course}
              userCourse={userCourse}
              setActiveChapter={(chapter) => setActiveChapter(chapter)}
            />
          </div>
          <div className="flex-grow p-2">
            <div className="flex justify-end">
              <div className="flex items-center">
                <p className="mr-4 flex items-center">
                  <motion.div
                    className="flex items-center"
                    initial={{ scale: 1 }}
                    animate={highlightPoints ? { scale: 1.5 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Star className="text-yellow-500 mr-1" /> {points}
                  </motion.div>
                </p>
                <UserButton className="w-full h-full" />
              </div>
            </div>
            <FullVideoPlayer
              userCourse={userCourse}
              activeChapter={activeChapter}
              course={course}
              onPointsUpdate={handlePointsAnimation} // Pass animation trigger to child
            />
          </div>
        </div>
      </CompletedChapterContext.Provider>
    )
  );
}

export default ViewCourse;
