const fs = require('fs').promises;
const path = require('path');

const downloads = path.join(process.env.HOME, 'Downloads');

// File extension categories
const extensionCategories = {
    documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt', '.xls', '.xlsx', '.ppt', '.pptx', '.xml'],
    images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff'],
    videos: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'],
    audio: ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'],
    archives: ['.zip', '.rar', '.7z', '.tar', '.gz', '.dmg'],
    code: ['.js', '.py', '.java', '.cpp', '.html', '.css', '.php', '.rb', '.ts']
};

function categorizeExtension(extension) {
    for (const [category, extensions] of Object.entries(extensionCategories)) {
        if (extensions.includes(extension.toLowerCase())) {
            return category;
        }
    }
    return 'other';
}

async function sort() {
    // Get all files from Downloads
    const files = await fs.readdir(downloads);
    
    console.log('Automatically sorting Downloads folder...');
    
    // Define the categories we want to use
    const categories = ['documents', 'images', 'videos', 'audio', 'archives', 'code', 'other'];
    
    // Create category folders if they don't exist
    for (const category of categories) {
        const folderPath = path.join(downloads, category);
        await fs.mkdir(folderPath, { recursive: true });
    }
    
    let movedCount = 0;
    
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    // Filter files from yesterday
    const filesToProcess = [];
    for (const file of files) {
        const filePath = path.join(downloads, file);
        try {
            const stats = await fs.stat(filePath);
            if (!stats.isDirectory()) {
                const fileDate = new Date(stats.mtime);
                if (fileDate >= yesterday && fileDate < new Date(yesterday.getTime() + 24 * 60 * 60 * 1000)) {
                    filesToProcess.push(file);
                }
            }
        } catch (error) {
            console.log(`Couldn't check date for ${file}: ${error.message}`);
        }
    }
    
    // Sort each file based on its extension
    for (const file of filesToProcess) {
        try {
            // Skip folders
            const filePath = path.join(downloads, file);
            const stats = await fs.stat(filePath);
            if (stats.isDirectory()) continue;
            
            const extension = path.extname(file).toLowerCase();
            
            // Use AI to categorize the file
            const targetCategory = categorizeExtension(extension);
            
            // Skip if the file is already in the right folder
            if (file === targetCategory) continue;
            
            // Move the file to the appropriate category folder
            const targetPath = path.join(downloads, targetCategory, file);
            await fs.rename(filePath, targetPath);
            
            console.log(`Moved ${file} to ${targetCategory}/`);
            movedCount++;
            
        } catch (error) {
            console.log(`Couldn't process ${file}: ${error.message}`);
        }
    }
    
    console.log(`\nSorting complete! Moved ${movedCount} files into category folders.`);
}

sort();