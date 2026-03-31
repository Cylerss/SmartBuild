// SmartBuild AI Service
// Uses Gemini API with fallback to comprehensive mock data

const GEMINI_API_KEY = 'AIzaSyCZUfAItZ85cisgT87Tux5Y-n75nQpRkSM';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─── Comprehensive Mock Data Generator ──────────────────────────────────────
function generateMockData(inputs, sectionId) {
  const { plotSize = '1200', budget = '30,00,000', location = 'Bangalore', floors = '2', direction = 'North', type = 'Independent House', familySize = '4', climate = 'Composite', notes = '' } = inputs;

  const plotNum = parseInt(plotSize) || 1200;
  const budgetClean = budget.toString().replace(/,/g, '');
  const budgetNum = parseInt(budgetClean) || 3000000;
  const budgetFormatted = '₹' + Number(budgetNum).toLocaleString('en-IN');
  const floorsNum = parseInt(floors) || 2;
  const builtUpArea = Math.round(plotNum * 0.6 * floorsNum);
  const costPerSqft = Math.round(budgetNum / builtUpArea);
  const familyNum = parseInt(familySize) || 4;

  // Determine BHK
  let bhk = '2 BHK';
  if (builtUpArea > 2000) bhk = '4 BHK';
  else if (builtUpArea > 1400) bhk = '3 BHK';
  else if (builtUpArea > 800) bhk = '2 BHK';
  else bhk = '1 BHK';

  const mockData = {
    // ═══════════════════════════════════════════════════════════════════
    // SECTION 1: PROJECT SUMMARY
    // ═══════════════════════════════════════════════════════════════════
    summary: `# 📋 Project Summary — ${type}

## 1. Project Overview

| Parameter | Details |
|-----------|---------|
| **Plot Size** | ${plotSize} sq ft |
| **Built-Up Area** | ${builtUpArea} sq ft (across ${floorsNum} floor${floorsNum > 1 ? 's' : ''}) |
| **Configuration** | ${bhk} ${type} |
| **Location** | ${location}, India |
| **Total Budget** | ${budgetFormatted} |
| **Cost Per Sq Ft** | ₹${costPerSqft.toLocaleString('en-IN')} |
| **Plot Direction** | ${direction}-facing |
| **Family Size** | ${familyNum} members |
| **Climate Zone** | ${climate} |

## 2. Space Planning — Floor-wise Distribution

### Ground Floor (${Math.round(plotNum * 0.6)} sq ft)
- **Living Room**: ${Math.round(plotNum * 0.12)} sq ft — Open layout with natural ventilation
- **Master Bedroom**: ${Math.round(plotNum * 0.1)} sq ft — With attached bathroom & walk-in wardrobe
- **Kitchen**: ${Math.round(plotNum * 0.08)} sq ft — Modular kitchen with platform & chimney provision
- **Dining Area**: ${Math.round(plotNum * 0.06)} sq ft — Adjacent to kitchen
- **Bathroom (common)**: ${Math.round(plotNum * 0.03)} sq ft
- **Pooja Room**: ${Math.round(plotNum * 0.02)} sq ft — As per Vastu guidelines
- **Car Parking**: ${Math.round(plotNum * 0.12)} sq ft — Covered parking for 1 car
- **Staircase**: ${Math.round(plotNum * 0.04)} sq ft
- **Setback and Utility**: Remaining area${floorsNum > 1 ? `

### First Floor (${Math.round(plotNum * 0.6)} sq ft)
- **Bedroom 2**: ${Math.round(plotNum * 0.1)} sq ft — With attached bathroom
- **Bedroom 3**: ${Math.round(plotNum * 0.09)} sq ft — With attached bathroom
- **Family Lounge / Study**: ${Math.round(plotNum * 0.08)} sq ft
- **Balcony**: ${Math.round(plotNum * 0.05)} sq ft — Front and rear balconies
- **Common Bathroom**: ${Math.round(plotNum * 0.03)} sq ft
- **Utility / Store**: ${Math.round(plotNum * 0.04)} sq ft` : ''}

## 3. Key Highlights

- ✅ **Optimized Layout** — Maximum utilization of ${plotSize} sq ft with 60% ground coverage
- ✅ **Natural Light & Ventilation** — Cross ventilation design, large windows on ${direction}-facing walls
- ✅ **Modern Amenities** — Modular kitchen, smart wiring, rainwater harvesting provision
- ✅ **Energy Efficient** — LED-ready wiring, solar panel provision on terrace
- ✅ **Future Ready** — Structural design supports additional floor if needed
- ✅ **Vastu Compliant** — Room placement follows ${direction}-facing Vastu guidelines

## 4. Regulatory Considerations

| Requirement | Specification |
|-------------|---------------|
| **Front Setback** | 3.0 meters (as per local bylaws) |
| **Side Setbacks** | 1.5 meters each side |
| **Rear Setback** | 1.5 meters |
| **FAR/FSI** | ${(floorsNum * 0.6).toFixed(1)} (within permissible limit of ${(floorsNum * 0.75).toFixed(1)}) |
| **Ground Coverage** | 60% (max permissible: 65%) |
| **Parking** | 1 covered car park (${Math.round(plotNum * 0.12)} sq ft) |
| **Height Restriction** | ${floorsNum * 3.2}m (within ${floorsNum <= 3 ? '12m' : '15m'} limit) |

> **Note**: Final setback and FAR values should be confirmed with the ${location} Municipal Corporation / DTCP before construction begins.`,

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 2: COST ESTIMATION
    // ═══════════════════════════════════════════════════════════════════
    cost: `# 💰 Detailed Cost Estimation — ${type}

## 1. Overall Budget Summary

| Parameter | Amount |
|-----------|--------|
| **Total Project Budget** | ${budgetFormatted} |
| **Built-Up Area** | ${builtUpArea} sq ft |
| **Cost Per Sq Ft** | ₹${costPerSqft.toLocaleString('en-IN')} |
| **Construction Cost** | ₹${Math.round(budgetNum * 0.75).toLocaleString('en-IN')} (75%) |
| **Interior & Finishing** | ₹${Math.round(budgetNum * 0.20).toLocaleString('en-IN')} (20%) |
| **Contingency** | ₹${Math.round(budgetNum * 0.05).toLocaleString('en-IN')} (5%) |

## 2. Material-wise Cost Breakdown

| Material | Quantity | Rate | Cost (₹) | % of Total |
|----------|----------|------|-----------|------------|
| **Cement (OPC 53 grade)** | ${Math.round(builtUpArea * 0.4)} bags | ₹380/bag | ₹${Math.round(builtUpArea * 0.4 * 380).toLocaleString('en-IN')} | ${((builtUpArea * 0.4 * 380 / budgetNum) * 100).toFixed(1)}% |
| **Steel (TMT Fe500D)** | ${Math.round(builtUpArea * 4)} kg | ₹72/kg | ₹${Math.round(builtUpArea * 4 * 72).toLocaleString('en-IN')} | ${((builtUpArea * 4 * 72 / budgetNum) * 100).toFixed(1)}% |
| **Bricks (AAC Blocks)** | ${Math.round(builtUpArea * 8)} nos | ₹55/piece | ₹${Math.round(builtUpArea * 8 * 55).toLocaleString('en-IN')} | ${((builtUpArea * 8 * 55 / budgetNum) * 100).toFixed(1)}% |
| **Sand (River/M-Sand)** | ${Math.round(builtUpArea * 0.6)} cft | ₹55/cft | ₹${Math.round(builtUpArea * 0.6 * 55).toLocaleString('en-IN')} | ${((builtUpArea * 0.6 * 55 / budgetNum) * 100).toFixed(1)}% |
| **Aggregates** | ${Math.round(builtUpArea * 0.5)} cft | ₹38/cft | ₹${Math.round(builtUpArea * 0.5 * 38).toLocaleString('en-IN')} | ${((builtUpArea * 0.5 * 38 / budgetNum) * 100).toFixed(1)}% |
| **Plumbing (CPVC/PVC)** | Lump Sum | — | ₹${Math.round(budgetNum * 0.06).toLocaleString('en-IN')} | 6.0% |
| **Electrical (Havells/Polycab)** | Lump Sum | — | ₹${Math.round(budgetNum * 0.07).toLocaleString('en-IN')} | 7.0% |
| **Flooring (Vitrified tiles)** | ${builtUpArea} sq ft | ₹65/sq ft | ₹${Math.round(builtUpArea * 65).toLocaleString('en-IN')} | ${((builtUpArea * 65 / budgetNum) * 100).toFixed(1)}% |
| **Doors & Windows** | ${8 + floorsNum * 4} units | Avg ₹12,000 | ₹${((8 + floorsNum * 4) * 12000).toLocaleString('en-IN')} | ${(((8 + floorsNum * 4) * 12000 / budgetNum) * 100).toFixed(1)}% |
| **Paint (Asian/Berger)** | ${builtUpArea * 3} sq ft | ₹18/sq ft | ₹${Math.round(builtUpArea * 3 * 18).toLocaleString('en-IN')} | ${((builtUpArea * 3 * 18 / budgetNum) * 100).toFixed(1)}% |
| **Kitchen (Modular)** | 1 set | — | ₹${Math.round(budgetNum * 0.05).toLocaleString('en-IN')} | 5.0% |
| **Bathroom Fittings** | ${2 + floorsNum} sets | ₹35,000/set | ₹${((2 + floorsNum) * 35000).toLocaleString('en-IN')} | ${(((2 + floorsNum) * 35000 / budgetNum) * 100).toFixed(1)}% |
| **Waterproofing** | Lump Sum | — | ₹${Math.round(budgetNum * 0.025).toLocaleString('en-IN')} | 2.5% |

## 3. Phase-wise Cost Allocation

| Phase | Description | Cost (₹) | % |
|-------|-------------|-----------|---|
| **Foundation** | Excavation, PCC, RCC footing, plinth beam | ₹${Math.round(budgetNum * 0.12).toLocaleString('en-IN')} | 12% |
| **Structure** | Columns, beams, slabs, staircases | ₹${Math.round(budgetNum * 0.25).toLocaleString('en-IN')} | 25% |
| **Brick Work** | Walls, lintels, coping | ₹${Math.round(budgetNum * 0.10).toLocaleString('en-IN')} | 10% |
| **Plastering** | Internal & external plastering | ₹${Math.round(budgetNum * 0.08).toLocaleString('en-IN')} | 8% |
| **Flooring** | Tiles, marble, granite | ₹${Math.round(budgetNum * 0.08).toLocaleString('en-IN')} | 8% |
| **MEP** | Electrical, plumbing, fire safety | ₹${Math.round(budgetNum * 0.13).toLocaleString('en-IN')} | 13% |
| **Finishing** | Paint, POP, polish, hardware | ₹${Math.round(budgetNum * 0.12).toLocaleString('en-IN')} | 12% |
| **Interiors** | Kitchen, wardrobes, fixtures | ₹${Math.round(budgetNum * 0.07).toLocaleString('en-IN')} | 7% |
| **Contingency** | Unforeseen expenses | ₹${Math.round(budgetNum * 0.05).toLocaleString('en-IN')} | 5% |

## 4. Labor Cost Estimate

| Trade | Duration | Daily Rate | Total Cost (₹) |
|-------|----------|------------|-----------------|
| **Mason (Head)** | ${Math.round(floorsNum * 3)} months | ₹800/day | ₹${(Math.round(floorsNum * 3) * 26 * 800).toLocaleString('en-IN')} |
| **Helpers (4 nos)** | ${Math.round(floorsNum * 3)} months | ₹500/day | ₹${(Math.round(floorsNum * 3) * 26 * 500 * 4).toLocaleString('en-IN')} |
| **Carpenter** | ${Math.round(floorsNum * 1.5)} months | ₹700/day | ₹${(Math.round(floorsNum * 1.5) * 26 * 700).toLocaleString('en-IN')} |
| **Electrician** | ${Math.round(floorsNum * 1)} months | ₹700/day | ₹${(Math.round(floorsNum * 1) * 26 * 700).toLocaleString('en-IN')} |
| **Plumber** | ${Math.round(floorsNum * 0.75)} months | ₹650/day | ₹${(Math.round(floorsNum * 0.75 || 1) * 26 * 650).toLocaleString('en-IN')} |
| **Painter** | ${Math.round(floorsNum * 1)} months | ₹600/day | ₹${(Math.round(floorsNum * 1) * 26 * 600).toLocaleString('en-IN')} |

## 5. Budget-Saving Tips 💡

- 🏗️ **Use AAC blocks** instead of red bricks — saves 15-20% on wall construction
- 🪵 **Ready-made doors** (flush doors) instead of custom teak — saves ₹5,000-8,000 per door
- 🎨 **Use Birla Putty + emulsion** instead of POP + enamel — saves ~₹15/sq ft
- 🚿 **Source bathroom fittings locally** (Cera/Hindware) — 30% cheaper than imported brands
- ⚡ **LED panel lights** instead of decorative fixtures — 60% savings on lighting
- 🏠 **M-Sand** instead of river sand — consistent quality, 20-30% cheaper in ${location}`,

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 3: INTERIOR DESIGN
    // ═══════════════════════════════════════════════════════════════════
    interior: `# 🎨 Interior Design Suggestions — ${type}

## 1. Recommended Design Style

**Modern Contemporary Indian** — This style blends clean modern lines with warm Indian aesthetics, making it perfect for a ${bhk} ${type} in ${location}. It emphasizes functional beauty, natural materials, and vibrant but balanced color palettes.

**Why this suits your project:**
- Maximizes visual space in ${builtUpArea} sq ft
- Budget-friendly compared to pure luxury styles
- Works well with ${climate} climate
- Blends well with Vastu-compliant layouts

## 2. Room-wise Interior Plan

### 🛋️ Living Room (${Math.round(plotNum * 0.12)} sq ft)
| Element | Recommendation |
|---------|---------------|
| **Color Palette** | Warm White walls (#FAF9F6) + Sage Green accent wall (#9CAF88) |
| **Flooring** | 600×600mm Light Grey Vitrified Tiles (₹65/sq ft) |
| **Furniture** | L-shaped sofa (Fabric, Beige), Center table (Walnut finish), TV unit with back panel |
| **Lighting** | Recessed LED downlights + 1 statement pendant light + Ambient LED strip behind TV |
| **Storage** | Built-in TV unit with drawers, Floating shelves |
| **Estimated Cost** | ₹${Math.round(budgetNum * 0.035).toLocaleString('en-IN')} |

### 🛏️ Master Bedroom (${Math.round(plotNum * 0.1)} sq ft)
| Element | Recommendation |
|---------|---------------|
| **Color Palette** | Dusty Blue (#B0C4DE) + Off-White (#FFFFF0) + Gold accents |
| **Flooring** | Wooden laminate / Wood-look tiles (₹80/sq ft) |
| **Furniture** | King-size bed with hydraulic storage, Side tables, Dresser |
| **Wardrobe** | Floor-to-ceiling sliding wardrobe (Loft + Hanging + Shelves) |
| **Lighting** | Warm white cove lighting + Bedside wall sconces |
| **Estimated Cost** | ₹${Math.round(budgetNum * 0.04).toLocaleString('en-IN')} |

### 🍳 Kitchen (${Math.round(plotNum * 0.08)} sq ft)
| Element | Recommendation |
|---------|---------------|
| **Layout** | L-shaped modular kitchen with breakfast counter |
| **Materials** | Marine plywood + Acrylic/Laminate finish |
| **Countertop** | Black Galaxy Granite (₹180/sq ft) |
| **Backsplash** | Subway tiles in White/Cream |
| **Appliances Zone** | Chimney, Hob, Microwave unit, RO provision |
| **Storage** | Corner carousel, tall unit, overhead cabinets with profile lights |
| **Estimated Cost** | ₹${Math.round(budgetNum * 0.05).toLocaleString('en-IN')} |

### 🚿 Bathrooms (${2 + floorsNum} nos)
| Element | Recommendation |
|---------|---------------|
| **Wall Tiles** | 300×600mm Digital Print tiles (up to 7ft height) |
| **Floor Tiles** | Anti-skid 300×300mm Matt finish |
| **Fittings Brand** | Hindware / Cera (mid-premium range) |
| **Fixtures** | Wall-mounted WC, Rain shower in master bath |
| **Vanity** | PVC vanity with mirror cabinet |
| **Estimated Cost** | ₹${((2 + floorsNum) * 35000).toLocaleString('en-IN')} total |

## 3. Color Scheme

| Area | Primary | Accent | Trim/Neutral |
|------|---------|--------|-------------|
| **Living Room** | Warm White (#FAF9F6) | Sage Green (#9CAF88) | Wood Walnut (#5C4033) |
| **Master Bedroom** | Dusty Blue (#B0C4DE) | Gold (#DAA520) | Off-White (#FFFFF0) |
| **Bedroom 2** | Lavender Mist (#E6E6FA) | Teal (#008080) | Light Grey (#D3D3D3) |
| **Kitchen** | Cream (#FFFDD0) | Olive Green (#556B2F) | Black granite accents |
| **Pooja Room** | Marble White (#F5F5DC) | Sandalwood (#E6C99E) | Brass accents |
| **Staircase** | Light Taupe (#C4AEAD) | Forest Green (#228B22) | White railings |

## 4. Lighting Plan

| Room | Natural Light | Artificial Lighting |
|------|--------------|-------------------|
| **Living Room** | Large ${direction}-facing window + balcony door | 6 recessed LEDs (12W) + 1 pendant + LED strip behind TV |
| **Master Bedroom** | Window with sheer + blackout curtains | Cove lighting + 2 wall sconces + 2 recessed LEDs |
| **Kitchen** | Window above sink + ventilator | Under-cabinet LED strip + 4 recessed LEDs (15W) |
| **Bathrooms** | Frosted glass ventilator | Mirror vanity light + 1 recessed LED (12W) |
| **Staircase** | Skylight / clerestory window | Step lights (3W each) + 1 pendant at landing |
| **Exterior** | — | Gate light + Porch downlight + Garden spotlights |

## 5. Budget-wise Interior Packages

| Package | Scope | Cost Estimate |
|---------|-------|---------------|
| **Essential** | Basic modular kitchen, wardrobes, painting, basic lights | ₹${Math.round(budgetNum * 0.10).toLocaleString('en-IN')} |
| **Premium** | Full interior, false ceiling, premium tiles, designer lights | ₹${Math.round(budgetNum * 0.18).toLocaleString('en-IN')} |
| **Luxury** | Imported fittings, smart home integration, Italian marble | ₹${Math.round(budgetNum * 0.28).toLocaleString('en-IN')} |

> **Recommendation**: For your budget of ${budgetFormatted}, the **Premium Package** gives the best value — covering all essentials with elevated finishes.`,

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 4: VASTU SHASTRA
    // ═══════════════════════════════════════════════════════════════════
    vastu: `# 🧭 Vastu Shastra Layout Plan — ${direction}-Facing ${type}

## 1. Plot Analysis — ${direction}-Facing

**${direction}-facing plots** are ${direction === 'North' || direction === 'East' || direction === 'North-East' ? 'considered very auspicious in Vastu Shastra' : 'good for construction with proper Vastu remedies'}. Here's the detailed analysis:

| Aspect | Assessment |
|--------|-----------|
| **Plot Direction** | ${direction}-facing (Main entrance on ${direction} side) |
| **Plot Size** | ${plotSize} sq ft — ${plotNum >= 1200 ? 'Adequate' : 'Compact'} for ${bhk} |
| **Shape** | Rectangular preferred (ideal ratio 1:1.5) |
| **Auspiciousness** | ${direction === 'North' || direction === 'East' ? '⭐⭐⭐⭐⭐ Highly Auspicious' : direction === 'North-East' ? '⭐⭐⭐⭐⭐ Most Auspicious' : direction === 'West' || direction === 'South' ? '⭐⭐⭐ Good with remedies' : '⭐⭐⭐⭐ Good'} |
| **Ruling Element** | ${direction === 'North' ? 'Water (Jal)' : direction === 'South' ? 'Fire (Agni)' : direction === 'East' ? 'Air (Vayu)' : direction === 'West' ? 'Space (Akash)' : 'Mixed elements'} |

## 2. Room Placement Guide

### Ideal Room Positions for ${direction}-Facing Plot

| Room | Recommended Direction | Reasoning |
|------|----------------------|-----------|
| **Main Entrance** | ${direction} (center or slightly ${direction === 'North' ? 'east' : direction === 'East' ? 'north' : direction === 'South' ? 'east' : 'north'}) | Positive energy entry point |
| **Living Room** | North-East or North | Maximum positive energy, natural light |
| **Master Bedroom** | South-West | Stability and grounding for head of family |
| **Children's Bedroom** | West or North-West | Promotes creativity and growth |
| **Guest Bedroom** | North-West | Temporary stay energy |
| **Kitchen** | South-East (Agni corner) | Fire element alignment |
| **Pooja Room** | North-East (Ishaan corner) | Most sacred direction |
| **Bathrooms** | North-West or West | Water drainage direction |
| **Staircase** | South or West | Should ascend clockwise |
| **Dining Area** | West or adjacent to kitchen | Promotes family harmony |
| **Store Room** | South-West (ground floor) | Heavy storage stabilizes energy |
| **Car Parking** | North-West or South-East | Avoid North-East parking |

### Floor Plan Layout (${direction}-Facing)

\`\`\`
╔═══════════════════════════════════════════╗
║               NORTH                        ║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐ ║
║  │  Pooja   │  │  Living  │  │  Dining  │ ║
║  │  Room    │  │  Room    │  │  Area    │ ║
║  │ (N-East) │  │ (North)  │  │ (West)   │ ║
║  └──────────┘  └──────────┘  └──────────┘ ║
║  ┌──────────┐       🚪       ┌──────────┐ ║
║W │ Bedroom  │  Main Entrance │ Kitchen  │E║
║E │   2      │               │ (S-East) │A║
║S │ (West)   │               │          │S║
║T └──────────┘               └──────────┘T║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐ ║
║  │ Bathroom │  │ Master   │  │ Stair    │ ║
║  │ (N-West) │  │ Bedroom  │  │ case     │ ║
║  │          │  │ (S-West) │  │ (South)  │ ║
║  └──────────┘  └──────────┘  └──────────┘ ║
║               SOUTH                        ║
╚═══════════════════════════════════════════╝
\`\`\`

## 3. Vastu Rules — Dos & Don'ts

### ✅ DO's
- Place **main entrance** in an auspicious pada (${direction === 'North' ? '4th or 5th pada from North-East' : direction === 'East' ? '4th pada from North-East' : '4th or 5th pada from the corner'})
- Keep **North-East corner** open, light, and clutter-free
- Ensure **kitchen platform** faces East (cook should face East while cooking)
- Place **pooja facing East or North**
- Keep **master bedroom head** towards South or West wall
- Install **overhead water tank** in the South-West
- Use **light colors** (white, cream, light yellow) for North and East walls

### ❌ DON'Ts
- **Never** place toilet in North-East corner
- **Avoid** staircase in the center (Brahmasthan) of the house
- **Don't** place mirror opposite the bed in bedrooms
- **Avoid** kitchen directly opposite or adjacent to bathroom
- **Don't** keep heavy furniture in North-East
- **Avoid** underground water tank in South-West
- **Never** have main door opening outward

## 4. Vastu Remedies — Common Defects & Solutions

| Defect | Remedy |
|--------|--------|
| **South-West entrance (if unavoidable)** | Place a Vastu pyramid / brass lamp near door, use dark colored door |
| **Toilet in wrong direction** | Use light green tiles, place sea salt bowl, ensure ventilation |
| **Cut in North-East** | Place a crystal ball or water fountain in nearest N-E corner |
| **Staircase in center** | Place a Vastu yantra below staircase, use light colors |
| **Beam above bed** | Use false ceiling to conceal, or shift bed position |
| **Kitchen in North-East** | Place heavy granite slab, shift stove to S-E corner of kitchen |

## 5. Floor-wise Vastu Plan

### Ground Floor
- **N-E**: Pooja room + Open porch / garden area
- **S-E**: Kitchen with gas stove in S-E corner
- **S-W**: Master bedroom (head of family)
- **N-W**: Common bathroom + Car parking
- **Center**: Living room (keep well-lit and ventilated)

${floorsNum > 1 ? `### First Floor
- **N-E**: Study room / Children's room with study table in N-E
- **S-W**: Bedroom 2 (head of bed towards South wall)
- **N-W**: Guest bedroom / Store room
- **S-E**: Utility area / Open terrace
- **Center**: Family lounge (keep open and well-ventilated)` : ''}

${floorsNum > 2 ? `### Second Floor / Terrace
- **S-W**: Overhead water tank (2000L)
- **N-E**: Open terrace / Garden area (keep this side lower)
- **S-E**: Solar panel installation area
- **N-W**: Utility room / Washing area` : ''}

> **🔮 Vastu Tip for ${location}**: Given the ${climate} climate, ensure ample ventilation through jali work on the ${direction === 'North' || direction === 'East' ? 'South and West' : 'North and East'} walls to balance natural airflow as per Vastu.`,

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 5: CONSTRUCTION TIMELINE
    // ═══════════════════════════════════════════════════════════════════
    timeline: `# 📅 Construction Timeline — ${type}

## 1. Overall Duration

| Milestone | Timeline |
|-----------|----------|
| **Total Construction Period** | ${floorsNum <= 2 ? '10-14' : '14-18'} months |
| **Pre-Construction Phase** | 1-2 months |
| **Construction Phase** | ${floorsNum <= 2 ? '8-10' : '10-14'} months |
| **Final Finishing** | 1-2 months |
| **Expected Handover** | Month ${floorsNum <= 2 ? '12-14' : '16-18'} |

## 2. Phase-wise Timeline

### Phase 1: Pre-Construction (Month 1-2)

| Task | Duration | Details |
|------|----------|---------|
| **Site Survey & Soil Test** | Week 1-2 | Soil bearing capacity test, topographical survey |
| **Architectural Drawing** | Week 2-4 | Floor plans, elevations, 3D views, structural drawings |
| **Approval & Permits** | Week 3-6 | Building plan approval from ${location} Municipal Corporation |
| **Contractor Finalization** | Week 5-7 | Compare 3-4 quotes, finalize contract terms |
| **Material Procurement (Phase 1)** | Week 6-8 | Cement, steel, sand, aggregates booking |

### Phase 2: Foundation (Month 2-3)

| Task | Duration | Details |
|------|----------|---------|
| **Site Clearing** | 2-3 days | Remove debris, level the ground |
| **Excavation** | 4-5 days | Trench excavation for footings (depth: 4-5 ft) |
| **PCC (Plain Cement Concrete)** | 2-3 days | 1:4:8 mix, 150mm thick base |
| **RCC Footing** | 5-7 days | Isolated footings as per structural design |
| **Anti-termite Treatment** | 1-2 days | Chemical treatment of foundation soil |
| **Plinth Beam** | 5-7 days | RCC beams connecting all footings |
| **Plinth Filling** | 3-4 days | Sand/gravel filling up to plinth level |
| **DPC (Damp Proof Course)** | 1-2 days | Waterproof membrane at plinth level |

### Phase 3: Structure — Ground Floor (Month 3-5)

| Task | Duration | Details |
|------|----------|---------|
| **Column Casting** | 7-10 days | RCC columns as per structural drawing |
| **Brick/Block Work** | 15-20 days | AAC block walls (150mm & 200mm) |
| **Lintel Beam** | 5-7 days | Beams above doors and windows |
| **Roof Slab Casting** | 3-5 days | RCC slab (125-150mm thick) |
| **Curing Period** | 14-21 days | Minimum 14 days water curing for slab |

${floorsNum > 1 ? `### Phase 4: Structure — First Floor (Month 5-7)

| Task | Duration | Details |
|------|----------|---------|
| **Staircase Construction** | 5-7 days | Dog-legged / L-shaped staircase |
| **Column & Wall Work** | 15-20 days | First floor columns, walls |
| **Slab Casting** | 3-5 days | First floor roof slab |
| **Curing** | 14-21 days | Water curing |
| **Parapet Wall** | 3-5 days | 3 ft parapet on terrace |` : ''}

### Phase ${floorsNum > 1 ? '5' : '4'}: Finishing Phase 1 (Month ${floorsNum > 1 ? '7-9' : '5-7'})

| Task | Duration | Details |
|------|----------|---------|
| **Internal Plastering** | 15-20 days | 12mm cement plaster on all internal walls |
| **External Plastering** | 10-12 days | 20mm plaster with waterproof additive |
| **Electrical Conduit** | 7-10 days | PVC conduit + wiring (Havells / Polycab) |
| **Plumbing Rough-in** | 7-10 days | CPVC pipes, drainage lines |
| **Waterproofing** | 5-7 days | Terrace, bathrooms, kitchen wet areas |

### Phase ${floorsNum > 1 ? '6' : '5'}: Finishing Phase 2 (Month ${floorsNum > 1 ? '9-11' : '7-9'})

| Task | Duration | Details |
|------|----------|---------|
| **Flooring (Tiles)** | 10-15 days | Vitrified tiles, anti-skid in wet areas |
| **Door & Window Installation** | 7-10 days | Main door (teak), internal (flush), UPVC windows |
| **Kitchen Platform** | 5-7 days | Granite counter + stainless steel sink |
| **Bathroom Fittings** | 5-7 days | Sanitary ware, shower, taps (Hindware/Cera) |
| **False Ceiling** | 5-7 days | Gypsum false ceiling in living room + bedrooms |

### Phase ${floorsNum > 1 ? '7' : '6'}: Final Finishing (Month ${floorsNum > 1 ? '11-13' : '9-11'})

| Task | Duration | Details |
|------|----------|---------|
| **Painting** | 10-15 days | Primer + 2 coats emulsion (Asian/Berger) |
| **Modular Kitchen Installation** | 5-7 days | Cabinets, countertop, accessories |
| **Electrical Fixtures** | 3-5 days | Switches (Legrand/Schneider), lights, fans |
| **Wardrobe Installation** | 5-7 days | Sliding wardrobes in all bedrooms |
| **Final Plumbing** | 2-3 days | Tap fittings, geyser installation |

### Phase ${floorsNum > 1 ? '8' : '7'}: Handover (Month ${floorsNum > 1 ? '13-14' : '11-12'})

| Task | Duration | Details |
|------|----------|---------|
| **Deep Cleaning** | 2-3 days | Post-construction cleaning |
| **Final Inspection** | 1-2 days | Electrical, plumbing, structural check |
| **Snag List Resolution** | 3-5 days | Fix any defects found during inspection |
| **Completion Certificate** | 1-2 weeks | Obtain from local municipality |
| **Key Handover** | Day 1 | 🎉 Move-in ready! |

## 3. Seasonal Considerations for ${location}

| Season | Months | Construction Impact | Recommendation |
|--------|--------|-------------------|----------------|
| **Summer** | Mar-May | ✅ Best for construction | Ideal for foundation & structure work |
| **Monsoon** | Jun-Sep | ⚠️ Delays likely (20-30 days) | Avoid slab casting; cover materials; focus on indoor work |
| **Post-Monsoon** | Oct-Nov | ✅ Good conditions resume | Best for plastering and finishing |
| **Winter** | Dec-Feb | ✅ Good for finishing | Ideal for painting and interior work |

> **📌 Best Start Month for ${location}**: October-November. This allows foundation work before monsoon-free months and structural work completion before next monsoon.

## 4. Inspection Checkpoints ✅

| Checkpoint | Stage | What to Check |
|------------|-------|---------------|
| **#1** | After Foundation | Footing dimensions, steel placement, concrete grade |
| **#2** | Before Slab Casting | Beam reinforcement, shuttering alignment, slab thickness |
| **#3** | After Brick Work | Wall plumbness, mortar joints, lintel levels |
| **#4** | After Plumbing Rough-in | Pipe pressure test (24 hrs), drainage slope |
| **#5** | After Electrical | Wire gauge verification, Earth bonding test, MCB rating |
| **#6** | After Waterproofing | Ponding test on terrace (48 hrs), bathroom leak test |
| **#7** | After Plastering | Surface smoothness, corner angles, no cracks |
| **#8** | Final Inspection | All systems check, snag list, completion certificate |

> **⏱️ Estimated Handover**: Your ${bhk} ${type} in ${location} should be ready for move-in within **${floorsNum <= 2 ? '12-14' : '16-18'} months** from foundation start, assuming normal working conditions and no major delays.`
  };

  return mockData[sectionId] || mockData.summary;
}

