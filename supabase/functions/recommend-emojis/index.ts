import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { embedding } = await req.json()

    if (!embedding) {
      throw new Error('Missing embedding in request body')
    }

    // 여기 부터는 DB에 접근하기 위해 권한을 체크함
    const supabaseClient = createClient(
      Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') ?? '', // 실행 태스크와 관련된 DB 주소
      Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? '', // DB 주소를 열 열쇠
      {
        global: { // API 요청한 사용자 정보
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    const MODEL_NAME = Deno.env.get('EMBEDDING_MODEL');
    // Call the RPC function 'match_emojis'
    const { data, error } = await supabaseClient.rpc(`match_emojis_${Deno.env.get('EMBEDDING_MODEL')}`, {
      query_embedding: embedding,
      match_threshold: 0.1, // You can make this dynamic if needed
      match_count: 5        // You can make this dynamic if needed
    })

    if (error) {
      console.error('RPC Error:', error)
      throw error
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
