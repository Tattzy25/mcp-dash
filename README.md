# Bridgit AI - Data Generation & Visualization Platform

> **"From raw numbers to rhythmic nonsense, courtesy of Bridgit AI"**

## 🎯 Project Overview

**Bridgit AI** (stylized as "Brigit AI" in some files) is a modern Next.js 15-based data manipulation and generation platform that transforms user inputs into structured, editable datasets. The platform combines AI-powered data generation with real-world API integrations, featuring an intuitive dashboard interface for multiple data manipulation workflows.

### Core Mission
Create, visualize, and manipulate datasets on-the-fly without persistence—providing a temporary workspace for data experimentation, prototyping, and exploration.

---

## 🏗️ Architecture

### Tech Stack

**Frontend Framework:**
- **Next.js 15.5.6** (App Router with Turbopack)
- **React 19.1.0** with Server Components
- **TypeScript 5**

**UI/UX:**
- **Tailwind CSS 4** with custom PostCSS configuration
- **shadcn/ui** component library (custom configured)
- **Radix UI** primitives for accessible components
- **Kokonut UI** for advanced animations (card-flip, liquid glass, shimmer effects)
- **Motion** (formerly Framer Motion) for animations
- **Lucide React** + **Tabler Icons** for iconography

**Data Visualization:**
- **Recharts 2.15.4** for interactive charts
- **TanStack Table 8** for advanced data grids with sorting, filtering, pagination
- **dnd-kit** for drag-and-drop interactions

**State Management:**
- Client-side React hooks (`useState`, `useEffect`, `useMemo`)
- Server Actions for API calls
- No global state management (intentionally ephemeral)

**Utilities:**
- **Zod 4** for schema validation
- **clsx** + **tailwind-merge** for className management
- **Sonner** for toast notifications

---

## 📁 Project Structure

```
brigit-ai/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (default Next.js template)
│   ├── layout.tsx                # Root layout with theme provider
│   ├── globals.css               # Global styles + Tailwind directives
│   │
│   ├── actions/                  # Server Actions
│   │   ├── radio-browser.ts      # Radio Browser API integration
│   │   └── scrape.ts             # Tavily API web scraping (in progress)
│   │
│   └── dashboard/                # Main application dashboard
│       ├── layout.tsx            # Sidebar + header layout
│       ├── page.tsx              # Dashboard home (stats cards + chart + table)
│       ├── data.json             # Mock data for dashboard table
│       │
│       ├── ask-bridgit-ai/       # AI prompt-based data generation
│       │   └── page.tsx
│       ├── headers/              # Manual column definition workflow
│       │   └── page.tsx
│       ├── matrix/               # Row × Column matrix builder
│       │   └── page.tsx
│       ├── url/                  # URL scraping to tabular data
│       │   └── page.tsx
│       ├── stations/             # Real radio stations from Radio Browser API
│       │   ├── page.tsx
│       │   └── stations-grid.tsx
│       └── templates/            # Template library (placeholder)
│           └── page.tsx
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui base components
│   ├── kokonutui/                # Advanced animations
│   │   ├── card-flip.tsx         # 3D flip cards for stations
│   │   ├── liquid-glass-card.tsx # Glassmorphism effect
│   │   ├── shimmer-text.tsx      # Animated text
│   │   └── ai-voice.tsx          # Voice recording UI
│   │
│   ├── app-sidebar.tsx           # Main navigation sidebar
│   ├── site-header.tsx           # Top header with breadcrumbs
│   ├── ai-02.tsx                 # AI prompt input with presets
│   ├── data-table.tsx            # Advanced TanStack table (808 lines!)
│   ├── editable-data-grid.tsx    # Inline cell editing grid
│   ├── data-preview.tsx          # Multi-format output (Table/CSV/JSON/SQL)
│   ├── chart-area-interactive.tsx # Interactive area chart
│   └── section-cards.tsx         # Dashboard metric cards
│
├── lib/
│   └── utils.ts                  # cn() utility for className merging
│
├── hooks/
│   └── use-mobile.ts             # Responsive breakpoint hook
│
├── public/                       # Static assets
│
├── components.json               # shadcn/ui configuration
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config (Turbopack enabled)
├── postcss.config.mjs            # Tailwind PostCSS
├── eslint.config.mjs             # ESLint 9 flat config
└── package.json
```

---

## 🚀 Key Features

### 1. **Ask Bridgit AI** (`/dashboard/ask-bridgit-ai`)
**Purpose:** Natural language → structured dataset generation