// ─── Prompt builder for Gemini API ─────────────────────────────────────────
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

IMPORTANT: All costs should be in Indian Rupees (₹). Consider local Indian construction practices, materials, and regulations. Respond in a well-structured format with clear sections, markdown tables, and bullet points.`;

  const tabPrompts = {
    summary: `${baseContext}\n\nGenerate a COMPREHENSIVE PROJECT SUMMARY with sections: Project Overview, Space Planning (floor-wise), Key Highlights, Regulatory Considerations.`,
    cost: `${baseContext}\n\nGenerate a DETAILED COST ESTIMATION BREAKDOWN with: Overall Budget Summary, Material-wise Cost Breakdown (table), Phase-wise Cost, Labor Cost Estimate, Budget-Saving Tips. All costs in ₹ at current 2024-25 rates.`,
    interior: `${baseContext}\n\nGenerate INTERIOR DESIGN SUGGESTIONS with: Design Style, Room-wise Interior Plan, Color Scheme, Lighting Plan, Budget-wise Interior Packages.`,
    vastu: `${baseContext}\n\nGenerate a VASTU SHASTRA LAYOUT PLAN with: Plot Analysis, Room Placement Guide, Vastu Rules (Dos/Don'ts), Vastu Remedies, Floor-wise Vastu Plan.`,
    timeline: `${baseContext}\n\nGenerate a CONSTRUCTION TIMELINE with: Overall Duration, Phase-wise Timeline, Seasonal Considerations for ${location}, Inspection Checkpoints.`
  };

  return tabPrompts[tab] || tabPrompts.summary;
}

// ─── Try Gemini API, fallback to mock ──────────────────────────────────────
export async function generateAIPlan(projectData, sectionId) {
  // Try Gemini API first
  try {
    const prompt = buildPrompt(projectData, sectionId);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        }
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty AI response');
    }

    return { content: text, model: 'gemini-2.0-flash' };
  } catch (error) {
    // Gemini failed — use comprehensive mock data
    console.log(`Gemini API unavailable (${error.message}), using built-in data engine`);
    const mockContent = generateMockData(projectData, sectionId);

    // Simulate a brief delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    return { content: mockContent, model: 'smartbuild-engine' };
  }
}
