import Image from 'next/image';
import React, { useState, useEffect } from 'react';

function CategoryItem({ course, progress = 0, showProgress = false }) {
  const totalSections = course?.totalSections || 0;
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 300);
    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-md hover:shadow-xl hover:border-[#009688] transition-all duration-300 cursor-pointer">
      <Image
        src={course?.banner?.url}
        alt={course?.name}
        width={1000}
        height={500}
        className="rounded-lg"
      />

      {/* Course Info */}
      <div className="mt-3">
        <h2 className="text-[14px] md:text-[14px] text-[#1E3A5F] font-inter font-semibold uppercase">
          {course?.name}
        </h2>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <span className="h-6 w-6 rounded-full bg-[#00968830] flex items-center justify-center">
            📔
            </span>
            <h2 className="text-[12px] font-medium text-[#333333]">
              {totalSections} {totalSections === 1 ? 'Module' : 'Modules'}
            </h2>
          </div>

          {course?.coursePoints !== undefined && (
            <div className="flex items-center gap-1 ml-3">
              <span className="h-6 w-6 rounded-full bg-[#00968830] flex items-center justify-center">
                ⭐
              </span>
              <h2 className="text-[12px] font-medium text-yellow-600">
                {course?.coursePoints || 0} Points
              </h2>
            </div>
          )}
        </div>

        {/* Progress Bar (Only in Dashboard - My Enrolled Courses) */}
        {showProgress && (
          <div className="mt-3">
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-[1500ms] ease-out"
                style={{
                  width: `${animatedProgress.toFixed(0)}%`,
                  background: "linear-gradient(90deg, hsla(136, 82%, 72%, 1) 0%, hsla(205, 84%, 36%, 1)  100%)",
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {animatedProgress.toFixed(0)}% Completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryItem;
