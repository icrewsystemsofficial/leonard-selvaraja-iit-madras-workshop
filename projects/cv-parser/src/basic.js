const axios = require('axios');

(async () => {
    const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3.2',
        prompt: 'Hello world',
        stream: false
    });
    console.log(response.data.response);
})();