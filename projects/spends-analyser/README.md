# SMS Analyzer

A simple Node.js application that analyzes SMS messages using Ollama's AI capabilities.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Place your SMS XML files in the `sms` directory

3. Make sure Ollama is running locally (default port: 11434)

## Usage

Run the analyzer:
```bash
npm start
```

The program will:
1. Read all XML files from the `sms` directory
2. Parse each SMS message
3. Send the messages to Ollama for analysis
4. Display the results in the console

## Requirements

- Node.js
- Ollama running locally
- SMS XML files in the correct format
