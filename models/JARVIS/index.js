import fs from 'fs';
import { LocalIndex } from 'vectra';
import { Ollama } from 'ollama';
import path from 'path';

const ollama = new Ollama();
const index = new LocalIndex(path.join(process.cwd(), 'index'));

// Initialize index if it doesn't exist
if (!(await index.isIndexCreated())) {
    await index.createIndex();
}

// Read and chunk chats.txt
const text = fs.readFileSync('chats.txt', 'utf-8');
const chunks = text.match(/(.|[\r\n]){1,500}/g); // naive chunking

// Take only first 10 chunks
const firstTenChunks = chunks.slice(0, 10);

// Embed each chunk and store in Vectra
for (const chunk of firstTenChunks) {
  const res = await ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: chunk,
  });
  const embedding = res.embedding;
  await index.insertItem({
    vector: embedding,
    metadata: { text: chunk }
  });
}

// Get query from CLI arg
const question = process.argv.slice(2).join(' ');
if (!question) {
  console.error('❌ Please provide a question.\nUsage: node rag.js "your question here"');
  process.exit(1);
}

// Embed query
const queryEmbed = await ollama.embeddings({
  model: 'nomic-embed-text',
  prompt: question,
});
const qVec = queryEmbed.embedding;

// Retrieve top 5 similar chunks
const results = await index.queryItems(qVec, 5);
const context = results.map(r => r.item.metadata.text).join('\n');

// Ask LLM
const finalPrompt = `Context:\n${context}\n\nAnswer this question: ${question}`;

const answer = await ollama.chat({
  model: 'jarvis',
  messages: [{ role: 'user', content: finalPrompt }],
});

console.log('\n💬 Answer:\n', answer.message.content);
