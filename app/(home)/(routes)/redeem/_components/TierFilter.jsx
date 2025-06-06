'use client';

import React, { useState } from 'react';

function TierFilter({ selectedTier }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const filterOptions = [
    {
      id: 1,
      name: 'All',
      value: 'all',
    },
    {
      id: 2,
      name: 'Tier 1',
      value: 'tier1',
    },
    {
      id: 3,
      name: 'Tier 2',
      value: 'tier2',
    },
    {
      id: 4,
      name: 'Tier 3',
      value: 'tier3',
    },
    {
      id: 5,
      name: 'Purchased',
      value: 'purchased',
    },
  ];

  return (
    <div className="flex gap-3">
      {filterOptions.map((item, index) => (
        <button
          onClick={() => {
            setActiveIndex(index);
            selectedTier(item.value);
          }}
          key={index}
          className={`border p-1 px-3 text-sm rounded-md font-medium transition duration-200 shadow-sm ${
            activeIndex === index
              ? 'border-[#009688] bg-[#009688] text-white shadow-sm' 
              : 'border border-[#00968830] text-[#009688] hover:bg-[#f5f5f5] hover:border-[#009688] hover:shadow-md'
          }`}
        >
           <h2 className="text-[13px] ">{item.name}</h2>
        </button>
      ))}
    </div>
  );
}

export default TierFilter;
