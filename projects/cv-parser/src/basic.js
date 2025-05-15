const axios = require('axios');

(async () => {
    const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'rajni',
        prompt: 'Hi!',
        stream: false
    });
    console.log(response.data.response);
})();