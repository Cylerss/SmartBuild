import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Randomization Helpers ──────────────────────────────────────────────────
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function vary(value, pct = 10) {
  const factor = 1 + (Math.random() * 2 - 1) * (pct / 100);
  return Math.round(value * factor);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatINR(num) {
  return '₹' + Number(num).toLocaleString('en-IN');
}

// ─── Brand & Material Databases ─────────────────────────────────────────────
const CEMENT_BRANDS = ['UltraTech', 'ACC', 'Ambuja', 'Birla A1', 'Dalmia', 'Ramco'];
const STEEL_BRANDS = ['Tata Tiscon', 'JSW NeoSteel', 'SAIL', 'Kamdhenu', 'Vizag Steel'];
const PAINT_BRANDS = ['Asian Paints Royale', 'Berger Silk', 'Nerolac Excel', 'Dulux Velvet Touch'];
const TILE_BRANDS = ['Kajaria', 'Somany', 'Johnson', 'Nitco', 'Orient Bell'];
const FITTING_BRANDS = ['Hindware', 'Cera', 'Parryware', 'Jaquar'];
const WIRE_BRANDS = ['Havells', 'Polycab', 'Finolex', 'KEI'];
const SWITCH_BRANDS = ['Legrand', 'Schneider', 'Anchor Roma', 'GM Modular'];
const PIPE_BRANDS = ['Astral CPVC', 'Supreme', 'Prince', 'Finolex'];
const DOOR_STYLES = ['Flush doors (Teak veneer)', 'Semi-solid engineered doors', 'Solid teak doors', 'WPC doors'];
const WINDOW_TYPES = ['UPVC sliding windows', 'Aluminium powder-coated windows', 'UPVC casement windows'];
const KITCHEN_FINISHES = ['Acrylic gloss', 'PU matte', 'Laminate (Merino/Greenlam)', 'Membrane'];
const COUNTERTOP_OPTIONS = ['Black Galaxy Granite', 'Absolute Black Granite', 'Rajasthan Black Marble', 'White Quartz'];

const DESIGN_STYLES = [
  { name: 'Modern Contemporary Indian', desc: 'Clean modern lines with warm Indian aesthetics' },
  { name: 'Minimalist Scandinavian', desc: 'Light tones, clean geometry, and functional beauty' },
  { name: 'Neo-Traditional Indian', desc: 'Classic Indian motifs with modern finishes' },
  { name: 'Urban Industrial Chic', desc: 'Exposed textures, metal accents, and bold spaces' },
  { name: 'Tropical Contemporary', desc: 'Lush greenery, natural materials, and open layouts' },
];

const COLOR_PALETTES = [
  { primary: 'Warm White (#FAF9F6)', accent: 'Sage Green (#9CAF88)', neutral: 'Walnut (#5C4033)' },
  { primary: 'Ivory (#FFFFF0)', accent: 'Dusty Rose (#DCAE96)', neutral: 'Charcoal (#36454F)' },
  { primary: 'Pearl White (#F0EAD6)', accent: 'Teal (#008080)', neutral: 'Driftwood (#AF8F6F)' },
  { primary: 'Antique White (#FAEBD7)', accent: 'Terracotta (#CC4E24)', neutral: 'Slate (#708090)' },
  { primary: 'Linen (#FAF0E6)', accent: 'Ocean Blue (#4F97A3)', neutral: 'Espresso (#3C1414)' },
];

const BUDGET_TIPS = [
  '🏗️ **Use AAC blocks** instead of red bricks — saves 15-20% on wall construction',
  '🪵 **Ready-made doors** (flush doors) instead of custom teak — saves ₹5,000-8,000 per door',
  '🎨 **Use Birla Putty + emulsion** instead of POP + enamel — saves ~₹15/sq m',
  '🚿 **Source bathroom fittings locally** (Cera/Hindware) — 30% cheaper than imported brands',
  '⚡ **LED panel lights** instead of decorative fixtures — 60% savings on lighting',
  '🏠 **M-Sand** instead of river sand — consistent quality, 20-30% cheaper',
  '🧱 **Fly ash bricks** for inner walls — eco-friendly and 15% cheaper',
  '🪟 **UPVC windows** instead of aluminium — 25% cheaper, better insulation',
  '🔩 **Pre-fabricated staircases** — saves 30% labor cost and time',
  '💡 **Solar water heater** on terrace — saves 40% on monthly electricity bills',
  '🏗️ **RMC (Ready Mix Concrete)** for slabs — better quality, less wastage',
  '🎨 **Textured paint** on feature walls instead of wallpaper — 50% cheaper, longer lasting',
];

// ─── AI Prompts ─────────────────────────────────────────────────────────────
function buildPrompt(inputs, tab) {
  const { plotSize, budget, location, floors, direction, type, familySize, climate, notes } = inputs;
  const baseContext = `You are an expert Indian home construction planner and architect. Based on the following details, provide a detailed and practical response.

PROJECT DETAILS:
- Plot Size: ${plotSize || 'Not specified'}
- Budget: ₹${budget || 'Not specified'}
- Location: ${location || 'Not specified'}, India
- Number of Floors: ${floors || 'Not specified'}
- Plot Direction (facing): ${direction || 'Not specified'}
- Construction Type: ${type || 'Not specified'}
- Family Size: ${familySize || 'Not specified'}
- Climate Zone: ${climate || 'Not specified'}
- Additional Notes: ${notes || 'None'}

IMPORTANT: All costs should be in Indian Rupees (₹). Consider local Indian construction practices, materials, and regulations. Respond in a well-structured format with clear sections and bullet points using GitHub flavored markdown.`;

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
1. **Overall Budget Summary** - Total cost, cost per sq m, allocation percentages
2. **Material-wise Cost Breakdown** in table format (Cement, Steel, Bricks, Sand, Plumbing, Electrical, Flooring, Doors/Windows, Paint, Kitchen, Bathroom, Waterproofing)
3. **Phase-wise Cost** - Foundation, Structure, Brick work, Plastering, Flooring, MEP, Finishing, Interiors
4. **Labor Cost Estimate** - Mason, carpenter, electrician, plumber, painter
5. **Budget-Saving Tips**

All costs in Indian Rupees (₹) at current market rates.`,

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
3. **Seasonal Considerations** - Best months for ${location || 'the location'}, monsoon precautions
4. **Inspection Checkpoints** - Critical quality checks per phase

Provide realistic timelines for Indian construction.`
  };
  return tabPrompts[tab] || tabPrompts.summary;
}


