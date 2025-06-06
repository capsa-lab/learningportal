import { Book } from 'lucide-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';

function CourseDetails({ courseDetail }) {
  const moduleCount = courseDetail?.sections?.length || 0;

  return (
    <div className="mt-3 p-3 rounded-lg border">
      <div className="flex items-center justify-between mt-2 mr-3 ml-3">
        {/* Number of Modules on the Left */}
        <div className="flex items-center gap-2">
          <span className="h-6 w-6  rounded-full bg-[#00968830] flex items-center justify-center">
            {' '}
            📔{' '}
          </span>
          <h2 className="text-[12px] text-[#1E3A5F]">
            {moduleCount} {moduleCount === 1 ? 'Module' : 'Modules'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-6 w-6  rounded-full bg-[#00968830] flex items-center justify-center">
            {' '}
            ⭐{' '}
          </span>
          <h2 className="text-[12px] text-yellow-600">
            {courseDetail?.coursePoints || 0} Points
          </h2>
        </div>

        {/* Tags on the Right */}
        <div className="flex gap-2">
          {courseDetail?.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium text-[#1E3A5F] bg-[#00968830] rounded-full"
            >
              {tag
                .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters
                .replace(/\b\w/g, (char) => char.toUpperCase())}{' '}
              {/* Capitalize first letter of each word */}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mt-3 p-5 rounded-lg border max-w-full">
        <ReactMarkdown className="text-[13px] mt-2 text-[#333333] whitespace-pre-line">
          {courseDetail?.description}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default CourseDetails;
