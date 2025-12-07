"use client";

import { useState } from "react";
import { generateEmbedding } from "@/features/embedding/model";
import { supabase } from "@/shared/lib/supabase";

export default function TestEmbeddingPage() {
    const [text, setText] = useState("");
    const [embedding, setEmbedding] = useState<number[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!text.trim()) return;

        try {
            setLoading(true);
            setError(null);
            setRecommendations([]);

            // 1. Generate Embedding
            const vector = await generateEmbedding(text);
            setEmbedding(vector);

            // 2. Call RPC
            console.log('call rpc')
            const { data, error } = await supabase.rpc('match_emojis_minilm', {
                query_embedding: vector,
                match_threshold: 0.1, // Adjust as needed
                match_count: 10,
            });

            console.log(data);
            if (error) throw error;

            setRecommendations(data || []);
        } catch (err: any) {
            console.error("Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Emoji Recommendation Test</h1>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 border p-2 rounded text-black"
                    placeholder="Enter text (e.g., happy, sad, fire)..."
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading || !text}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                    {loading ? "Generating..." : "Recommend"}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {recommendations.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Recommended Emojis</h2>
                    <ul className="space-y-2 flex list-none">
                        {recommendations.map((item, idx) => (
                            <li key={idx}>
                                <span className="text-4xl p-4">{item.emoji_id}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
