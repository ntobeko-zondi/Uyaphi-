# Uyaphi - Africa's Decentralized Commuter Trust & Verification Network

**Transform ride-hailing safety through community-driven intelligence**

A continental trust and safety intelligence platform empowering African passengers to verify drivers, report incidents in real-time, and participate in a gamified safety network that rewards community vigilance.

**Live Application:** [https://uyaphi-304072972581.europe-west2.run.app](https://uyaphi-304072972581.europe-west2.run.app)

---

## Table of Contents

1. [Overview](#overview)
2. [Live Status](#live-status)
3. [Getting Started](#getting-started-5-minutes)
4. [Core Features](#core-features)
5. [Technology Stack](#technology-stack)
6. [Environment Configuration](#environment-configuration)
7. [Available Commands](#available-commands)
8. [Project Structure](#project-structure)
9. [Key Components](#key-components-explained)
10. [Security & Data Protection](#security--data-protection)
11. [Accessibility Standards](#accessibility-standards)
12. [Deployment](#deployment)
13. [Future Roadmap](#future-roadmap)
14. [Contributing](#contributing)
15. [Performance Metrics](#performance-metrics)
16. [Support & Resources](#support--resources)
17. [License](#license)

---

## Overview

Uyaphi (Zulu/Xhosa: "Where are you going?") addresses critical safety gaps in African ride-hailing:

- Driver impersonation and credential fraud
- Offline-booking scams and fare manipulation
- Limited real-time intelligence on crime hotspots
- Accessibility barriers for low-vision and neurodivergent users

The solution: A decentralized platform where passengers cross-reference driver behavior, vehicle histories, and community safety reports—not just company profiles. Built with React 18, TypeScript, Tailwind CSS, and powered by Google Gemini AI.

---

## Live Status

| Component | Status |
|-----------|--------|
| **Application URL** | https://uyaphi-304072972581.europe-west2.run.app |
| **Deployment Status** | Ready |
| **Last Published** | June 27, 2026, 2:46:19 PM |
| **Region** | Europe-West2 (Google Cloud Run) |

---

## Getting Started (5 Minutes)

### Prerequisites
- Node.js v18+
- npm or yarn
- Google Gemini API key

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/ntobeko-zondi/Uyaphi-.git
cd Uyaphi-

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Add your Gemini API key to .env.local
GEMINI_API_KEY=AQ.Ab8RN6IiO-U1Zn5XR30uSuGhr6-UkoHHUx4yQzi_-8WnLcA8QQ

# 5. Start development server
npm run dev
```

The app will open at **http://localhost:5173** with hot module replacement enabled.

---

## Core Features

### Driver Search & Verification
Search drivers by name, license plate, or profile ID with instant verification results:
- Vehicle inspection status and compliance history
- Community reviews and passenger ratings
- Real-time safety flags and warnings
- Commendation tags ("Late Night Safety Hero", "Clean Vehicle")
- Smart fallback: Suggests registered drivers or prompts incident reporting

**Example:** A passenger in Lagos searches license plate "GP 92 RT" and instantly sees the driver's trust score, vehicle details, and community warnings about unsafe lane changes reported in the last 48 hours.

### Incident Reporting Engine
Comprehensive safety incident logging with:
- 5 Safety Categories: Unsafe driving, fare manipulation, route deviation, offline scams, vehicle condition
- Granular severity ratings (Low, Medium, High, Critical)
- Evidence attachment and documentation
- Draft auto-save to browser storage (survives network drops)
- Role-based moderation (Admin, Moderator, Commuter)
- Real-time incident feed visible to community searchers

**Example:** A user documents an unsafe driver with timestamp, location, severity, and optional evidence URL. The report feeds into the search console immediately—other commuters searching that driver see the warning before accepting a ride.

### Safety Journey (Gamified Engagement)
Reward system turning safety participation into an engaging experience:
- Experience Points (XP) for report submissions and accurate verifications
- Progressive Trust Levels: Commuter → Guardian → Community Guardian
- Milestone trackers with interactive progress bars
- Unlockable certifications and achievement badges
- Community leaderboards and recognition

**Impact:** Users stay engaged. Reports are higher quality. The community becomes self-reinforcing, with each verified incident improving collective safety.

### Comprehensive Accessibility
Built-in inclusive features ensuring usability for everyone:

| Feature | Description |
|---------|-------------|
| **Dyslexia Mode** | Real-time font override to JetBrains Mono with optimized tracking and line heights |
| **Dynamic Scaling** | Normal, Large, Extra Large layouts—instantly reflow without page reload |
| **High-Contrast Theme** | Pure blacks and ultra-bright borders optimized for tropical sunlight |
| **Language Support** | Zulu, Yoruba, Swahili, Amharic with instant toggle |
| **Error Recovery** | Global Error Boundary prevents crashes, logs to localStorage |

**Example:** A user in Cape Town with low vision enables Extra Large + High Contrast theme and switches to Zulu. The entire interface instantly repaints and reflows. They can safely search for drivers during their commute without reading strain.

### Developer & Moderator Panels
Administrative dashboards for real-time moderation queues, driver verification workflows, user role assignment, rate-limit monitoring, and security oversight.

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL with optimized indexing |
| **AI/ML** | Google Gemini API |
| **Deployment** | Google Cloud Run |
| **Authentication** | Clerk Auth (OAuth) |
| **State Management** | React Hooks + localStorage |
| **Build Tool** | Vite |

### Performance Architecture

- **Database Read/Write Split**: Reads routed to replicas (<15ms latency), writes async-queued
- **Intelligent Indexing**:
  - `idx_drivers_license_plate`: Sub-millisecond plate lookups
  - `idx_reports_city_category`: Regional threat aggregation
  - `idx_users_uuid`: Session verification and UUID lockouts
- **Client Persistence**: All state auto-saved to localStorage

---

## Environment Configuration

Create `.env.local` in your project root:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=AQ.Ab8RN6IiO-U1Zn5XR30uSuGhr6-UkoHHUx4yQzi_-8WnLcA8QQ

# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Environment
VITE_APP_ENV=development
```

**Never commit `.env.local` to version control.** The `.env.example` file is tracked in git as a template.

---

## Available Commands

```bash
# Development
npm run dev              # Start dev server with HMR (http://localhost:5173)

# Production
npm run build            # Create optimized production build
npm run preview          # Preview production build locally

# Quality Assurance
npm run lint             # Run ESLint and TypeScript checks
npm run type-check       # Run TypeScript compiler in check-only mode
```

---

## Project Structure

```
uyaphi/
├── src/
│   ├── components/
│   │   ├── DriverSearch.tsx          # Driver verification UI
│   │   ├── IncidentReporting.tsx     # Safety incident form
│   │   ├── SafetyJourney.tsx         # Gamification dashboard
│   │   ├── SettingsPage.tsx          # Accessibility & preferences
│   │   ├── ModeratorAdminPanel.tsx   # Admin moderation interface
│   │   └── AboutMePage.tsx           # Developer profile
│   ├── hooks/
│   │   ├── useLocalStorage.ts        # Persistent state
│   │   ├── useTheme.ts               # Dynamic theming
│   │   └── useErrorBoundary.ts       # Global error handling
│   ├── utils/
│   │   ├── validation.ts             # Input sanitization
│   │   ├── database.ts               # Query optimization
│   │   └── geminiClient.ts           # Gemini API integration
│   ├── styles/
│   │   └── globals.css               # Tailwind base & theme variables
│   ├── App.tsx                       # Root with error boundary
│   ├── index.tsx                     # Entry point
│   └── metadata.json                 # App config & localization
├── public/
│   └── assets/                       # Images, icons, static files
├── .env.example                      # Environment template
├── vite.config.ts                    # Build configuration
├── tsconfig.json                     # TypeScript config
└── package.json                      # Dependencies & scripts
```

---

## Key Components Explained

### DriverSearch.tsx
Real-time driver verification interface with dual-segment tabs ("Verify Driver ID" | "Verify License Plate"), auto-complete, fallback mechanism, and Active Community Notices carousel.

### IncidentReporting.tsx
Safety incident dispatch form with multi-category selection, severity ratings, evidence attachment, draft persistence, and dynamic driver dropdown.

### SafetyJourney.tsx
Gamification engine featuring XP calculation, milestone tracking, Trust Level progression, achievement badges, and leaderboards.

### SettingsPage.tsx
Accessibility & personalization controls: Dyslexia Mode toggle, font scaling, high-contrast theme, language selector (Zulu, Yoruba, Swahili, Amharic), voice guidance control.

### ModeratorAdminPanel.tsx
Administrative dashboard for incident review, driver verification workflows, user role assignment, and rate-limit monitoring.

---

## Security & Data Protection

### API Security
- All credentials stored server-side (never in browser bundle)
- XSS protection via strict input sanitization
- CORS headers configured per environment
- Role-based access control via Clerk Auth

### Rate Limiting
- Maximum 60 operations per minute per IP/UUID
- Breached attempts trigger 20-minute safety lockout
- Prevents credential-stuffing and abuse

### Data Validation
- Client-side TypeScript strict typing
- Server-side validation on all endpoints
- SQL injection prevention via parameterized queries
- Biometric token verification

---

## Accessibility Standards

Uyaphi is built to WCAG AAA standards:

- **Dyslexia Mode**: Monospace font (JetBrains Mono) with optimized tracking
- **Dynamic Scaling**: Real-time layout adjustment (Normal 16px → Large 20px → Extra Large 24px)
- **High-Contrast**: Pure blacks with ultra-bright borders for sunlight legibility
- **Error Resilience**: Global Error Boundary prevents crashes, logs diagnostics

---

## Deployment

### Production Build

```bash
# Generate optimized build
npm run build

# Output: dist/ directory with minified JS/CSS, tree-shaken code, preload directives
```

### Google Cloud Run

```bash
# Build Docker image
gcloud builds submit --tag gcr.io/[PROJECT-ID]/uyaphi

# Deploy to Cloud Run
gcloud run deploy uyaphi \
  --image gcr.io/[PROJECT-ID]/uyaphi:latest \
  --platform managed \
  --region europe-west2 \
  --set-env-vars GEMINI_API_KEY=[YOUR_API_KEY]
```

### Docker Configuration

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## Future Roadmap

### Phase 1: AI Visual Authentication (Q3 2026)
Gemini Vision API for automatic vehicle photo verification, license plate OCR, and fraudulent submission filtering.

### Phase 2: Geospatial Intelligence (Q4 2026)
Interactive crime hotspot heatmaps, safe route planning, and real-time cluster alerts.

### Phase 3: Offline-First PWA (Q1 2027)
Service workers for offline incident reporting with automatic sync when connectivity resumes.

### Phase 4: Real-Time Notifications (Q2 2027)
WebSocket infrastructure for instant alerts, community broadcasts, and peer-to-peer notifications within geographic radius.

---

## Contributing

### Getting Started

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run lint && npm run type-check

# Commit with clear messages
git commit -m "feat: add your feature description"

# Push and open Pull Request
git push origin feature/your-feature-name
```

### Guidelines
- Follow TypeScript strict mode
- Use functional components with hooks
- Maintain WCAG AAA accessibility standards
- Write descriptive commit messages
- Ensure all tests pass before submitting PR

### Commit Message Format
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: improve code style
refactor: restructure code
test: add tests
perf: improve performance
```

---

## Performance Metrics

| Metric | Target |
|--------|--------|
| Database Query Response | <15ms (read replicas) |
| License Plate Lookup | <1ms (optimized indexing) |
| Page Load Time | <2s (production) |
| Lighthouse Performance | 90+ |
| Accessibility Score | 99+ (WCAG AAA) |

---

## Support & Resources

- **Live App**: [https://uyaphi-304072972581.europe-west2.run.app](https://uyaphi-304072972581.europe-west2.run.app)
- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Join community conversations
- **Email**: ntobekozondi99@gmail.com

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

Built with care for African commuters. Special thanks to:
- React and TypeScript communities
- Google Cloud and Gemini API
- All contributors and early users
- African cities where safety matters

---

**Uyaphi: Where community-driven intelligence creates safer commutes across Africa.**
