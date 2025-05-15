# Leonard - AI Models & Projects (IIT Madras)

Follow [Leonard Selvaraja](https://www.linkedin.com/in/leonardselvaraja/) on LinkedIn for more updates about AI

## ⚠️ AI Workshop at IIT Madras Research Park!

Go from 0 to 1 with AI. Build and integrate AI – locally, offline, and hands-on.

**Why This Matters:**
- Clients want AI in their products
- Developers want AI in their stack
- Students want to build beyond just using ChatGPT

This workshop, happening at the heart of innovation and technology at IIT Madras Research Park, is designed to answer the question: "Where do I even begin?"

**Organizers:** 
icrewsystems × Makers Tribe × Chennai Freelancers Club × IIT Madras Research Park (IITMRP)

## Project Structure

```
leonard-iit-madras/
├── models/                # Custom LLM model implementations
│   ├── JARVIS/           # RAG-based assistant using Ollama and Vectra
│   ├── Doctor/           # Medical domain-specific model
│   ├── Mario/            # Custom Llama 3.2 model
│   └── Rajni/            # Another specialized model
│
└── projects/             # Practical AI applications
    ├── cv-parser/        # Automated CV parsing and screening system
    ├── downloads-folder-sorter/ # File organization automation
    └── spends-analyser/  # Financial analysis tool
```

## Models

The project contains several locally-hosted AI models built using Ollama. Each model is designed for specific use cases:

### JARVIS
A Retrieval-Augmented Generation (RAG) system that:
- Uses Vectra for local vector storage
- Implements semantic search on document chunks
- Leverages Ollama with Llama 3.2 for responses
- Uses nomic-embed-text for embeddings

### Other Models
- **Mario**: Llama 3.2 model, fine-tuned to behave like Mario from "Super Mario Bros"
- **Rajni**: Llama 3.2 model, fine-tuned to behave like South Indian movie star.
- **Doctor**: Medical domain specialist, helps doctors study with pneumonics

## Projects

### CV Parser
A Node.js application that:
- Processes PDF resumes from the `/candidates` folder
- Converts them to structured JSON format
- Automatically screens candidates based on education qualifications
- Generates custom emails and interview questions for qualified candidates

### Other Projects
- **Downloads Folder Sorter**: Organizes files based on type and other criteria
- **Spends Analyser**: Analyses and categorizes financial transactions

## Getting Started

### Prerequisites
- [Ollama](https://ollama.ai/) for running local LLMs
- Node.js and npm for the projects

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/leonard-iit-madras.git
cd leonard-iit-madras
```

2. Set up a model (example: JARVIS):
```
cd models/JARVIS
npm install
ollama create jarvis-llama3.2 -f Modelfile
```

3. Run a model:
```
node index.js "Your question here"
```

## Future Development

- Integration with additional LLM models
- Expanding the RAG capabilities with more data sources
- Building web interfaces for the projects

## Background & Inspiration

The inspiration for this project came from witnessing the global AI transformation. At the Dubai AI Festival, we saw 8+ powerful startups run by students and backed by the government. In Dubai, AI isn't just hype—it's policy, curriculum, and infrastructure, with a dedicated minister and ministry for AI.

We see the same shift happening in India, where students, developers, and businesses are all looking to meaningfully integrate AI into their work. This project is our response to bridge the gap between AI potential and practical implementation.

## Contributors

- [Leonard Selvaraja](https://github.com/ifly-leonard)
- [icrewsystems](https://github.com/icrewsystemsofficial)
- [IIT Madras Research Park](https://www.iitm.ac.in/research-park/iitm-research-park)
- Special thanks to Jaya Shakthi Kannan and Aravintha S for identifying the gap and pushing to address it

## License

This project is licensed under the MIT License - see the LICENSE file for details.
