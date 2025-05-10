import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ search, setSearch }) => {
  const handleClear = () => {
    setSearch('');
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by recipe name or ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search recipes"
        />
        {search && (
          <button 
            onClick={handleClear} 
            className="clear-btn"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;