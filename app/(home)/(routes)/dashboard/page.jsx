'use client';

import { useUser } from '@clerk/nextjs';
import { getAgentByEmail, GetUserCourseList } from '../../../_services/index';
import React, { useEffect, useState, useContext } from 'react';
import CategoryItem from '../../../(home)/_components/CategoryItem';
import Link from 'next/link';
import CategoryFilter from '../../../(home)/(routes)/browse/_components/CategoryFilter';
import { SearchContext } from '../../../_context/SearchContext';

function Dashboard() {
  const { user } = useUser();
  const [userCourseList, setUserCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [agent, setAgent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { searchTerm } = useContext(SearchContext);

  useEffect(() => {
    if (user) {
      getUserCourse();
      fetchAgentDetails();
    }
  }, [user]);

  const getUserCourse = async () => {
    await GetUserCourseList(user?.primaryEmailAddress?.emailAddress).then(
      (res) => {
        if (res) {
          const coursesWithProgress = res?.userEnrollCourses.map((course) => {
            const completedChapterIds = course?.completedChapterIds
              ? course.completedChapterIds
                  .split(',')
                  .filter((id) => id.trim() !== '')
              : [];

            const totalChapters = course?.courseList?.totalChapters || 0;
            const progress =
              totalChapters > 0
                ? (completedChapterIds.length / totalChapters) * 100
                : 0;

            return { ...course, progress };
          });

          setUserCourseList(coursesWithProgress);
          setFilteredCourses(coursesWithProgress);
        }
      }
    );
  };

  const fetchAgentDetails = async () => {
    await getAgentByEmail(user?.primaryEmailAddress?.emailAddress).then(
      (res) => {
        if (res) setAgent(res?.agent);
      }
    );
  };

  const filterCourses = (category, searchTerm) => {
    let filteredList = [...userCourseList];

    if (category !== 'all') {
      filteredList = filteredList.filter((course) =>
        course?.courseList?.tags.includes(category)
      );
    }

    if (searchTerm) {
      filteredList = filteredList.filter((course) =>
        course?.courseList?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filteredList);
    setSelectedCategory(category);
  };

  useEffect(() => {
    filterCourses(selectedCategory, searchTerm);
  }, [searchTerm]);

  // Separate Ongoing & Completed Courses
  const completedCourses = filteredCourses.filter(
    (course) => course.progress === 100
  );
  const ongoingCourses = filteredCourses.filter(
    (course) => course.progress < 100
  );

  return (
    <div className="ml-4">
      <h2 className="text-[23px] text-[#1E3A5F] mt-1">My Enrolled Courses</h2>

      <div className="flex justify-start items-center text-[20px] mt-2 text-gray-600 gap-4">
        <CategoryFilter
          selectedCategory={(category) => {
            filterCourses(category, searchTerm);
          }}
        />
      </div>

      {/* Ongoing Courses Section */}
      {ongoingCourses.length > 0 && (
        <div>
          <h2 className="text-[18px]  mt-3 text-[#1E3A5F]">
            Ongoing Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-1 gap-5">
            {ongoingCourses.map((course, index) => (
              <Link
                href={'/course-preview/' + course?.courseList?.id}
                key={index}
              >
                <CategoryItem
                  course={course?.courseList}
                  progress={course.progress}
                  showProgress={true}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Completed Courses Section */}
      {completedCourses.length > 0 && (
        <div className="mt-3">
          <h2 className="text-[18px]  text-green-600">
            Completed Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-1 gap-5">
            {completedCourses.map((course, index) => (
              <Link
                href={'/course-preview/' + course?.courseList?.id}
                key={index}
              >
                <CategoryItem
                  course={course?.courseList}
                  progress={course.progress}
                  showProgress={true}
                  completed={true}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Show a message if there are no courses to display */}
      {ongoingCourses.length === 0 && completedCourses.length === 0 && (
        <div className="flex justify-center items-center text-[20px] mt-5 text-gray-500">
          <h2>No courses found in this category.</h2>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
