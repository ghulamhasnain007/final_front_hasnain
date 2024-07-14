import React, { useState } from 'react';
import axios from 'axios';

const SpellCheckForm = () => {
  const [results, setResults] = useState([]);
  const [prompt, setPrompt] = useState('');
  
  // Predefined array of assignments
  const ass = [
    { text: 'dscd', _id: '6693ef93f6e60d32d7b9757f' },
    { text: 'This i a book', _id: '6693ef93f6e60d32d7b97580' },
    { text: 'This is a boo', _id: '6693ef93f6e60d32d7b97581' },
  ];

  const handleSubmit = async () => {
    try {
      let fullPrompt = prompt;
      
      // Append each assignment's text to the full prompt
      ass.forEach((assignment, index) => {
        fullPrompt += `${index + 1}. ${assignment.text}\n`;
      });

      // Update the prompt state with the full prompt including assignments
      setPrompt(fullPrompt);

      // Sending request with prompt and assignments
      const res = await axios.post('http://localhost:5000/check-assignments', { prompt: fullPrompt, assignments: ass });
      
      // Assuming res.data is an array of objects { _id, score }
      const updatedAssignments = ass.map((assignment, index) => ({
        ...assignment,
        score: res.data[index].score,
      }));

      setResults(updatedAssignments);
      updateScoresInMongoDB(updatedAssignments);

    } catch (error) {
      console.error('Error checking spelling:', error);
      // Handle error gracefully, e.g., show error message to the user
    }
  };

  const updateScoresInMongoDB = async (data) => {
    try {
      const res = await axios.post('http://localhost:5000/update-scores', { assignments : data });
      console.log('Updated in MongoDB:', res.data);
    } catch (error) {
      console.error('Error updating in MongoDB:', error);
      // Handle error updating in MongoDB, e.g., show error message to the user
    }
  };

  return (
    <div>
      <textarea onChange={(e) => setPrompt(e.target.value)} placeholder="Enter prompt here"></textarea><br /><br />
      <button onClick={handleSubmit}>Check Spelling & Update Scores</button>
      {results.length > 0 && (
        <div>
          <h3>Results:</h3>
          {results.map((result, index) => (
            <div key={index}>
              <p>User ID: {result._id} - Score: {result.score}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpellCheckForm;
