const fetch = require('node-fetch');

const testSubmitScore = async () => {
  const response = await fetch('http://localhost:3000/api/scores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      projectId: 'replace-with-a-valid-project-id',
      judgeName: 'Judge 1',
      fit: 8,
      innovation: 9,
      functionality: 7,
      presentation: 8,
    }),
  });

  const data = await response.json();
  console.log('Response:', data);
};

testSubmitScore();
