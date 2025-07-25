import { useState } from 'react';
import { mockFiles } from '../data/mockData';
import './FileViewer.css';

const FileViewer = () => {
  const [filename, setFilename] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFileContent(null);

    // Simulate API call delay
    setTimeout(() => {
      // Mock file fetching logic
      if (!filename.trim()) {
        setError('Please enter a filename');
        setIsLoading(false);
        return;
      }

      // Simulate path traversal attempts
      const normalizedFilename = filename.trim();
      
      // Check if file exists in mock data
      if (mockFiles[normalizedFilename]) {
        setFileContent({
          filename: normalizedFilename,
          content: mockFiles[normalizedFilename],
          size: mockFiles[normalizedFilename].length,
          type: getFileType(normalizedFilename)
        });
      } else {
        // Simulate different error scenarios
        if (normalizedFilename.includes('../') || normalizedFilename.includes('..\\')) {
          setError('Path traversal attempt detected: Access denied');
        } else if (normalizedFilename.includes('/etc/') || normalizedFilename.includes('C:\\Windows\\')) {
          setError('System file access denied: Security violation');
        } else if (normalizedFilename.includes('config') || normalizedFilename.includes('secret')) {
          setError('Sensitive file access denied: Insufficient permissions');
        } else {
          setError(`File not found: ${normalizedFilename}`);
        }
      }
      
      setIsLoading(false);
    }, 500);
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'txt': return 'text/plain';
      case 'json': return 'application/json';
      case 'xml': return 'application/xml';
      case 'log': return 'text/plain';
      default: return 'text/plain';
    }
  };

  const handleExampleClick = (exampleFile) => {
    setFilename(exampleFile);
  };

  const handlePathTraversalExample = (example) => {
    setFilename(example);
  };

  return (
    <div className="file-viewer-container">
      <div className="file-viewer-header">
        <h1>File Viewer</h1>
        <p>Fetch and view file contents (for path traversal testing)</p>
      </div>

      <div className="file-viewer-content">
        <div className="fetch-section">
          <h2>Fetch File</h2>
          <form onSubmit={handleFetch} className="fetch-form">
            <div className="form-group">
              <label htmlFor="filename">Enter filename to fetch:</label>
              <input
                type="text"
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="e.g., policy.txt, user_data.json"
                className="filename-input"
              />
            </div>
            <button type="submit" className="fetch-button" disabled={isLoading}>
              {isLoading ? 'Fetching...' : 'Fetch File'}
            </button>
          </form>
        </div>

        <div className="examples-section">
          <h3>Available Files (for testing):</h3>
          <div className="example-files">
            {Object.keys(mockFiles).map(file => (
              <button
                key={file}
                onClick={() => handleExampleClick(file)}
                className="example-file-button"
              >
                {file}
              </button>
            ))}
          </div>
        </div>

        <div className="path-traversal-examples">
          <h3>Path Traversal Test Examples:</h3>
          <div className="traversal-examples">
            <button
              onClick={() => handlePathTraversalExample('../config/database.conf')}
              className="traversal-example-button"
            >
              ../config/database.conf
            </button>
            <button
              onClick={() => handlePathTraversalExample('../../etc/passwd')}
              className="traversal-example-button"
            >
              ../../etc/passwd
            </button>
            <button
              onClick={() => handlePathTraversalExample('..\\..\\Windows\\System32\\config\\SAM')}
              className="traversal-example-button"
            >
              ..\\..\\Windows\\System32\\config\\SAM
            </button>
            <button
              onClick={() => handlePathTraversalExample('/etc/shadow')}
              className="traversal-example-button"
            >
              /etc/shadow
            </button>
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

        {fileContent && (
          <div className="file-content-section">
            <h3>File Content:</h3>
            <div className="file-info">
              <p><strong>Filename:</strong> {fileContent.filename}</p>
              <p><strong>Size:</strong> {fileContent.size} bytes</p>
              <p><strong>Type:</strong> {fileContent.type}</p>
            </div>
            <div className="content-display">
              <pre className="file-content">{fileContent.content}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="security-notes">
        <h3>Security Testing Notes:</h3>
        <ul>
          <li>This page simulates file access for path traversal testing</li>
          <li>Try accessing files outside the intended directory</li>
          <li>Test with various path traversal techniques (../, ..\\, etc.)</li>
          <li>Attempt to access system files and sensitive configuration files</li>
          <li>Look for proper input validation and sanitization</li>
        </ul>
      </div>
    </div>
  );
};

export default FileViewer; 