import React, { useState, useEffect } from 'react';
import { BookQueryParams } from '../types/book';

interface SearchFiltersProps {
  filters: BookQueryParams;
  onFiltersChange: (filters: BookQueryParams) => void;
  onSearch: () => void;
  loading?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  loading = false
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput, page: 1 });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    onFiltersChange({ ...filters, sortBy, sortOrder, page: 1 });
  };

  const handleAvailabilityChange = (available: boolean | undefined) => {
    onFiltersChange({ ...filters, available, page: 1 });
  };

  const handleLimitChange = (limit: number) => {
    onFiltersChange({ ...filters, limit, page: 1 });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({
      page: 1,
      limit: 9,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Books
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search by title, author, or genre..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={onSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [string, 'asc' | 'desc'];
              handleSortChange(sortBy, sortOrder);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="author-asc">Author A-Z</option>
            <option value="author-desc">Author Z-A</option>
            <option value="publishedYear-desc">Year (Newest)</option>
            <option value="publishedYear-asc">Year (Oldest)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <select
            value={filters.available === undefined ? '' : filters.available.toString()}
            onChange={(e) => {
              const value = e.target.value;
              handleAvailabilityChange(
                value === '' ? undefined : value === 'true'
              );
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Books</option>
            <option value="true">Available Only</option>
            <option value="false">Unavailable Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Items Per Page
          </label>
          <select
            value={filters.limit || 9}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="12">12</option>
            <option value="24">24</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={clearFilters}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          Clear All Filters
        </button>
        
        {(filters.search || filters.available !== undefined) && (
          <span className="text-sm text-gray-600">
            {filters.search && `Search: "${filters.search}"`}
            {filters.available !== undefined && 
              ` • ${filters.available ? 'Available' : 'Unavailable'}`}
          </span>
        )}
      </div>
    </div>
  );
};