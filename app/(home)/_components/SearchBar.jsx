// components/SearchBar.js
import { Search } from 'lucide-react';
import React from 'react';
import { useSearch } from '../../_context/SearchContext';

function SearchBar() {
  const { setSearchTerm } = useSearch(); // Use setSearchTerm from context

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex gap-3 text-[14px] items-center border p-2 ml-3 rounded-md bg-gray-50 text-gray-500 search-bar">
      <Search height={17} />
      <input
        type="text"
        placeholder="Search Course"
        className="bg-transparent outline-none"
        onChange={handleInputChange}
      />
    </div>
  );
}

export default SearchBar;