**Features:**
- AI-powered prompt input with preset suggestions
- Creativity mode selector (Realistic, Creative, Random)
- Real-time dataset preview
- Inline editing of generated data
- Multi-format export (CSV, JSON, SQL, Neon, Supabase)

**Status:** 🚧 UI complete, backend integration pending

**How It Works:**
1. User enters description: *"Generate customer database with name, email, company"*
2. Bridgit AI (to be connected) generates structured data
3. Results display in editable grid
4. Export in multiple formats

---

### 2. **Headers** (`/dashboard/headers`)
**Purpose:** Manual column definition → auto-populated grid

**Features:**
- Add/remove column headers dynamically
- Set row count
- Generate empty grid with custom structure
- Inline cell editing
- No persistence (clears on navigation)

**Status:** ✅ Fully functional (placeholder data)

**Use Case:** 
- Quick data structure prototyping
- Form field planning
- Spreadsheet-like editing

---

### 3. **Matrix** (`/dashboard/matrix`)
**Purpose:** Row headers × Column headers = cross-reference table

**Features:**
- Define row dimensions (e.g., "Feature A", "Feature B")
- Define column dimensions (e.g., "Option 1", "Option 2")
- Auto-generate comparison matrix
- Perfect for feature comparison tables

**Status:** ✅ Fully functional

**Example:**
```
          | Option 1 | Option 2 | Option 3
----------|----------|----------|----------
Feature A |          |          |
Feature B |          |          |
```

---

### 4. **URL** (`/dashboard/url`)
**Purpose:** Web scraping → clean tabular data

**Features:**
- Enter any web URL
- Basic vs. Advanced scraping modes
- Optional header inclusion
- Tavily API integration (configured but not active)
- Multi-format export

**Status:** 🚧 UI complete, Tavily API integration in progress

**Planned Integration:**
- Uses Tavily MCP (Model Context Protocol) for web extraction
- Requires `TAVILY_API_KEY` environment variable
- Advanced mode for complex page structures

---

### 5. **Stations** (`/dashboard/stations`)
**Purpose:** Real radio station browser with live streaming data

