import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers';

// Singleton to hold the pipeline
let embeddingPipeline: FeatureExtractionPipeline | null = null;

export const getEmbeddingPipeline = async () => {
    if (!embeddingPipeline) {
        embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
            quantized: false,
        }) as unknown as FeatureExtractionPipeline;
    }
    return embeddingPipeline;
};

export const generateEmbedding = async (text: string) => {
    const pipe = await getEmbeddingPipeline();
    if (!pipe) throw new Error("Pipeline not initialized");
    const output = await pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
};
