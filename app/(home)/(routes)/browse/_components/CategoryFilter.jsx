'use client';
import React, { useState } from 'react';

function CategoryFilter({ selectedCategory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const filterOptions = [
    { id: 1, name: 'All', value: 'all' },
    { id: 2, name: 'Sales', value: 'sales' },
    { id: 3, name: 'Lead Gen', value: 'leadGen' },
    { id: 4, name: 'Product', value: 'product' },
  ];

  return (
    <div className="flex gap-3 category-filter">
      {filterOptions.map((item, index) => (
        <button
          onClick={() => {
            setActiveIndex(index);
            selectedCategory(item.value);
          }}
          key={index}
          className={`border p-1 px-3 text-sm rounded-md font-medium transition duration-200 shadow-sm ${
            activeIndex === index
              ? 'border-[#009688] bg-[#009688] text-white shadow-sm'
              : 'border border-[#00968830] text-[#009688] hover:bg-[#f5f5f5] hover:border-[#009688] hover:shadow-md'
          }`}
        >
          <h2 className="text-[13px]">{item.name}</h2>
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
