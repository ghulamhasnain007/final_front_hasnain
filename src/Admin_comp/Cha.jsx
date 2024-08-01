import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FolderUploader = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');
  const [jsContent, setJsContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [consoleLogs, setConsoleLogs] = useState([]);

  const captureConsoleLog = (msg) => {
    setConsoleLogs((prevLogs) => [...prevLogs, msg]);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setErrors([]);
    setConsoleLogs([]);
    
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target.result;

        try {
          if (file.name.endsWith('.html')) {
            setHtmlContent(content);
          } else if (file.name.endsWith('.css')) {
            setCssContent(content);
          } else if (file.name.endsWith('.js')) {
            setJsContent(content);
            // Capture console.log
            const originalConsoleLog = console.log;
            console.log = captureConsoleLog;
            try {
              new Function(content)(); // Evaluate JS code
            } catch (err) {
              setErrors((prevErrors) => [
                ...prevErrors,
                `JavaScript error in ${file.name}: ${err.message}`,
              ]);
            }
            // Restore original console.log
            console.log = originalConsoleLog;
          }
        } catch (err) {
          setErrors((prevErrors) => [
            ...prevErrors,
            `Error processing ${file.name}: ${err.message}`,
          ]);
        }
      };

      reader.onerror = () => {
        setErrors((prevErrors) => [
          ...prevErrors,
          `Error reading file ${file.name}`,
        ]);
      };

      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div>
      <div {...getRootProps()} style={styles.dropzone}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the folder here...</p>
        ) : (
          <p>Drag 'n' drop a folder here, or click to select files</p>
        )}
      </div>

      {/* Render HTML content */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

      {/* Render CSS content */}
      <style>{cssContent}</style>

      {/* Render console logs if any */}
      {consoleLogs.length > 0 && (
        <div style={styles.consoleContainer}>
          <h4>Console Output:</h4>
          <ul>
            {consoleLogs.map((log, index) => (
              <li key={index} style={styles.consoleText}>{log}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Render errors if any */}
      {errors.length > 0 && (
        <div style={styles.errorContainer}>
          <h4>Errors:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index} style={styles.errorText}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  dropzone: {
    border: '2px dashed #0087F7',
    borderRadius: '5px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  consoleContainer: {
    marginTop: '20px',
  },
  consoleText: {
    color: 'green',
  },
  errorContainer: {
    marginTop: '20px',
  },
  errorText: {
    color: 'red',
  },
};

export default FolderUploader;
