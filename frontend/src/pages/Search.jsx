import { useState } from 'react';
import { getApiUrl } from '../utils/api.js';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError(null);
    
    try {
      // 🚨 VULNERABLE: This endpoint is vulnerable to excessive record retrieval
      // The UI only sends page=1, but attackers can manually add per_page=1000
              const response = await fetch(`${getApiUrl('api/policies/search')}?query=${encodeURIComponent(query)}&page=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSearchResults(data);
      } else {
        setError(data);
      }
    } catch (err) {
      console.error('Error searching policies:', err);
      setError({
        error: 'Network error',
        message: err.message
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Search Policies</h1>
        <p>Search for insurance policies by name, ID, or policy number</p>
      </div>

      <div className="search-form-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label htmlFor="query">Search Query:</label>
            <input
              type="text"
              id="query"
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter name, ID, or policy number..."
            />
          </div>

          <button type="submit" className="search-button" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-section">
          <h3>❌ Search Error</h3>
          <p><strong>Error:</strong> {error.error}</p>
          {error.message && <p><strong>Message:</strong> {error.message}</p>}
        </div>
      )}

      {searchResults && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="results-info">
            <p>Found {searchResults.policies.length} results</p>
            <p>Page {searchResults.page} of {searchResults.totalPages}</p>
          </div>

          <div className="results-grid">
            {searchResults.policies.map((policy) => (
              <div key={policy.id} className="result-card">
                <div className="result-header">
                  <h3>{policy.policyNumber}</h3>
                  <span className={`status-badge status-${policy.status.toLowerCase()}`}>
                    {policy.status}
                  </span>
                </div>
                <div className="result-content">
                  <p><strong>Type:</strong> {policy.coverage}</p>
                  <p><strong>Name:</strong> {policy.holderName}</p>
                  <p><strong>ID:</strong> {policy.id}</p>
                  <p><strong>Expires:</strong> {policy.expiresOn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults && searchResults.policies.length === 0 && (
        <div className="no-results">
          <h3>No results found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Search; 