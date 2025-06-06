import { useUser } from '@clerk/nextjs';
import { EnrollCourse, PublishCourse } from '../../../../../_services/index';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function EnrollmentSection({ courseDetail, userCourse }) {
  const { user } = useUser();
  const router = useRouter();

  const enrollCourse = async () => {
    if (user) {
      await EnrollCourse(
        courseDetail.id,
        user?.primaryEmailAddress?.emailAddress
      ).then(async (res) => {
        if (res) {
          await PublishCourse(res?.createUserEnrollCourse?.id).then(
            (result) => {
              if (result) {
                // Set a flag in sessionStorage to trigger the redirect after reload
                sessionStorage.setItem('redirectToViewCourse', courseDetail.id);
                // Reload the page
                window.location.reload();
              }
            }
          );
        }
      });
    } else {
      router.push('/sign-in');
    }
  };

  useEffect(() => {
    // Check if we need to redirect after reload
    const courseIdToRedirect = sessionStorage.getItem('redirectToViewCourse');
    if (courseIdToRedirect) {
      sessionStorage.removeItem('redirectToViewCourse'); // Clear the flag
      router.push('/view-course/' + courseIdToRedirect); // Redirect to the view-course page
    }
  }, [router]);

  return (
    <div>
      {userCourse?.courseId ? (
        <button
          className="p-2 w-full text-white rounded-lg text-[14px] mt-2 transition duration-200 bg-[#1e3a5f] hover:opacity-80"
          onClick={() => router.push('/view-course/' + courseDetail.id)}
        >
          View Course
        </button>
      ) : null}
  
      {courseDetail.free && !userCourse?.courseId ? (
        <button
          className="p-2 w-full text-white rounded-lg text-[14px] mt-2 transition duration-200 bg-[#1e3a5f] hover:opacity-80"
          onClick={() => enrollCourse()}
        >
          Enroll Now
        </button>
      ) : !userCourse?.courseId ? (
        <button
          className="p-2 w-full text-white rounded-lg text-[14px] mt-2 transition duration-200 bg-[#1e3a5f] hover:opacity-80"
          onClick={() => enrollCourse()}
        >
          Enroll
        </button>
      ) : null}
    </div>
  );
  
  
  
}

export default EnrollmentSection;
