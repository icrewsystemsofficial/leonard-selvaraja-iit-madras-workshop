const fs = require('fs');
const pdf = require('pdf-parse');
const axios = require('axios');

async function extractText(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  console.log('CV contents extracted. Size:' + data.text.length);
  return data.text;
}

(async () => {
  console.log('Starting...'); 
  const cv_contents_extracted_as_text = await extractText('./candidates/2.pdf');

//   console.log(cv_contents_extracted_as_text);

const prompt = `
<instructions>
    You are a HR assistant. Your job is to help me analyse profiles. I will provide you extracted text contents of a CV
    you will parse it in a JSON format. Double check the information you extract, if you 
    don't have some information, just put "N/A" in the response. I need the response to be simple and brief. Keep the structure of the response as it is.
    Don't add additional objects inside each field.

    JSON response format:
    {
        "name": "full name",
        "email": "email address",
        "phone": "phone number",
        "education": [list of degrees with institutions],
        "skills": [simple list of technical skills],
        "experience": [simple list of work experiences]
    }
</instructions>
<reference>
CV contents of the candidate: 
---
${cv_contents_extracted_as_text}
</reference>
`;

  // Modify the askOllama function call to stream the results
  const response = await axios.post('http://localhost:11434/api/generate', {
    model: 'llama3.2',
    prompt: prompt,
    stream: true
  }, {
    responseType: 'stream'
  });

  console.log('Streaming response:');
  
  // Process the streaming response
  response.data.on('data', chunk => {
    try {
      const lines = chunk.toString().split('\n').filter(line => line.trim());
      for (const line of lines) {
        const data = JSON.parse(line);
        if (data.response) {
          process.stdout.write(data.response);
        }
      }
    } catch (error) {
      console.error('Error parsing streaming response:', error.message);
    }
  });

  // Wait for the stream to complete
  await new Promise(resolve => {
    response.data.on('end', resolve);
  });
  console.log('\n\nStreaming completed.');
})();
