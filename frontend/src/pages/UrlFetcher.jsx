import { useState } from 'react';
import { mockUrlResults } from '../data/mockData';
import './UrlFetcher.css';

const UrlFetcher = () => {
  const [url, setUrl] = useState('');
  const [fetchResult, setFetchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFetchResult(null);

    // Simulate API call delay
    setTimeout(() => {
      if (!url.trim()) {
        setError('Please enter a URL');
        setIsLoading(false);
        return;
      }

      const inputUrl = url.trim();
      
      // Simulate SSRF detection and responses
      if (mockUrlResults[inputUrl]) {
        setFetchResult({
          url: inputUrl,
          status: 200,
          content: mockUrlResults[inputUrl],
          headers: {
            'content-type': 'application/json',
            'server': 'nginx/1.18.0'
          }
        });
      } else if (inputUrl.includes('localhost') || inputUrl.includes('127.0.0.1')) {
        setError('SSRF Protection: Localhost access blocked');
      } else if (inputUrl.includes('internal') || inputUrl.includes('192.168.') || inputUrl.includes('10.0.')) {
        setError('SSRF Protection: Internal network access blocked');
      } else if (inputUrl.includes('169.254.') || inputUrl.includes('::1')) {
        setError('SSRF Protection: Link-local address blocked');
      } else if (inputUrl.includes('file://')) {
        setError('SSRF Protection: File protocol access blocked');
      } else if (inputUrl.includes('ftp://') || inputUrl.includes('gopher://')) {
        setError('SSRF Protection: Unsupported protocol blocked');
      } else {
        setError(`Failed to fetch: ${inputUrl} (Connection timeout)`);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleExampleClick = (exampleUrl) => {
    setUrl(exampleUrl);
  };

  const handleSSRFExample = (ssrfUrl) => {
    setUrl(ssrfUrl);
  };

  return (
    <div className="url-fetcher-container">
      <div className="url-fetcher-header">
        <h1>URL Fetcher</h1>
        <p>Fetch content from external URLs (for SSRF testing)</p>
      </div>

      <div className="url-fetcher-content">
        <div className="fetch-section">
          <h2>Fetch URL</h2>
          <form onSubmit={handleFetch} className="fetch-form">
            <div className="form-group">
              <label htmlFor="url">Enter URL to fetch:</label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/data"
                className="url-input"
              />
            </div>
            <button type="submit" className="fetch-button" disabled={isLoading}>
              {isLoading ? 'Fetching...' : 'Fetch URL'}
            </button>
          </form>
        </div>

        <div className="examples-section">
          <h3>Available URLs (for testing):</h3>
          <div className="example-urls">
            {Object.keys(mockUrlResults).map(url => (
              <button
                key={url}
                onClick={() => handleExampleClick(url)}
                className="example-url-button"
              >
                {url}
              </button>
            ))}
          </div>
        </div>

        <div className="ssrf-examples">
          <h3>SSRF Test Examples:</h3>
          <div className="ssrf-examples-grid">
            <div className="ssrf-category">
              <h4>Localhost Access:</h4>
              <div className="ssrf-buttons">
                <button
                  onClick={() => handleSSRFExample('http://localhost:8080/admin')}
                  className="ssrf-example-button localhost"
                >
                  http://localhost:8080/admin
                </button>
                <button
                  onClick={() => handleSSRFExample('http://127.0.0.1:3306')}
                  className="ssrf-example-button localhost"
                >
                  http://127.0.0.1:3306
                </button>
              </div>
            </div>

            <div className="ssrf-category">
              <h4>Internal Network:</h4>
              <div className="ssrf-buttons">
                <button
                  onClick={() => handleSSRFExample('http://192.168.1.1')}
                  className="ssrf-example-button internal"
                >
                  http://192.168.1.1
                </button>
                <button
                  onClick={() => handleSSRFExample('http://10.0.0.1')}
                  className="ssrf-example-button internal"
                >
                  http://10.0.0.1
                </button>
              </div>
            </div>

            <div className="ssrf-category">
              <h4>Link-local Addresses:</h4>
              <div className="ssrf-buttons">
                <button
                  onClick={() => handleSSRFExample('http://169.254.169.254/latest/meta-data/')}
                  className="ssrf-example-button link-local"
                >
                  http://169.254.169.254/latest/meta-data/
                </button>
                <button
                  onClick={() => handleSSRFExample('http://[::1]:8080')}
                  className="ssrf-example-button link-local"
                >
                  http://[::1]:8080
                </button>
              </div>
            </div>

            <div className="ssrf-category">
              <h4>File Protocol:</h4>
              <div className="ssrf-buttons">
                <button
                  onClick={() => handleSSRFExample('file:///etc/passwd')}
                  className="ssrf-example-button file"
                >
                  file:///etc/passwd
                </button>
                <button
                  onClick={() => handleSSRFExample('file:///C:/Windows/System32/config/SAM')}
                  className="ssrf-example-button file"
                >
                  file:///C:/Windows/System32/config/SAM
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-section">
            <h3>Error:</h3>
            <div className="error-message">
              {error}
            </div>
          </div>
        )}

        {fetchResult && (
          <div className="result-section">
            <h3>Fetch Result:</h3>
            <div className="result-info">
              <p><strong>URL:</strong> {fetchResult.url}</p>
              <p><strong>Status:</strong> {fetchResult.status}</p>
              <p><strong>Content-Type:</strong> {fetchResult.headers['content-type']}</p>
              <p><strong>Server:</strong> {fetchResult.headers['server']}</p>
            </div>
            <div className="content-display">
              <pre className="url-content">{fetchResult.content}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="security-notes">
        <h3>SSRF Testing Notes:</h3>
        <ul>
          <li>This page simulates URL fetching for SSRF (Server-Side Request Forgery) testing</li>
          <li>Test access to localhost and internal network resources</li>
          <li>Try accessing cloud metadata endpoints (AWS, Azure, GCP)</li>
          <li>Test file protocol access to sensitive files</li>
          <li>Look for proper URL validation and network access controls</li>
          <li>Check if the application blocks access to internal services</li>
        </ul>
      </div>
    </div>
  );
};

export default UrlFetcher; 