**Features:**
- ✅ **LIVE DATA** from Radio Browser API (https://radio-browser.info)
- DNS-based server discovery with fallback
- Genre-based filtering (hip hop, EDM, techno, reggaeton, R&B, rap, electronic)
- Real-time search across 150+ stations
- 3D flip cards with station metadata
- Click tracking integration ready
- Animated AI voice component + glassmorphic audio player UI

**Status:** ✅ Fully functional with real API

**Technical Highlights:**
```typescript
// Auto-discovers Radio Browser servers via DNS
const servers = await dns.resolveSrv('_api._tcp.radio-browser.info')

// Fetches top 20 stations per genre
const stations = await getStationsByGenres(['edm', 'techno'], 20)

// Returns structured data:
{
  stationuuid: "unique-id",
  title: "Station Name",
  streamUrl: "https://stream.url",
  codec: "MP3",
  bitrate: 128,
  clickcount: 15234
}
```

**Implementation Details:**
- Server-side data fetching (React Server Components)
- 1-hour cache revalidation
- Quality filtering (broken stations excluded)
- Deduplication across genres
- Sorted by popularity (click count)

---

### 6. **Dashboard Home** (`/dashboard`)
**Purpose:** Overview metrics + data visualization

**Components:**
- 4 metric cards (Revenue, Customers, Accounts, Growth)
- Interactive area chart (Desktop vs. Mobile traffic)
- Sortable data table with 615 rows (document sections)
- Row drag-and-drop reordering
- Column visibility controls
- Pagination + filtering

**Status:** ✅ Fully functional (mock data)

---

## 🎨 Design System

### Theme
- **Dark/Light mode** via `next-themes`
- System preference detection
- Persistent user selection
- CSS variables for color tokens

### Typography
- **Geist Sans** + **Geist Mono** fonts
- Fluid sizing with container queries (`@container`)
- Tailwind typography utilities

### Components Architecture
```
shadcn/ui (base) → Radix UI (primitives) → Custom styling
                                       ↓
                              Kokonut UI (animations)
```

### Animation Philosophy
- **Subtle micro-interactions** (hover effects, transitions)
- **Performance-first** (CSS transforms > layout thrashing)
- **Accessibility-aware** (respects `prefers-reduced-motion`)

---

## 🔧 Core Components Deep Dive

### `data-table.tsx` (808 lines)
The most complex component—a fully-featured enterprise data grid:

**Features:**
- Column sorting (asc/desc/none)
- Global search + column-specific filters
- Pagination (10/20/50/100/200/500 rows per page)
- Column visibility toggling
- Row selection (checkboxes)
- **Drag-and-drop row reordering** (dnd-kit)
- Mobile-responsive drawer for row details
- Expandable row charts (inline visualizations)
- Customizable column definitions via TanStack Table

**Usage:**
```tsx
<DataTable 
  data={data} 
  columns={[
    { accessorKey: "header", header: "Header" },
    { accessorKey: "status", header: "Status" }
  ]}
/>
```

---

### `editable-data-grid.tsx`
**Purpose:** Google Sheets-like inline editing

**Features:**
- Click-to-edit cells
- Add/remove rows dynamically
- Add/remove columns
- Rename column headers
- Real-time change callbacks

**Usage:**
```tsx
<EditableDataGrid 
  dataset={{ columns: ["Name", "Email"], rows: [...] }}
  onChange={(updatedDataset) => saveData(updatedDataset)}
/>
```

---

### `data-preview.tsx`
**Purpose:** Multi-format data export preview

**Tabs:**
1. **Table** - Interactive editable grid
2. **CSV** - Comma-separated values
3. **JSON** - Pretty-printed JSON array
4. **SQL** - Generic INSERT statements
5. **Neon SQL** - Neon.tech optimized
6. **Supabase SQL** - Supabase optimized

**Smart Formatting:**
- CSV escaping for commas/quotes
- SQL value sanitization
- JSON null handling
- Copy-to-clipboard buttons

---

### `ai-02.tsx`
**Purpose:** Flexible AI prompt interface

**Features:**
- Preset prompt buttons
- Auto-expanding textarea
- Creativity mode selector
- Loading states
- Customizable prompts via props

**Designed for:**
- Ask Bridgit AI page
- Any AI-powered generation workflow

---

## 🌐 External Integrations

### ✅ Radio Browser API
**Status:** Fully integrated

**Endpoints Used:**
- `GET /json/stations/search` - Search by genre/name
- `GET /json/url/{uuid}` - Track clicks + get stream URL

**Features:**
- DNS-based load balancing
- Automatic server failover
- Quality filtering
- Caching (1-hour revalidation)

**Documentation:** See `RADIO_BROWSER_INTEGRATION.md`

---

### 🚧 Tavily API (Web Scraping)
**Status:** Configured, not active

**Purpose:** Extract structured data from web pages

**Implementation:**
```typescript
// In app/actions/scrape.ts
const response = await fetch(`https://mcp.tavily.com/mcp/?tavilyApiKey=${process.env.TAVILY_API_KEY}`, {
  method: "POST",
  body: JSON.stringify({
    method: "tools/call",
    params: {
      name: "tavily-extract",
      arguments: { urls: [url], extract_depth: "basic" }
    }
  })
})
```

**Required:**
- `.env.local` with `TAVILY_API_KEY`
- Response parsing implementation

---

## 🗄️ Data Flow

### Ephemeral by Design
**NO DATABASE** - All data exists in:
1. Component state (`useState`)
2. Server-side caching (Next.js fetch cache)
3. API responses (Radio Browser, Tavily)

**Why?**
- Fast prototyping without setup
- No data persistence concerns
- Clears on navigation (intentional UX)
- Perfect for demos/exploration

### Data Lifecycle
```
User Input → Server Action → API Call → Transform → Client State
     ↓                                              ↓
  Navigate Away                              Display in Grid
     ↓                                              ↓
  Data Cleared ← ← ← ← ← ← ← ← ← ← ← ← User Edits
