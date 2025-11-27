import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, severity, notes } = await req.json();
    
    console.log("Analyzing symptoms:", { symptoms, severity, notes });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a medical symptom analyzer AI. Based on the symptoms provided, analyze and suggest possible conditions.
    
IMPORTANT: You are NOT providing medical diagnosis. You are providing educational information about possible conditions that match the symptoms.
Always recommend consulting a healthcare professional for proper diagnosis and treatment.

Analyze the symptoms and return 3-5 possible conditions ranked by likelihood.`;

    const userPrompt = `Analyze these symptoms and suggest possible conditions:

Symptoms: ${symptoms.join(", ")}
Severity: ${severity}
${notes ? `Additional Notes: ${notes}` : ""}

Provide 3-5 possible conditions that match these symptoms, ranked by likelihood.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_diagnoses",
              description: "Return a list of possible medical conditions based on the symptoms",
              parameters: {
                type: "object",
                properties: {
                  diagnoses: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        disease: { type: "string", description: "Name of the condition/disease" },
                        description: { type: "string", description: "Brief description of the condition (2-3 sentences)" },
                        commonSymptoms: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Common symptoms associated with this condition"
                        },
                        medicines: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Common treatments or medications (OTC or general categories)"
                        },
                        confidence: { 
                          type: "number", 
                          description: "Confidence score between 0 and 1 based on symptom match" 
                        },
                        urgency: {
                          type: "string",
                          enum: ["low", "medium", "high"],
                          description: "How urgently the person should seek medical care"
                        }
                      },
                      required: ["disease", "description", "commonSymptoms", "medicines", "confidence", "urgency"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["diagnoses"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "return_diagnoses" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data, null, 2));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const result = JSON.parse(toolCall.function.arguments);
    console.log("Parsed diagnoses:", result.diagnoses?.length);

    return new Response(
      JSON.stringify({ diagnoses: result.diagnoses }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-symptoms:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
