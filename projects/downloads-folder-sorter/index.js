const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const downloads = path.join(process.env.HOME, 'Downloads');

async function sort() {
    // Get all files from Downloads
    const files = await fs.readdir(downloads);
    
    // For each file, ask Ollama where it should go
    for (const file of files) {
        try {
            // Ask Ollama
            const response = await axios.post('http://localhost:11434/api/generate', {
                model: 'llama2',
                prompt: `Where should I put this file? ${file}`,
                stream: false
            });
            
            // Get the folder name from Ollama's response
            const folder = response.data.response.trim().toLowerCase();
            
            // Create folder if it doesn't exist
            const folderPath = path.join(downloads, folder);
            await fs.mkdir(folderPath, { recursive: true });
            
            // Move the file
            await fs.rename(
                path.join(downloads, file),
                path.join(folderPath, file)
            );
            
            console.log(`Moved ${file} to ${folder}`);
        } catch (error) {
            console.log(`Couldn't move ${file}: ${error.message}`);
        }
    }
}

sort(); 