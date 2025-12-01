require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase URL or Key in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_FILE = path.join(__dirname, 'rawData/emojis_with_embeddings.json');

async function seedEmojis() {
    if (!fs.existsSync(DATA_FILE)) {
        console.error(`Error: Data file not found at ${DATA_FILE}`);
        process.exit(1);
    }

    const emojis = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log(`Loaded ${emojis.length} emojis. Starting seed...`);

    const BATCH_SIZE = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < emojis.length; i += BATCH_SIZE) {
        const batch = emojis.slice(i, i + BATCH_SIZE).map(item => ({
            emoji_id: item.emoji,
            description: item.annotation,
            embedding: item.embedding,
            version: item.version
        }));

        const { error } = await supabase
            .from('emojis')
            .upsert(batch, { onConflict: 'emoji_id' });

        if (error) {
            console.error(`Error inserting batch ${i}:`, error.message);
            errorCount += batch.length;
        } else {
            successCount += batch.length;
            process.stdout.write(`\rInserted ${successCount}/${emojis.length} emojis...`);
        }
    }

    console.log('\nSeed complete.');
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
}

seedEmojis();
