'use client';
import React, { useEffect, useState, useContext } from 'react';
import CategoryFilter from './_components/CategoryFilter';
import { getCourseList } from '../../../_services/index';
import CourseList from './_components/CourseList';
import { SearchContext } from '../../../_context/SearchContext';
import GreetingBox from '../../../(home)/_components/GreetingBox';
import { useUser } from '@clerk/nextjs';
import { getAgentByEmail } from '../../../_services/index';

function Browse() {
  const [courses, setCourses] = useState([]);
  const [coursesOrg, setCoursesOrg] = useState([]);
  const [agent, setAgent] = useState(null);

  // Use useContext to access searchTerm from SearchContext
  const { searchTerm } = useContext(SearchContext);
  const { user } = useUser();

  useEffect(() => {
    getCourses();
    if (user) {
      fetchAgentDetails();
    }
  }, [user]);

  const getCourses = () => {
    getCourseList().then((res) => {
      setCourses(res.courseLists);
      setCoursesOrg(res.courseLists);
    });
  };

  const fetchAgentDetails = async () => {
    await getAgentByEmail(user?.primaryEmailAddress?.emailAddress).then(
      (res) => {
        if (res) setAgent(res?.agent);
      }
    );
  };

  // Function to filter courses dynamically
  const filterCourses = (category, searchTerm) => {
    let filteredList = [...coursesOrg];

    // First, filter by category if not 'all'
    if (category !== 'all') {
      filteredList = filteredList.filter((course) =>
        course.tags.includes(category)
      );
    }

    // Then filter by searchTerm (case-insensitive)
    if (searchTerm) {
      filteredList = filteredList.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setCourses(filteredList);
  };

  // Update filter dynamically when category or searchTerm changes
  useEffect(() => {
    filterCourses('all', searchTerm); // Automatically filter by searchTerm when it changes
  }, [searchTerm]); // Trigger filtering when searchTerm changes

  return (
    <div className="ml-4">
      {/* Display Greeting Box */}
      <GreetingBox agent={agent} />

      <h2 className="text-[23px] text-[#1E3A5F] mt-1 browse-title">Browse Courses</h2>

      <div className="flex justify-start items-center text-[20px] mt-2 text-gray-600 gap-4">
        <CategoryFilter
          selectedCategory={(category) => {
            filterCourses(category, searchTerm);
          }}
        />
      </div>

      {courses.length ? <CourseList courses={courses} /> : null}
    </div>
  );
}

export default Browse;
