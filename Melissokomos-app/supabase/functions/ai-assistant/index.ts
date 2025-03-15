// Follow Deno runtime API reference: https://deno.land/api@v1.36.1
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simulated AI responses for beekeeping questions
const beekeepingResponses = {
  default: "I'm your beekeeping assistant. Ask me anything about your hives, bees, or beekeeping practices!",
  greetings: [
    "Hello! How can I assist with your beekeeping today?",
    "Hi there! What beekeeping questions can I help with?",
    "Greetings beekeeper! What can I help you with?"
  ],
  hive: [
    "Regular hive inspections should be conducted every 7-10 days during active season. Look for healthy brood patterns, adequate food stores, and signs of pests or disease.",
    "When inspecting your hive, work calmly and deliberately. Smoke the entrance and under the lid before opening. Always wear protective gear.",
    "The optimal hive temperature is around 35°C (95°F). Bees maintain this temperature by clustering or fanning their wings."
  ],
  disease: [
    "Common bee diseases include American foulbrood, European foulbrood, chalkbrood, and nosema. Regular inspections help catch these early.",
    "Varroa mites are a serious threat to honey bee colonies. Monitor mite levels monthly and treat when thresholds are exceeded.",
    "Signs of disease may include spotty brood patterns, discolored larvae, deformed wings, or unusual bee behavior."
  ],
  honey: [
    "Honey is ready to harvest when frames are at least 80% capped. Test by giving the frame a gentle shake - if no nectar flies out, it's ready.",
    "On average, a strong hive can produce 25-40 pounds of honey per season, depending on location and forage availability.",
    "To extract honey, uncap the cells, place frames in an extractor, filter the honey, and let it settle before bottling."
  ],
  winter: [
    "Prepare hives for winter by ensuring they have 60-90 pounds of honey stores, reducing entrance size, and possibly adding insulation.",
    "During winter, bees form a cluster and vibrate to generate heat. The cluster moves gradually through the hive to access honey stores.",
    "Avoid opening the hive during very cold weather. If you must check, do so quickly on a warmer day when temperatures are above 12°C (55°F)."
  ],
  swarm: [
    "Signs of swarming include queen cells, overcrowding, and bees clustering outside the hive. Regular inspection can help prevent unexpected swarms.",
    "To prevent swarming, ensure adequate space by adding supers, practice queen management, and split strong colonies in spring.",
    "If your hive swarms, try to capture the swarm by placing them in a new hive with drawn comb or foundation and a food source."
  ]
};

function determineCategory(question: string): string {
  question = question.toLowerCase();
  if (/hello|hi |hey|greetings/i.test(question)) return "greetings";
  if (/hive|inspect|check|box|frame|super/i.test(question)) return "hive";
  if (/disease|mite|foulbrood|nosema|parasite|pest|varroa/i.test(question)) return "disease";
  if (/honey|harvest|nectar|extract|bottle|flow/i.test(question)) return "honey";
  if (/winter|cold|prepare|insulate|cluster/i.test(question)) return "winter";
  if (/swarm|queen cell|split|divide/i.test(question)) return "swarm";
  return "default";
}

function getResponse(question: string): string {
  const category = determineCategory(question);
  
  if (category === "default") {
    return beekeepingResponses.default;
  }
  
  const responses = beekeepingResponses[category as keyof typeof beekeepingResponses] as string[];
  return responses[Math.floor(Math.random() * responses.length)];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { question } = await req.json();
    console.log('Received question:', question);
    
    if (!question) {
      return new Response(
        JSON.stringify({ error: 'Question is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get the appropriate response based on the question
    const response = getResponse(question);
    console.log('Generated response:', response);
    
    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
