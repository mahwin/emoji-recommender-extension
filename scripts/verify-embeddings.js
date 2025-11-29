const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../rawData/emojis_with_embeddings.json');

if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Total items: ${data.length}`);
    if (data.length > 0) {
        const firstItem = data[0];
        console.log('First item structure:');
        console.log('Annotation:', firstItem.annotation);
        console.log('Emoji:', firstItem.emoji);
        console.log('Version:', firstItem.version);
        console.log('Embedding length:', firstItem.embedding ? firstItem.embedding.length : 'Missing');
    }
} else {
    console.log('File not found');
}
