const fetch = require('node-fetch');

const OLLAMA_API = 'http://localhost:11434/api/generate';

// Default prompts that can be overridden
const DEFAULT_PROMPTS = {
    cvAnalysis: `Analyze this CV and extract the following information in JSON format:
    {
        "name": "full name",
        "email": "email address",
        "phone": "phone number",
        "education": [list of degrees with institutions],
        "skills": [list of technical skills],
        "experience": [list of work experiences]
    }`,
    
    degreeCheck: `Given this education information, determine if the person has a Bachelor's degree in Computer Science or related field (like B.Tech in Computer Science, B.E. in Computer Science, etc.). Answer with just "yes" or "no".`,
    
    interviewQuestions: `Based on this candidate's profile, generate 5 specific and relevant technical interview questions. Focus on their skills and experience. Format the response as a JSON array of strings.`,
    
    emailGeneration: `Write a professional email to invite this candidate for an interview. The email should be personalized based on their skills and experience. Keep it concise and professional.`
};

async function queryOllama(prompt, model = 'llama2', options = {}) {
    try {
        const response = await fetch(OLLAMA_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false,
                ...options
            })
        });

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error querying Ollama:', error);
        throw error;
    }
}

async function analyzeCV(text, customPrompt = null) {
    const prompt = customPrompt || DEFAULT_PROMPTS.cvAnalysis;
    const fullPrompt = `${prompt}\n\nCV Text:\n${text}`;

    const response = await queryOllama(fullPrompt);
    try {
        return JSON.parse(response);
    } catch (error) {
        console.error('Error parsing Ollama response:', error);
        return null;
    }
}

async function checkCSDegree(education, customPrompt = null) {
    const prompt = customPrompt || DEFAULT_PROMPTS.degreeCheck;
    const fullPrompt = `${prompt}\n\nEducation Information:\n${JSON.stringify(education)}`;

    const response = await queryOllama(fullPrompt);
    return response.toLowerCase().includes('yes');
}

async function generateInterviewQuestions(candidateData, customPrompt = null) {
    const prompt = customPrompt || DEFAULT_PROMPTS.interviewQuestions;
    const fullPrompt = `${prompt}\n\nCandidate Profile:\n${JSON.stringify(candidateData)}`;

    const response = await queryOllama(fullPrompt);
    try {
        return JSON.parse(response);
    } catch (error) {
        console.error('Error parsing questions:', error);
        return [];
    }
}

async function generateCustomEmail(candidateData, customPrompt = null) {
    const prompt = customPrompt || DEFAULT_PROMPTS.emailGeneration;
    const fullPrompt = `${prompt}\n\nCandidate Profile:\n${JSON.stringify(candidateData)}`;

    return await queryOllama(fullPrompt);
}

// Function to update default prompts
function updateDefaultPrompt(type, newPrompt) {
    if (DEFAULT_PROMPTS.hasOwnProperty(type)) {
        DEFAULT_PROMPTS[type] = newPrompt;
    } else {
        throw new Error(`Unknown prompt type: ${type}`);
    }
}

module.exports = {
    analyzeCV,
    checkCSDegree,
    generateInterviewQuestions,
    generateCustomEmail,
    updateDefaultPrompt,
    DEFAULT_PROMPTS
}; 