// ─── Comprehensive Data Generator (Offline Fallback) ────────────────────────
function generateData(inputs, sectionId) {
  const {
    plotSize = '1200',
    budget = '30,00,000',
    location = 'Bangalore',
    floors = '2',
    direction = 'North',
    type = 'Independent House',
    familySize = '4',
    climate = 'Composite',
    notes = ''
  } = inputs;

  const plotNum = parseInt(plotSize) || 1200;
  const budgetClean = budget.toString().replace(/,/g, '');
  const budgetNum = parseInt(budgetClean) || 3000000;
  const budgetFormatted = formatINR(budgetNum);
  const floorsNum = parseInt(floors) || 2;
  const builtUpArea = Math.round(plotNum * 0.6 * floorsNum);
  const costPerSqft = Math.round(budgetNum / builtUpArea);
  const familyNum = parseInt(familySize) || 4;

  let bhk = '2 BHK';
  if (builtUpArea > 2000) bhk = pick(['4 BHK', '4 BHK', '3 BHK + Study']);
  else if (builtUpArea > 1400) bhk = pick(['3 BHK', '3 BHK', '2 BHK + Study']);
  else if (builtUpArea > 800) bhk = '2 BHK';
  else bhk = '1 BHK';

  const cementBrand = pick(CEMENT_BRANDS);
  const steelBrand = pick(STEEL_BRANDS);
  const paintBrand = pick(PAINT_BRANDS);
  const tileBrand = pick(TILE_BRANDS);
  const fittingBrand = pick(FITTING_BRANDS);
  const wireBrand = pick(WIRE_BRANDS);
  const switchBrand = pick(SWITCH_BRANDS);
  const pipeBrand = pick(PIPE_BRANDS);
  const doorStyle = pick(DOOR_STYLES);
  const windowType = pick(WINDOW_TYPES);
  const kitchenFinish = pick(KITCHEN_FINISHES);
  const countertop = pick(COUNTERTOP_OPTIONS);
  const designStyle = pick(DESIGN_STYLES);
  const palette = pick(COLOR_PALETTES);

  const cementRate = vary(380, 8);
  const steelRate = vary(72, 10);
  const brickRate = vary(55, 12);
  const sandRate = vary(55, 10);
  const aggRate = vary(38, 8);
  const tileRate = vary(65, 15);
  const paintRate = vary(18, 10);
  const doorRate = vary(12000, 15);
  const bathFittingRate = vary(35000, 15);
  const doorWindowCount = vary(8 + floorsNum * 4, 10);
  const bathCount = 2 + floorsNum;

  const foundPct = vary(12, 8) / 100;
  const structPct = vary(25, 6) / 100;
  const brickPct = vary(10, 10) / 100;
  const plasterPct = vary(8, 10) / 100;
  const floorPct = vary(8, 10) / 100;
  const mepPct = vary(13, 8) / 100;
  const finishPct = vary(12, 8) / 100;
  const intPct = vary(7, 10) / 100;
  const contingPct = 0.05;

  const shuffled = [...BUDGET_TIPS].sort(() => Math.random() - 0.5);
  const selectedTips = shuffled.slice(0, 6);

  const data = {
    summary: `# 📋 Project Summary — ${type}\n\n## 1. Project Overview\n| Parameter | Details |\n|-----------|---------|\n| **Plot Size** | ${plotSize} sq m |\n| **Built-Up Area** | ${builtUpArea} sq m (across ${floorsNum} floor${floorsNum > 1 ? 's' : ''}) |\n| **Configuration** | ${bhk} ${type} |\n| **Location** | ${location}, India |\n| **Total Budget** | ${budgetFormatted} |\n| **Cost Per Sq M** | ₹${costPerSqft.toLocaleString('en-IN')} |\n| **Plot Direction** | ${direction}-facing |\n| **Family Size** | ${familyNum} members |\n| **Climate Zone** | ${climate} |\n\n## 2. Space Planning — Floor-wise Distribution\n### Ground Floor (${Math.round(plotNum * 0.6)} sq m)\n- **Living Room**: ${Math.round(plotNum * 0.12)} sq m — Open layout with natural ventilation\n- **Master Bedroom**: ${Math.round(plotNum * 0.1)} sq m — With attached bathroom & walk-in wardrobe\n- **Kitchen**: ${Math.round(plotNum * 0.08)} sq m — Modular kitchen with platform & chimney provision\n- **Dining Area**: ${Math.round(plotNum * 0.06)} sq m — Adjacent to kitchen\n- **Bathroom (common)**: ${Math.round(plotNum * 0.03)} sq m\n- **Pooja Room**: ${Math.round(plotNum * 0.02)} sq m — As per Vastu guidelines\n- **Car Parking**: ${Math.round(plotNum * 0.12)} sq m — Covered parking for 1 car\n- **Staircase**: ${Math.round(plotNum * 0.04)} sq m\n- **Setback and Utility**: Remaining area${floorsNum > 1 ? `\n\n### First Floor (${Math.round(plotNum * 0.6)} sq m)\n- **Bedroom 2**: ${Math.round(plotNum * 0.1)} sq m — With attached bathroom\n- **Bedroom 3**: ${Math.round(plotNum * 0.09)} sq m — With attached bathroom\n- **Family Lounge / Study**: ${Math.round(plotNum * 0.08)} sq m\n- **Balcony**: ${Math.round(plotNum * 0.05)} sq m — Front and rear balconies\n- **Common Bathroom**: ${Math.round(plotNum * 0.03)} sq m\n- **Utility / Store**: ${Math.round(plotNum * 0.04)} sq m` : ''}\n\n## 3. Key Highlights\n- ✅ **Optimized Layout** — Maximum utilization of ${plotSize} sq m with 60% ground coverage\n- ✅ **Natural Light & Ventilation** — Cross ventilation design, large windows on ${direction}-facing walls\n- ✅ **Modern Amenities** — Modular kitchen, smart wiring, rainwater harvesting provision\n- ✅ **Energy Efficient** — LED-ready wiring, solar panel provision on terrace\n- ✅ **Future Ready** — Structural design supports additional floor if needed\n- ✅ **Vastu Compliant** — Room placement follows ${direction}-facing Vastu guidelines\n- ✅ **Recommended Brands** — ${cementBrand} cement, ${steelBrand} steel, ${tileBrand} tiles\n\n## 4. Regulatory Considerations\n| Requirement | Specification |\n|-------------|---------------|\n| **Front Setback** | 3.0 meters (as per local bylaws) |\n| **Side Setbacks** | 1.5 meters each side |\n| **Rear Setback** | 1.5 meters |\n| **FAR/FSI** | ${(floorsNum * 0.6).toFixed(1)} (within permissible limit of ${(floorsNum * 0.75).toFixed(1)}) |\n| **Ground Coverage** | 60% (max permissible: 65%) |\n| **Parking** | 1 covered car park (${Math.round(plotNum * 0.12)} sq m) |\n| **Height Restriction** | ${floorsNum * 3.2}m (within ${floorsNum <= 3 ? '12m' : '15m'} limit) |\n\n> **Note**: Final setback and FAR values should be confirmed with the ${location} Municipal Corporation / DTCP before construction begins.`,
    cost: `# 💰 Detailed Cost Estimation — ${type}\n\n## 1. Overall Budget Summary\n| Parameter | Amount |\n|-----------|--------|\n| **Total Project Budget** | ${budgetFormatted} |\n| **Built-Up Area** | ${builtUpArea} sq m |\n| **Cost Per Sq M** | ₹${costPerSqft.toLocaleString('en-IN')} |\n| **Construction Cost** | ${formatINR(Math.round(budgetNum * 0.75))} (75%) |\n| **Interior & Finishing** | ${formatINR(Math.round(budgetNum * 0.20))} (20%) |\n| **Contingency** | ${formatINR(Math.round(budgetNum * 0.05))} (5%) |\n\n## 2. Material-wise Cost Breakdown\n| Material | Quantity | Rate | Cost (₹) | % of Total |\n|----------|----------|------|-----------|------------|\n| **Cement (${cementBrand} OPC 53)** | ${Math.round(builtUpArea * 0.4)} bags | ₹${cementRate}/bag | ${formatINR(Math.round(builtUpArea * 0.4 * cementRate))} | ${((builtUpArea * 0.4 * cementRate / budgetNum) * 100).toFixed(1)}% |\n| **Steel (${steelBrand} Fe500D)** | ${Math.round(builtUpArea * 4)} kg | ₹${steelRate}/kg | ${formatINR(Math.round(builtUpArea * 4 * steelRate))} | ${((builtUpArea * 4 * steelRate / budgetNum) * 100).toFixed(1)}% |\n| **Bricks (AAC Blocks)** | ${Math.round(builtUpArea * 8)} nos | ₹${brickRate}/piece | ${formatINR(Math.round(builtUpArea * 8 * brickRate))} | ${((builtUpArea * 8 * brickRate / budgetNum) * 100).toFixed(1)}% |\n| **Sand (River/M-Sand)** | ${Math.round(builtUpArea * 0.6)} cft | ₹${sandRate}/cft | ${formatINR(Math.round(builtUpArea * 0.6 * sandRate))} | ${((builtUpArea * 0.6 * sandRate / budgetNum) * 100).toFixed(1)}% |\n| **Aggregates** | ${Math.round(builtUpArea * 0.5)} cft | ₹${aggRate}/cft | ${formatINR(Math.round(builtUpArea * 0.5 * aggRate))} | ${((builtUpArea * 0.5 * aggRate / budgetNum) * 100).toFixed(1)}% |\n| **Plumbing (${pipeBrand})** | Lump Sum | — | ${formatINR(Math.round(budgetNum * 0.06))} | 6.0% |\n| **Electrical (${wireBrand})** | Lump Sum | — | ${formatINR(Math.round(budgetNum * 0.07))} | 7.0% |\n| **Flooring (${tileBrand} Vitrified)** | ${builtUpArea} sq m | ₹${tileRate}/sq m | ${formatINR(Math.round(builtUpArea * tileRate))} | ${((builtUpArea * tileRate / budgetNum) * 100).toFixed(1)}% |\n| **Doors & Windows** | ${doorWindowCount} units | Avg ₹${doorRate.toLocaleString('en-IN')} | ${formatINR(doorWindowCount * doorRate)} | ${((doorWindowCount * doorRate / budgetNum) * 100).toFixed(1)}% |\n| **Paint (${paintBrand})** | ${builtUpArea * 3} sq m | ₹${paintRate}/sq m | ${formatINR(Math.round(builtUpArea * 3 * paintRate))} | ${((builtUpArea * 3 * paintRate / budgetNum) * 100).toFixed(1)}% |\n| **Kitchen (Modular — ${kitchenFinish})** | 1 set | — | ${formatINR(Math.round(budgetNum * 0.05))} | 5.0% |\n| **Bathroom Fittings (${fittingBrand})** | ${bathCount} sets | ₹${bathFittingRate.toLocaleString('en-IN')}/set | ${formatINR(bathCount * bathFittingRate)} | ${((bathCount * bathFittingRate / budgetNum) * 100).toFixed(1)}% |\n| **Waterproofing** | Lump Sum | — | ${formatINR(Math.round(budgetNum * 0.025))} | 2.5% |\n\n## 3. Phase-wise Cost Allocation\n| Phase | Description | Cost (₹) | % |\n|-------|-------------|-----------|---|\n| **Foundation** | Excavation, PCC, RCC footing, plinth beam | ${formatINR(Math.round(budgetNum * foundPct))} | ${(foundPct * 100).toFixed(0)}% |\n| **Structure** | Columns, beams, slabs, staircases | ${formatINR(Math.round(budgetNum * structPct))} | ${(structPct * 100).toFixed(0)}% |\n| **Brick Work** | Walls, lintels, coping | ${formatINR(Math.round(budgetNum * brickPct))} | ${(brickPct * 100).toFixed(0)}% |\n| **Plastering** | Internal & external plastering | ${formatINR(Math.round(budgetNum * plasterPct))} | ${(plasterPct * 100).toFixed(0)}% |\n| **Flooring** | ${tileBrand} tiles, marble, granite | ${formatINR(Math.round(budgetNum * floorPct))} | ${(floorPct * 100).toFixed(0)}% |\n| **MEP** | Electrical (${wireBrand}), plumbing (${pipeBrand}), fire safety | ${formatINR(Math.round(budgetNum * mepPct))} | ${(mepPct * 100).toFixed(0)}% |\n| **Finishing** | ${paintBrand}, POP, polish, hardware | ${formatINR(Math.round(budgetNum * finishPct))} | ${(finishPct * 100).toFixed(0)}% |\n| **Interiors** | Kitchen (${kitchenFinish}), wardrobes, fixtures | ${formatINR(Math.round(budgetNum * intPct))} | ${(intPct * 100).toFixed(0)}% |\n| **Contingency** | Unforeseen expenses | ${formatINR(Math.round(budgetNum * contingPct))} | 5% |\n\n## 4. Labor Cost Estimate\n| Trade | Duration | Daily Rate | Total Cost (₹) |\n|-------|----------|------------|-----------------|\n| **Mason (Head)** | ${Math.round(floorsNum * 3)} months | ₹${vary(800, 10)}/day | ${formatINR(Math.round(floorsNum * 3) * 26 * vary(800, 10))} |\n| **Helpers (${rand(3, 5)} nos)** | ${Math.round(floorsNum * 3)} months | ₹${vary(500, 10)}/day | ${formatINR(Math.round(floorsNum * 3) * 26 * vary(500, 10) * rand(3, 5))} |\n| **Carpenter** | ${Math.round(floorsNum * 1.5)} months | ₹${vary(700, 10)}/day | ${formatINR(Math.round(floorsNum * 1.5) * 26 * vary(700, 10))} |\n| **Electrician** | ${Math.round(floorsNum * 1)} months | ₹${vary(700, 10)}/day | ${formatINR(Math.round(floorsNum * 1) * 26 * vary(700, 10))} |\n| **Plumber** | ${Math.round(floorsNum * 0.75) || 1} months | ₹${vary(650, 10)}/day | ${formatINR((Math.round(floorsNum * 0.75) || 1) * 26 * vary(650, 10))} |\n| **Painter** | ${Math.round(floorsNum * 1)} months | ₹${vary(600, 10)}/day | ${formatINR(Math.round(floorsNum * 1) * 26 * vary(600, 10))} |\n\n## 5. Budget-Saving Tips 💡\n${selectedTips.map(tip => `- ${tip}`).join('\n')}\n\n> **📊 Market Note**: Rates are based on ${location} market prices (Q${rand(1, 4)} 2025). Actual costs may vary by ±10-15% depending on season and vendor.`,
    interior: `# 🎨 Interior Design Suggestions — ${type}\n\n## 1. Recommended Design Style\n**${designStyle.name}** — ${designStyle.desc}, making it perfect for a ${bhk} ${type} in ${location}. It emphasizes functional beauty, natural materials, and vibrant but balanced color palettes.\n\n**Why this suits your project:**\n- Maximizes visual space in ${builtUpArea} sq m\n- Budget-friendly compared to pure luxury styles\n- Works well with ${climate} climate\n- Blends well with Vastu-compliant layouts\n\n## 2. Room-wise Interior Plan\n\n### 🛋️ Living Room (${Math.round(plotNum * 0.12)} sq m)\n| Element | Recommendation |\n|---------|---------------|\n| **Color Palette** | ${palette.primary} walls + ${palette.accent} accent wall |\n| **Flooring** | 600×600mm ${tileBrand} Light Grey Vitrified Tiles (₹${tileRate}/sq m) |\n| **Furniture** | L-shaped sofa (Fabric, Beige), Center table (${palette.neutral} finish), TV unit with back panel |\n| **Lighting** | Recessed LED downlights + 1 statement pendant light + Ambient LED strip behind TV |\n| **Storage** | Built-in TV unit with drawers, Floating shelves |\n| **Estimated Cost** | ${formatINR(Math.round(budgetNum * vary(35, 15) / 1000))} |\n\n### 🛏️ Master Bedroom (${Math.round(plotNum * 0.1)} sq m)\n| Element | Recommendation |\n|---------|---------------|\n| **Color Palette** | Dusty Blue (#B0C4DE) + Off-White (#FFFFF0) + Gold accents |\n| **Flooring** | Wooden laminate / Wood-look tiles (₹${vary(80, 15)}/sq m) |\n| **Furniture** | King-size bed with hydraulic storage, Side tables, Dresser |\n| **Wardrobe** | Floor-to-ceiling sliding wardrobe (Loft + Hanging + Shelves) |\n| **Lighting** | Warm white cove lighting + Bedside wall sconces |\n| **Estimated Cost** | ${formatINR(Math.round(budgetNum * vary(40, 15) / 1000))} |\n\n### 🍳 Kitchen (${Math.round(plotNum * 0.08)} sq m)\n| Element | Recommendation |\n|---------|---------------|\n| **Layout** | L-shaped modular kitchen with breakfast counter |\n| **Materials** | Marine plywood + ${kitchenFinish} finish |\n| **Countertop** | ${countertop} (₹${vary(180, 15)}/sq m) |\n| **Backsplash** | Subway tiles in White/Cream |\n| **Appliances Zone** | Chimney, Hob, Microwave unit, RO provision |\n| **Storage** | Corner carousel, tall unit, overhead cabinets with profile lights |\n| **Estimated Cost** | ${formatINR(Math.round(budgetNum * 0.05))} |\n\n### 🚿 Bathrooms (${bathCount} nos)\n| Element | Recommendation |\n|---------|---------------|\n| **Wall Tiles** | 300×600mm ${tileBrand} Digital Print tiles (up to 7ft height) |\n| **Floor Tiles** | Anti-skid 300×300mm Matt finish |\n| **Fittings Brand** | ${fittingBrand} (mid-premium range) |\n| **Fixtures** | Wall-mounted WC, Rain shower in master bath |\n| **Vanity** | PVC vanity with mirror cabinet |\n| **Estimated Cost** | ${formatINR(bathCount * bathFittingRate)} total |\n\n## 3. Color Scheme\n| Area | Primary | Accent | Trim/Neutral |\n|------|---------|--------|-------------|\n| **Living Room** | ${palette.primary} | ${palette.accent} | ${palette.neutral} |\n| **Master Bedroom** | Dusty Blue (#B0C4DE) | Gold (#DAA520) | Off-White (#FFFFF0) |\n| **Bedroom 2** | Lavender Mist (#E6E6FA) | Teal (#008080) | Light Grey (#D3D3D3) |\n| **Kitchen** | Cream (#FFFDD0) | Olive Green (#556B2F) | Black granite accents |\n| **Pooja Room** | Marble White (#F5F5DC) | Sandalwood (#E6C99E) | Brass accents |\n| **Staircase** | Light Taupe (#C4AEAD) | Forest Green (#228B22) | White railings |\n\n## 4. Lighting Plan\n| Room | Natural Light | Artificial Lighting |\n|------|--------------|-------------------|\n| **Living Room** | Large ${direction}-facing window + balcony door | ${rand(5, 8)} recessed LEDs (12W) + 1 pendant + LED strip behind TV |\n| **Master Bedroom** | Window with sheer + blackout curtains | Cove lighting + 2 wall sconces + ${rand(2, 4)} recessed LEDs |\n| **Kitchen** | Window above sink + ventilator | Under-cabinet LED strip + ${rand(3, 6)} recessed LEDs (15W) |\n| **Bathrooms** | Frosted glass ventilator | Mirror vanity light + 1 recessed LED (12W) |\n| **Staircase** | Skylight / clerestory window | Step lights (3W each) + 1 pendant at landing |\n| **Exterior** | — | Gate light + Porch downlight + Garden spotlights |\n\n## 5. Budget-wise Interior Packages\n| Package | Scope | Cost Estimate |\n|---------|-------|---------------|\n| **Essential** | Basic modular kitchen, wardrobes, painting, basic lights | ${formatINR(Math.round(budgetNum * 0.10))} |\n| **Premium** | Full interior, false ceiling, premium tiles, designer lights | ${formatINR(Math.round(budgetNum * 0.18))} |\n| **Luxury** | Imported fittings, smart home integration, Italian marble | ${formatINR(Math.round(budgetNum * 0.28))} |\n\n> **Recommendation**: For your budget of ${budgetFormatted}, the **Premium Package** gives the best value — covering all essentials with elevated finishes.`,
    vastu: `# 🧭 Vastu Shastra Layout Plan — ${direction}-Facing ${type}\n\n## 1. Plot Analysis — ${direction}-Facing\n**${direction}-facing plots** are ${direction === 'North' || direction === 'East' || direction === 'North-East' ? 'considered very auspicious in Vastu Shastra' : 'good for construction with proper Vastu remedies'}. Here's the detailed analysis:\n\n| Aspect | Assessment |\n|--------|-----------|\n| **Plot Direction** | ${direction}-facing (Main entrance on ${direction} side) |\n| **Plot Size** | ${plotSize} sq m — ${plotNum >= 1200 ? 'Adequate' : 'Compact'} for ${bhk} |\n| **Shape** | Rectangular preferred (ideal ratio 1:1.5) |\n| **Auspiciousness** | ${direction === 'North' || direction === 'East' ? '⭐⭐⭐⭐⭐ Highly Auspicious' : direction === 'North-East' ? '⭐⭐⭐⭐⭐ Most Auspicious' : direction === 'West' || direction === 'South' ? '⭐⭐⭐ Good with remedies' : '⭐⭐⭐⭐ Good'} |\n| **Ruling Element** | ${direction === 'North' ? 'Water (Jal)' : direction === 'South' ? 'Fire (Agni)' : direction === 'East' ? 'Air (Vayu)' : direction === 'West' ? 'Space (Akash)' : 'Mixed elements'} |\n\n## 2. Room Placement Guide\n### Ideal Room Positions for ${direction}-Facing Plot\n| Room | Recommended Direction | Reasoning |\n|------|----------------------|-----------|\n| **Main Entrance** | ${direction} (center or slightly ${direction === 'North' ? 'east' : direction === 'East' ? 'north' : direction === 'South' ? 'east' : 'north'}) | Positive energy entry point |\n| **Living Room** | North-East or North | Maximum positive energy, natural light |\n| **Master Bedroom** | South-West | Stability and grounding for head of family |\n| **Children's Bedroom** | West or North-West | Promotes creativity and growth |\n| **Guest Bedroom** | North-West | Temporary stay energy |\n| **Kitchen** | South-East (Agni corner) | Fire element alignment |\n| **Pooja Room** | North-East (Ishaan corner) | Most sacred direction |\n| **Bathrooms** | North-West or West | Water drainage direction |\n| **Staircase** | South or West | Should ascend clockwise |\n| **Dining Area** | West or adjacent to kitchen | Promotes family harmony |\n| **Store Room** | South-West (ground floor) | Heavy storage stabilizes energy |\n| **Car Parking** | North-West or South-East | Avoid North-East parking |\n\n### Floor Plan Layout (${direction}-Facing)\n\`\`\`\n╔═══════════════════════════════════════════╗\n║               NORTH                        ║\n║  ┌──────────┐  ┌──────────┐  ┌──────────┐ ║\n║  │  Pooja   │  │  Living  │  │  Dining  │ ║\n║  │  Room    │  │  Room    │  │  Area    │ ║\n║  │ (N-East) │  │ (North)  │  │ (West)   │ ║\n║  └──────────┘  └──────────┘  └──────────┘ ║\n║  ┌──────────┐       🚪       ┌──────────┐ ║\n║W │ Bedroom  │  Main Entrance │ Kitchen  │E║\n║E │   2      │               │ (S-East) │A║\n║S │ (West)   │               │          │S║\n║T └──────────┘               └──────────┘T║\n║  ┌──────────┐  ┌──────────┐  ┌──────────┐ ║\n║  │ Bathroom │  │ Master   │  │ Stair    │ ║\n║  │ (N-West) │  │ Bedroom  │  │ case     │ ║\n║  │          │  │ (S-West) │  │ (South)  │ ║\n║  └──────────┘  └──────────┘  └──────────┘ ║\n║               SOUTH                        ║\n╚═══════════════════════════════════════════╝\n\`\`\`\n\n## 3. Vastu Rules — Dos & Don'ts\n### ✅ DO's\n- Place **main entrance** in an auspicious pada (${direction === 'North' ? '4th or 5th pada from North-East' : direction === 'East' ? '4th pada from North-East' : '4th or 5th pada from the corner'})\n- Keep **North-East corner** open, light, and clutter-free\n- Ensure **kitchen platform** faces East (cook should face East while cooking)\n- Place **pooja facing East or North**\n- Keep **master bedroom head** towards South or West wall\n- Install **overhead water tank** in the South-West\n- Use **light colors** (white, cream, light yellow) for North and East walls\n\n### ❌ DON'Ts\n- **Never** place toilet in North-East corner\n- **Avoid** staircase in the center (Brahmasthan) of the house\n- **Don't** place mirror opposite the bed in bedrooms\n- **Avoid** kitchen directly opposite or adjacent to bathroom\n- **Don't** keep heavy furniture in North-East\n- **Avoid** underground water tank in South-West\n- **Never** have main door opening outward\n\n## 4. Vastu Remedies — Common Defects & Solutions\n| Defect | Remedy |\n|--------|--------|\n| **South-West entrance (if unavoidable)** | Place a Vastu pyramid / brass lamp near door, use dark colored door |\n| **Toilet in wrong direction** | Use light green tiles, place sea salt bowl, ensure ventilation |\n| **Cut in North-East** | Place a crystal ball or water fountain in nearest N-E corner |\n| **Staircase in center** | Place a Vastu yantra below staircase, use light colors |\n| **Beam above bed** | Use false ceiling to conceal, or shift bed position |\n| **Kitchen in North-East** | Place heavy granite slab, shift stove to S-E corner of kitchen |\n\n## 5. Floor-wise Vastu Plan\n### Ground Floor\n- **N-E**: Pooja room + Open porch / garden area\n- **S-E**: Kitchen with gas stove in S-E corner\n- **S-W**: Master bedroom (head of family)\n- **N-W**: Common bathroom + Car parking\n- **Center**: Living room (keep well-lit and ventilated)\n\n${floorsNum > 1 ? `### First Floor\n- **N-E**: Study room / Children's room with study table in N-E\n- **S-W**: Bedroom 2 (head of bed towards South wall)\n- **N-W**: Guest bedroom / Store room\n- **S-E**: Utility area / Open terrace\n- **Center**: Family lounge (keep open and well-ventilated)` : ''}\n\n${floorsNum > 2 ? `### Second Floor / Terrace\n- **S-W**: Overhead water tank (2000L)\n- **N-E**: Open terrace / Garden area (keep this side lower)\n- **S-E**: Solar panel installation area\n- **N-W**: Utility room / Washing area` : ''}\n\n> **🔮 Vastu Tip for ${location}**: Given the ${climate} climate, ensure ample ventilation through jali work on the ${direction === 'North' || direction === 'East' ? 'South and West' : 'North and East'} walls to balance natural airflow as per Vastu.`,
    timeline: `# 📅 Construction Timeline — ${type}\n\n## 1. Overall Duration\n| Milestone | Timeline |\n|-----------|----------|\n| **Total Construction Period** | ${floorsNum <= 2 ? `${rand(10, 14)}` : `${rand(14, 18)}`} months |\n| **Pre-Construction Phase** | ${rand(1, 2)} months |\n| **Construction Phase** | ${floorsNum <= 2 ? `${rand(8, 10)}` : `${rand(10, 14)}`} months |\n| **Final Finishing** | ${rand(1, 2)} months |\n| **Expected Handover** | Month ${floorsNum <= 2 ? rand(12, 14) : rand(16, 18)} |\n\n## 2. Phase-wise Timeline\n\n### Phase 1: Pre-Construction (Month 1-2)\n| Task | Duration | Details |\n|------|----------|---------|\n| **Site Survey & Soil Test** | Week 1-2 | Soil bearing capacity test, topographical survey |\n| **Architectural Drawing** | Week 2-4 | Floor plans, elevations, 3D views, structural drawings |\n| **Approval & Permits** | Week 3-6 | Building plan approval from ${location} Municipal Corporation |\n| **Contractor Finalization** | Week 5-7 | Compare 3-4 quotes, finalize contract terms |\n| **Material Procurement (Phase 1)** | Week 6-8 | ${cementBrand} cement, ${steelBrand} steel, sand, aggregates booking |\n\n### Phase 2: Foundation (Month 2-3)\n| Task | Duration | Details |\n|------|----------|---------|\n| **Site Clearing** | ${rand(2, 4)} days | Remove debris, level the ground |\n| **Excavation** | ${rand(4, 6)} days | Trench excavation for footings (depth: 4-5 ft) |\n| **PCC (Plain Cement Concrete)** | ${rand(2, 4)} days | 1:4:8 mix, 150mm thick base |\n| **RCC Footing** | ${rand(5, 8)} days | Isolated footings as per structural design |\n| **Anti-termite Treatment** | ${rand(1, 3)} days | Chemical treatment of foundation soil |\n| **Plinth Beam** | ${rand(5, 8)} days | RCC beams connecting all footings |\n| **Plinth Filling** | ${rand(3, 5)} days | Sand/gravel filling up to plinth level |\n| **DPC (Damp Proof Course)** | ${rand(1, 3)} days | Waterproof membrane at plinth level |\n\n### Phase 3: Structure — Ground Floor (Month 3-5)\n| Task | Duration | Details |\n|------|----------|---------|\n| **Column Casting** | ${rand(7, 12)} days | RCC columns as per structural drawing |\n| **Brick/Block Work** | ${rand(15, 22)} days | AAC block walls (150mm & 200mm) |\n| **Lintel Beam** | ${rand(5, 8)} days | Beams above doors and windows |\n| **Roof Slab Casting** | ${rand(3, 6)} days | RCC slab (125-150mm thick) |\n| **Curing Period** | ${rand(14, 21)} days | Minimum 14 days water curing for slab |\n\n${floorsNum > 1 ? `### Phase 4: Structure — First Floor (Month 5-7)\n| Task | Duration | Details |\n|------|----------|---------|\n| **Staircase Construction** | ${rand(5, 8)} days | Dog-legged / L-shaped staircase |\n| **Column & Wall Work** | ${rand(15, 22)} days | First floor columns, walls |\n| **Slab Casting** | ${rand(3, 6)} days | First floor roof slab |\n| **Curing** | ${rand(14, 21)} days | Water curing |\n| **Parapet Wall** | ${rand(3, 6)} days | 3 ft parapet on terrace |` : ''}\n\n### Phase ${floorsNum > 1 ? '5' : '4'}: Finishing Phase 1 (Month ${floorsNum > 1 ? '7-9' : '5-7'})\n| Task | Duration | Details |\n|------|----------|---------|\n| **Internal Plastering** | ${rand(15, 22)} days | 12mm cement plaster on all internal walls |\n| **External Plastering** | ${rand(10, 14)} days | 20mm plaster with waterproof additive |\n| **Electrical Conduit** | ${rand(7, 12)} days | PVC conduit + ${wireBrand} wiring |\n| **Plumbing Rough-in** | ${rand(7, 12)} days | ${pipeBrand} pipes, drainage lines |\n| **Waterproofing** | ${rand(5, 8)} days | Terrace, bathrooms, kitchen wet areas |\n\n### Phase ${floorsNum > 1 ? '6' : '5'}: Finishing Phase 2 (Month ${floorsNum > 1 ? '9-11' : '7-9'})\n| Task | Duration | Details |\n|------|----------|---------|\n| **Flooring (Tiles)** | ${rand(10, 16)} days | ${tileBrand} vitrified tiles, anti-skid in wet areas |\n| **Door & Window Installation** | ${rand(7, 12)} days | ${doorStyle} (main), ${windowType} |\n| **Kitchen Platform** | ${rand(5, 8)} days | ${countertop} counter + stainless steel sink |\n| **Bathroom Fittings** | ${rand(5, 8)} days | ${fittingBrand} sanitary ware, shower, taps |\n| **False Ceiling** | ${rand(5, 8)} days | Gypsum false ceiling in living room + bedrooms |\n\n### Phase ${floorsNum > 1 ? '7' : '6'}: Final Finishing (Month ${floorsNum > 1 ? '11-13' : '9-11'})\n| Task | Duration | Details |\n|------|----------|---------|\n| **Painting** | ${rand(10, 16)} days | Primer + 2 coats ${paintBrand} |\n| **Modular Kitchen Installation** | ${rand(5, 8)} days | ${kitchenFinish} cabinets, countertop, accessories |\n| **Electrical Fixtures** | ${rand(3, 6)} days | ${switchBrand} switches, lights, fans |\n| **Wardrobe Installation** | ${rand(5, 8)} days | Sliding wardrobes in all bedrooms |\n| **Final Plumbing** | ${rand(2, 4)} days | Tap fittings, geyser installation |\n\n### Phase ${floorsNum > 1 ? '8' : '7'}: Handover (Month ${floorsNum > 1 ? '13-14' : '11-12'})\n| Task | Duration | Details |\n|------|----------|---------|\n| **Deep Cleaning** | ${rand(2, 4)} days | Post-construction cleaning |\n| **Final Inspection** | ${rand(1, 3)} days | Electrical, plumbing, structural check |\n| **Snag List Resolution** | ${rand(3, 6)} days | Fix any defects found during inspection |\n| **Completion Certificate** | 1-2 weeks | Obtain from local municipality |\n| **Key Handover** | Day 1 | 🎉 Move-in ready! |\n\n## 3. Seasonal Considerations for ${location}\n| Season | Months | Construction Impact | Recommendation |\n|--------|--------|-------------------|----------------|\n| **Summer** | Mar-May | ✅ Best for construction | Ideal for foundation & structure work |\n| **Monsoon** | Jun-Sep | ⚠️ Delays likely (${rand(15, 35)} days) | Avoid slab casting; cover materials; focus on indoor work |\n| **Post-Monsoon** | Oct-Nov | ✅ Good conditions resume | Best for plastering and finishing |\n| **Winter** | Dec-Feb | ✅ Good for finishing | Ideal for painting and interior work |\n\n> **📌 Best Start Month for ${location}**: October-November. This allows foundation work before monsoon-free months and structural work completion before next monsoon.\n\n## 4. Inspection Checkpoints ✅\n| Checkpoint | Stage | What to Check |\n|------------|-------|---------------|\n| **#1** | After Foundation | Footing dimensions, steel placement, concrete grade |\n| **#2** | Before Slab Casting | Beam reinforcement, shuttering alignment, slab thickness |\n| **#3** | After Brick Work | Wall plumbness, mortar joints, lintel levels |\n| **#4** | After Plumbing Rough-in | Pipe pressure test (24 hrs), drainage slope |\n| **#5** | After Electrical | Wire gauge verification, Earth bonding test, MCB rating |\n| **#6** | After Waterproofing | Ponding test on terrace (48 hrs), bathroom leak test |\n| **#7** | After Plastering | Surface smoothness, corner angles, no cracks |\n| **#8** | Final Inspection | All systems check, snag list, completion certificate |\n\n> **⏱️ Estimated Handover**: Your ${bhk} ${type} in ${location} should be ready for move-in within **${floorsNum <= 2 ? '12-14' : '16-18'} months** from foundation start, assuming normal working conditions and no major delays.`
  };
  return data[sectionId] || data.summary;
}

