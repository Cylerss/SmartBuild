const axios = require('axios');

// OpenRouter API
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Gemini API as fallback
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Multiple free models to try on OpenRouter (in order of preference)
const OPENROUTER_MODELS = [
  'google/gemma-3-4b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'qwen/qwen-2.5-7b-instruct:free',
];

function buildPrompt(inputs, tab) {
  const { plotSize, budget, location, floors, direction, type, familySize, climate, notes } = inputs;

  const baseContext = `You are an expert Indian home construction planner and architect. Based on the following details, provide a detailed and practical response.

PROJECT DETAILS:
- Plot Size: ${plotSize}
- Budget: ₹${budget}
- Location: ${location}, India
- Number of Floors: ${floors}
- Plot Direction (facing): ${direction || 'Not specified'}
- Construction Type: ${type}
- Family Size: ${familySize || 'Not specified'}
- Climate Zone: ${climate || 'Not specified'}
- Additional Notes: ${notes || 'None'}

IMPORTANT: All costs should be in Indian Rupees (₹). Consider local Indian construction practices, materials, and regulations. Respond in a well-structured format with clear sections and bullet points.`;

  const tabPrompts = {
    summary: `${baseContext}

Generate a COMPREHENSIVE PROJECT SUMMARY with these sections:
1. **Project Overview** - Recommended built-up area, BHK configuration, construction type
2. **Space Planning** - Floor-wise area distribution, room sizes, common areas
3. **Key Highlights** - Best features within budget, space optimization, modern amenities
4. **Regulatory Considerations** - Setback requirements, FAR/FSI, parking provisions

Format each section clearly with headers and bullet points.`,

    cost: `${baseContext}

Generate a DETAILED COST ESTIMATION BREAKDOWN:
1. **Overall Budget Summary** - Total cost, cost per sq ft, allocation percentages
2. **Material-wise Cost Breakdown** in table format (Cement, Steel, Bricks, Sand, Plumbing, Electrical, Flooring, Doors/Windows, Paint, Kitchen, Bathroom, Waterproofing)
3. **Phase-wise Cost** - Foundation, Structure, Brick work, Plastering, Flooring, MEP, Finishing, Interiors
4. **Labor Cost Estimate** - Mason, carpenter, electrician, plumber, painter
5. **Budget-Saving Tips**

All costs in Indian Rupees (₹) at current 2024-25 market rates.`,

    interior: `${baseContext}

Generate INTERIOR DESIGN SUGGESTIONS:
1. **Design Style** - Recommended style and why it suits the project
2. **Room-wise Interior Plan** - For Living Room, Bedrooms, Kitchen, Bathrooms, Dining: color palette, flooring, furniture, lighting, storage
3. **Color Scheme** - Primary, accent, room-specific colors
4. **Lighting Plan** - Natural and artificial lighting per room
5. **Budget-wise Interior Packages** - Essential, Premium, Luxury with costs`,

    vastu: `${baseContext}

Generate a VASTU SHASTRA LAYOUT PLAN:
1. **Plot Analysis** - Direction analysis for ${direction || 'North'}-facing plot
2. **Room Placement Guide** - Main entrance, Living room, Bedrooms, Kitchen, Pooja room, Bathrooms, Staircase
3. **Vastu Rules** - Dos and Don'ts, element placements (water, fire, earth, space)
4. **Vastu Remedies** - Common defects and practical solutions
5. **Floor-wise Vastu Plan**`,

    timeline: `${baseContext}

Generate a CONSTRUCTION TIMELINE:
1. **Overall Duration** - Total time and key milestones
2. **Phase-wise Timeline**:
   - Pre-Construction, Foundation, Structure, Finishing Phase 1 & 2, Final Finishing, Handover
3. **Seasonal Considerations** - Best months for ${location}, monsoon precautions
4. **Inspection Checkpoints** - Critical quality checks per phase

Provide realistic timelines for Indian construction.`
  };

  return tabPrompts[tab] || tabPrompts.summary;
}

// Retry helper with exponential backoff
async function retryWithBackoff(fn, maxRetries = 1, baseDelay = 2000) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRateLimit = error.response?.status === 429;
      const isServerError = error.response?.status >= 500;
      
      if ((isRateLimit || isServerError) && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`⏳ Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

// Try OpenRouter with multiple model fallbacks
async function callOpenRouter(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.log('⚠️ No OpenRouter API key found');
    return null;
  }

  for (const model of OPENROUTER_MODELS) {
    try {
      console.log(`  📡 Trying model: ${model}`);
      
      const response = await axios.post(OPENROUTER_API_URL, {
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://smartbuild-ai.vercel.app',
          'X-Title': 'SmartBuild AI',
        },
        timeout: 120000
      });

      if (response.data?.choices?.[0]?.message?.content) {
        console.log(`  ✅ Model ${model} responded successfully`);
        return {
          content: response.data.choices[0].message.content,
          model: response.data.model || model,
        };
      }
      
      console.log(`  ⚠️ Model ${model} returned empty content, trying next...`);
      
    } catch (error) {
      const status = error.response?.status;
      const errMsg = error.response?.data?.error?.message || error.response?.data?.error || error.message;
      console.log(`  ❌ Model ${model} failed (HTTP ${status}): ${typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg}`);
      
      if (status === 401 || status === 403) {
        console.log('  🔑 API key is invalid, skipping remaining OpenRouter models');
        throw error;
      }
      
      continue;
    }
  }
  
  return null;
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    console.log('⚠️ No Gemini API key found');
    return null;
  }

  const response = await axios.post(
    `${GEMINI_API_URL}?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      }
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000
    }
  );

  if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return {
      content: response.data.candidates[0].content.parts[0].text,
      model: 'gemini-2.0-flash',
    };
  }
  return null;
}

module.exports = async (req, res) => {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plotSize, budget, location, floors, direction, type, familySize, climate, notes, tab } = req.body;

    // Validate required fields
    if (!plotSize || !budget || !location || !floors || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['plotSize', 'budget', 'location', 'floors', 'type']
      });
    }

    if (!tab) {
      return res.status(400).json({ error: 'Tab parameter is required' });
    }

    const validTabs = ['summary', 'cost', 'interior', 'vastu', 'timeline'];
    if (!validTabs.includes(tab)) {
      return res.status(400).json({ error: `Invalid tab. Must be one of: ${validTabs.join(', ')}` });
    }

    const prompt = buildPrompt(req.body, tab);

    const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;
    const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE';

    if (!hasOpenRouter && !hasGemini) {
      return res.status(500).json({ error: 'No API key configured.' });
    }

    // Define the order of providers to try
    const providers = [];
    if (hasOpenRouter) providers.push({ name: 'OpenRouter', fn: () => callOpenRouter(prompt) });
    if (hasGemini) providers.push({ name: 'Gemini', fn: () => callGemini(prompt) });

    let lastError = null;

    for (const provider of providers) {
      try {
        console.log(`🤖 Trying ${provider.name}...`);
        const result = await retryWithBackoff(provider.fn, 1, 2000);
        if (result) {
          console.log(`✅ ${provider.name} responded successfully (model: ${result.model})`);
          return res.status(200).json({ success: true, data: { tab, content: result.content, model: result.model } });
        }
        console.log(`⚠️ ${provider.name} returned no result, trying next provider...`);
      } catch (error) {
        console.error(`❌ ${provider.name} failed:`, error.message);
        lastError = error;
      }
    }

    // All providers failed
    res.status(500).json({ 
      error: 'Failed to generate plan from any provider.',
      message: lastError?.message 
    });

  } catch (error) {
    console.error('AI API Error:', error.message);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
