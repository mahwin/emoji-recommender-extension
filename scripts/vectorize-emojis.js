const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    console.error("Usage: GEMINI_API_KEY=your_key_here node scripts/vectorize-emojis.js");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

const INPUT_FILE = path.join(__dirname, "../rawData/emojis_v12.json");
const OUTPUT_FILE = path.join(__dirname, "../rawData/emojis_with_embeddings.json");

async function vectorize() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Error: Input file not found at ${INPUT_FILE}`);
        process.exit(1);
    }

    const emojis = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));
    console.log(`Loaded ${emojis.length} emojis. Starting vectorization...`);

    const results = [];
    const BATCH_SIZE = 10; // Process in small batches to avoid rate limits

    for (let i = 0; i < emojis.length; i += BATCH_SIZE) {
        const batch = emojis.slice(i, i + BATCH_SIZE);

        try {
            const promises = batch.map(async (item) => {
                const text = item.annotation;
                const result = await model.embedContent(text);
                const embedding = result.embedding.values;
                return {
                    ...item,
                    embedding: embedding
                };
            });

            const batchResults = await Promise.all(promises);
            results.push(...batchResults);

            process.stdout.write(`\rProcessed ${results.length}/${emojis.length} emojis...`);

            // Simple rate limiting delay
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`\nError processing batch starting at index ${i}:`, error.message);
            // Continue or break based on preference. Here we'll try to continue.
        }
    }

    console.log("\nVectorization complete.");

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`Saved vectorized data to ${OUTPUT_FILE}`);
}

vectorize();