```

---

## 🎭 User Experience Patterns

### Navigation
- **Collapsible sidebar** (shadcn/ui Sidebar)
- **Breadcrumb header** with page context
- **Quick links** section for common tasks
- **User profile menu** (bottom sidebar)

### Interaction Paradigms
1. **Form → Preview → Edit → Export** (Ask Bridgit AI, URL)
2. **Define → Generate → Edit** (Headers, Matrix)
3. **Browse → Search → Select** (Stations)
4. **View → Analyze → Interact** (Dashboard)

### Feedback Mechanisms
- Toast notifications (Sonner)
- Loading spinners
- Skeleton screens
- Inline validation
- Error states

---

## 📦 Package Highlights

### Dependencies Breakdown

**Core Framework:**
```json
{
  "next": "15.5.6",        // Latest Next.js with Turbopack
  "react": "19.1.0",       // Latest React with new features
  "react-dom": "19.1.0"
}
```

**UI Primitives:**
```json
{
  "@radix-ui/*": "^1-2",   // 15+ accessible component primitives
  "lucide-react": "^0.552", // 1000+ icons
  "@tabler/icons-react": "^3.35" // Alternative icon set
}
```

**Data Management:**
```json
{
  "@tanstack/react-table": "^8.21",  // Headless table library
  "@dnd-kit/*": "^6-10",             // Drag-and-drop toolkit
  "recharts": "^2.15",               // Charting library
  "zod": "^4.1"                      // Runtime validation
}
```

**Animations:**
```json
{
  "motion": "^12.23",                // Successor to Framer Motion
  "class-variance-authority": "^0.7" // Type-safe CSS variants
}
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+** (recommended)
- **pnpm** (preferred package manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tattzy25/datarama.git brigit-ai
   cd brigit-ai
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables** (optional):
   ```bash
   # Create .env.local
   TAVILY_API_KEY=your_tavily_api_key_here
   ```

4. **Run development server:**
   ```bash
   pnpm dev
   ```

5. **Open browser:**
   ```
   http://localhost:3000/dashboard
   ```

### Build for Production

```bash
# Build with Turbopack
pnpm build

# Start production server
pnpm start
```

---

## 🗺️ Roadmap & TODOs

### High Priority
- [ ] **AI Backend Integration** - Connect Ask Bridgit AI to actual LLM
- [ ] **Tavily API Completion** - Finish URL scraping implementation
- [ ] **Audio Playback** - Wire up Radio Browser stream URLs to player
- [ ] **Export Functionality** - Download as CSV/JSON/SQL files

### Medium Priority
- [ ] **Templates System** - Pre-built dataset templates
- [ ] **Data Persistence Option** - Optional save to localStorage
- [ ] **Share Links** - URL-encoded dataset sharing
- [ ] **Keyboard Shortcuts** - Power user navigation

### Nice to Have
- [ ] **Dark Mode Improvements** - Custom theme builder
- [ ] **Mobile Optimization** - Touch gestures for grids
- [ ] **Collaboration Mode** - Real-time multi-user editing
- [ ] **AI Suggestions** - Smart column type detection

---

## 🧩 Component Library (Kokonut UI)

### Custom Animations

**`card-flip.tsx`**
- 3D card rotation on hover
- Dual-sided content (front/back)
- Smooth perspective transforms
- Used in Stations grid

**`liquid-glass-card.tsx`**
- Glassmorphism effect
- Backdrop blur + gradient borders
- Animated pseudo-elements
- Perfect for overlays

**`shimmer-text.tsx`**
- Gradient text animation
- Horizontal shimmer effect
- Used in page headers

**`ai-voice.tsx`**
- Microphone visualization
- Recording timer
- Pulsing animations
- Voice input UI

---

## 📊 Code Statistics

- **Total Components:** 50+ (UI + custom)
- **Routes:** 7 dashboard pages
- **Server Actions:** 2 (radio-browser, scrape)
- **Largest File:** `data-table.tsx` (808 lines)
- **TypeScript:** 100% typed
- **Styling:** Tailwind CSS (zero custom CSS)

---

## 🤝 Contributing

This appears to be a private project under development. Key areas needing contribution:

1. **AI Integration** - LLM provider setup
2. **API Completions** - Tavily implementation
3. **Testing** - No test suite currently
4. **Documentation** - API docs, component stories

---

## 📄 License

Not specified in repository (private project).

---

## 👤 Author

**Tattzy25** (GitHub)  
Repository: `datarama` (deployed as Bridgit AI)

---

## 🔗 Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Kokonut UI](https://kokonutui.com)
- [Radio Browser API](https://radio-browser.info)
- [Tavily API](https://tavily.com)
- [TanStack Table](https://tanstack.com/table)

---

## 🎯 Summary

**Bridgit AI** is a modern, ephemeral data workspace that bridges the gap between:
- 🤖 AI-powered generation (planned)
- 🌐 Real-world API integration (active)
- 📊 Interactive data visualization (complete)
- ✏️ Inline editing workflows (complete)

Built with cutting-edge React 19 + Next.js 15, it showcases:
- Server Components for performance
- Advanced UI animations
- Complex state management without persistence
- Multi-format data export
- Real-time API integrations

**Status:** 🚧 Active development, core features functional, AI integration pending.

---

*Last Updated: November 6, 2025*
*README Generated by: Comprehensive code investigation (not from existing docs)*