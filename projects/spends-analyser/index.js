const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const axios = require('axios');
const readline = require('readline');

const SMS_DIR = path.join(__dirname, 'sms');
const OLLAMA_API = 'http://localhost:11434/api/generate';

async function parseXML(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return xml2js.parseStringPromise(data);
}

async function queryOllama(prompt) {
    try {
        const res = await axios.post(OLLAMA_API, {
            model: 'llama2',
            prompt,
            stream: true
        }, { responseType: 'stream' });

        res.data.on('data', chunk => {
            chunk.toString().split('\n').forEach(line => {
                if (!line.trim()) return;
                try {
                    const data = JSON.parse(line);
                    if (data.response) process.stdout.write(data.response);
                } catch (_) {}
            });
        });

        return new Promise(resolve => {
            res.data.on('end', () => resolve('\n\nAnalysis completed.'));
        });
    } catch (err) {
        console.error('Ollama error:', err.message);
    }
}

async function analyzeSMS() {
    try {
        const files = fs.readdirSync(SMS_DIR).filter(f => f.endsWith('.xml'));
        let messages = [];

        for (const file of files) {
            const result = await parseXML(path.join(SMS_DIR, file));
            messages.push(...(result.smses?.sms || []));
            if (messages.length >= 100) break;
        }

        const formatted = messages.slice(0, 100).map(m => {
            const { address, body, date } = m.$;
            return `From: ${address || 'Unknown'}\nDate: ${new Date(+date).toLocaleString()}\nContent: ${body}`;
        }).join('\n\n');

        // const prompt = `Here are 10 SMS messages from my phone:\n\n${formatted}\n\nPlease extract and list all spending 
        // transactions **date-wise**, mentioning the amount, recipient, and purpose (if identifiable). Also, highlight any 
        // recurring payments, possible subscriptions, or suspicious messages. Finally, suggest ways to optimize my spending.`;

        const prompt = `System: You are a personal assistant analyzing synthetic SMS data.\n\nUser: Here are some messages from my phone:\n\n${formatted}\n\nExtract 
        date-wise spends with amount, recipient, and purpose. You are to strictly ignore any messages that have codes or OTPs in them. IF it's a message that's not related to sa send, ignore it.`;
    
        console.log('\nAnalyzing messages...\n');
        const result = await queryOllama(prompt);
        console.log('\n' + result);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('Text Analysis Tool');
    console.log('-----------------');
    console.log('1. Enter text directly');
    console.log('2. Read from file');
    
    rl.question('Choose an option (1 or 2): ', async (option) => {
        let text;
        
        if (option === '1') {
            text = await new Promise(resolve => {
                rl.question('Enter your text (press Enter twice to finish):\n', (input) => {
                    resolve(input);
                });
            });
        } else if (option === '2') {
            const filename = await new Promise(resolve => {
                rl.question('Enter the file path: ', (path) => {
                    resolve(path);
                });
            });
            
            try {
                text = fs.readFileSync(filename, 'utf8');
            } catch (err) {
                console.error('Error reading file:', err.message);
                rl.close();
                return;
            }
        } else {
            console.log('Invalid option');
            rl.close();
            return;
        }

        console.log('\nAnalyzing text...\n');
        await queryOllama(text);
        rl.close();
    });
}

analyzeSMS();
main().catch(console.error);