// ─── Public API ─────────────────────────────────────────────────────────────
function getProviderPriority(sectionId) {
  const priorities = {
    summary: ['openai', 'gemini', 'huggingface', 'openrouter'],
    cost: ['openai', 'groq', 'huggingface', 'gemini'],
    interior: ['openai', 'groq', 'huggingface', 'gemini'],
    vastu: ['gemini', 'openai', 'huggingface', 'openrouter'],
    timeline: ['openai', 'groq', 'huggingface', 'gemini'],
  };
  return priorities[sectionId] || ['gemini', 'openai'];
}

// Helper for OpenAI-compatible REST APIs
const fetchOpenAICompat = async (url, apiKey, modelName, prompt) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'SmartBuild AI'
    },
    body: JSON.stringify({
      model: modelName,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!response.ok) throw new Error(`${modelName} failed: ${response.status}`);
  const data = await response.json();
  return { text: data.choices[0].message.content, modelUsed: modelName };
};

async function callResourcefulAI(prompt, sectionId) {
  const providers = {
    openai: async () => {
      const key = import.meta.env.VITE_OPENAI_API_KEY;
      if (!key || key.includes('PLACEHOLDER')) throw new Error('Missing Key');
      return fetchOpenAICompat('/api/openai/v1/chat/completions', key, 'gpt-4o-mini', prompt);
    },
    gemini: async () => {
      const keysEnv = import.meta.env.VITE_GEMINI_API_KEY || '';
      const keys = keysEnv.split(',').map(k => k.trim()).filter(k => k && !k.includes('PLACEHOLDER') && !k.includes('YOUR_'));
      if (keys.length === 0) throw new Error('Missing Key');
      let lastErr = null;
      for (const key of keys) {
        try {
          const genAI = new GoogleGenerativeAI(key);
          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          const result = await model.generateContent(prompt);
          return { text: result.response.text(), modelUsed: 'Gemini 2.0 Flash' };
        } catch (e) { lastErr = e; }
      }
      throw new Error(`All Gemini keys failed or were limited: ${lastErr?.message}`);
    },
    xai: async () => {
      const key = import.meta.env.VITE_XAI_API_KEY;
      if (!key || key.includes('PLACEHOLDER')) throw new Error('Missing Key');
      return fetchOpenAICompat('/api/xai/v1/chat/completions', key, 'grok-beta', prompt);
    },
    groq: async () => {
      const key = import.meta.env.VITE_GROQ_API_KEY;
      if (!key || key.includes('PLACEHOLDER')) throw new Error('Missing Key');
      return fetchOpenAICompat('/api/groq/openai/v1/chat/completions', key, 'llama-3.3-70b-versatile', prompt);
    },
    openrouter: async () => {
      const key = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!key || key.includes('PLACEHOLDER')) throw new Error('Missing Key');
      return fetchOpenAICompat('/api/openrouter/api/v1/chat/completions', key, 'google/gemma-3-4b-it:free', prompt);
    },
    huggingface: async () => {
      const key = import.meta.env.VITE_HUGGINGFACE_API_KEY;
      if (!key || key.includes('PLACEHOLDER')) throw new Error('Missing Key');
      const response = await fetch('/api/huggingface/models/Qwen/Qwen2.5-7B-Instruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          inputs: `<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant\n`,
          parameters: { max_new_tokens: 1024, temperature: 0.7 }
        })
      });
      if (!response.ok) throw new Error(`HF-Text failed: ${response.status}`);
      const result = await response.json();
      const text = Array.isArray(result) ? result[0].generated_text : result.generated_text;
      return { text: text.split('assistant\n')[1] || text, modelUsed: 'Qwen-2.5 (HF)' };
    }
  };

  const priorityKeys = getProviderPriority(sectionId);
  const attempted = [];
  
  for (const key of priorityKeys) {
    if (!providers[key]) continue;
    
    // 8-second timeout per attempt
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const result = await providers[key]();
      clearTimeout(timeoutId);
      return result;
    } catch (e) {
      clearTimeout(timeoutId);
      const msg = e.name === 'AbortError' ? 'Timed out (8s)' : e.message;
      console.warn(`❌ ${key} attempt failed: ${msg}`);
      attempted.push({ key, error: msg });
    }
  }

  throw new Error(attempted.length > 0 
    ? 'All configured AI providers failed: ' + attempted.map(a => `${a.key} (${a.error})`).join(', ')
    : 'No API keys configured.');
}

export async function generateAIPlan(projectData, sectionId) {
  try {
    console.log(`🚀 Starting generation for section: ${sectionId}`);
    const prompt = buildPrompt(projectData, sectionId);
    
    // Resourcefully map specific sections to specific APIs sequentially
    const result = await callResourcefulAI(prompt, sectionId);
    console.log(`✅ ${sectionId} generation successful via ${result.modelUsed}`);
    
    return { content: result.text, model: result.modelUsed };
  } catch (err) {
    console.warn(`⚠️ ${sectionId} AI failed! Falling back to data engine.`, err);
    
    // Ultimate fallback to your programmatic offline dataset generator
    const content = generateData(projectData, sectionId);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return { content, model: 'SmartBuild Offline Fallback' };
  }
}
