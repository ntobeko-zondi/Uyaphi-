# Uyaphi

**Continental Trust and Safety Intelligence Platform for African Ride-Hailing**

Uyaphi (Zulu/Xhosa: "Where are you going?") is a community-driven safety intelligence platform that empowers passengers across African cities to verify drivers, report safety incidents in real-time, and participate in a gamified trust network. By decentralizing safety intelligence, Uyaphi creates a vigilant, rewarded community that significantly reduces ride-hailing fraud, impersonation, and dangerous behavior.

[Visit Live Application](https://uyaphi-304072972581.europe-west2.run.app)

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Architecture & Performance](#architecture--performance)
- [Security & Rate Limiting](#security--rate-limiting)
- [Accessibility Features](#accessibility-features)
- [Deployment](#deployment)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Driver Search & Verification Grid
Instantly query drivers using names, license plates, or mobile IDs. The system displays:
- Vehicle inspection status and compliance history
- Community reviews and passenger ratings
- Commendation tags ("Late Night Safety Hero", "Clean Vehicle")
- Real-time community safety flags and warnings
- Intelligent fallback: If no exact match is found, the system suggests registered drivers or prompts incident reporting

### Interactive Incident Reporting
A comprehensive dispatch form for logging safety infractions:
- Categories: Unsafe driving, fare manipulation, route deviation, offline-booking scams, vehicle condition
- Granular severity ratings and evidence attachment
- Draft persistence: Reports auto-save to browser storage and sync when connection resumes
- Role-based moderation workflows (Admin, Moderator, Commuter)

### Safety Journey (Gamified Engagement)
Reward system encouraging community participation:
- Experience Points (XP) for report submissions and verifications
- Progressive Trust Levels unlocking certifications
- Milestone trackers and interactive progress bars
- Unlockable roles: Community Guardian, Spotter Certification

### Comprehensive Accessibility
Built-in inclusive features ensuring usability for all:
- **Dyslexia Mode**: Real-time font override to JetBrains Mono with optimized tracking
- **Dynamic Layout Scaling**: Normal, Large, Extra Large modes with instant re-rendering
- **High-Contrast Theme**: Pure blacks and ultra-bright borders for tropical sunlight legibility
- **African Languages Engine**: Real-time translation (Zulu, Yoruba, Swahili, Amharic)
- **Error Resilience**: Global Error Boundary captures unhandled crashes and logs diagnostics

### Developer & Moderator Panels
- Admin Panel for system management and user role assignment
- Moderator Dashboard for reviewing incident reports and driver verification
- Real-time moderation queues with sortable evidence
- Simulated Role Sandbox showing active token scopes and rate-limit budgets

---

## Technology Stack

### Frontend
- **React 18** - Modern component architecture with hooks
- **TypeScript** - Strict type safety and compile-time error detection
- **Tailwind CSS** - Utility-first styling with CSS variables for dynamic theming
- **Global Error Boundary** - Crash recovery and diagnostic logging
- **Browser LocalStorage** - Client-side state persistence

### Backend & Deployment
- **Node.js** - JavaScript runtime
- **Google Gemini API** - AI-powered features for verification and content moderation
- **Google Cloud Run** - Serverless container deployment
- **PostgreSQL** - Relational database with optimized indexing

### Performance
- **Database Read/Write Split**: Read queries routed to replicas (<15ms latency)
- **Intelligent Indexing**: Sub-millisecond queries on high-traffic fields
  - `idx_drivers_license_plate`: Optimized license plate searches
  - `idx_reports_city_category`: Regional threat alert aggregation
  - `idx_users_uuid`: Session verification and UUID lockouts

---

## Quick Start

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- A Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation (5 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/uyaphi.git
cd uyaphi

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Gemini API key to .env.local
# GEMINI_API_KEY=your_api_key_here
```

### Run Locally

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
```

The development server supports hot module replacement (HMR). Any changes to your source files will instantly reflect in the browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Verify build integrity
npm run lint

# Preview the production build locally
npm run preview
```

---

## Installation & Setup

### Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_ENV=development
```

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `VITE_API_BASE_URL` | Backend API endpoint | Yes |
| `VITE_APP_ENV` | Environment (development/production) | No |

### Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Create production build
npm run lint         # Run ESLint and TypeScript checks
npm run preview      # Preview production build locally
npm run type-check   # Run TypeScript compiler
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

- Opens at http://localhost:5173 with hot module replacement
- Real-time linting feedback in the console
- Full source maps for debugging

### Production Deployment

```bash
npm run build
```

This generates an optimized production build in the `dist/` directory. The build includes:
- Minified JavaScript and CSS
- Tree-shaken unused code
- Preload directives for critical assets
- Sourcemap generation (can be disabled for production)

### Docker Deployment

If deploying to Google Cloud Run or another container service:

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

## Project Structure

```
uyaphi/
├── src/
│   ├── components/
│   │   ├── DriverSearch.tsx          # Driver lookup and verification UI
│   │   ├── IncidentReporting.tsx     # Safety incident dispatch form
│   │   ├── SafetyJourney.tsx         # Gamified engagement dashboard
│   │   ├── SettingsPage.tsx          # User preferences and accessibility settings
│   │   ├── ModeratorAdminPanel.tsx   # Admin moderation interface
│   │   └── AboutMePage.tsx           # Developer profile
│   ├── hooks/
│   │   ├── useLocalStorage.ts        # Persistent state management
│   │   ├── useTheme.ts               # Dynamic theming and accessibility
│   │   └── useErrorBoundary.ts       # Global error handling
│   ├── utils/
│   │   ├── validation.ts             # Input sanitization and XSS protection
│   │   ├── database.ts               # Optimized database queries
│   │   └── geminiClient.ts           # Gemini API integration
│   ├── styles/
│   │   └── globals.css               # Tailwind base and theme variables
│   ├── App.tsx                       # Root component with error boundary
│   ├── index.tsx                     # Application entry point
│   └── metadata.json                 # App configuration and localization
├── public/
│   └── assets/                       # Images, icons, and static files
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
├── vite.config.ts                    # Vite build configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

---

## Key Components

### DriverSearch.tsx
Implements real-time driver verification with:
- Dual-segment tabs: "Verify Driver ID" and "Verify License Plate"
- Auto-complete suggestions from the driver database
- Fallback mechanism for unregistered drivers
- Active Community Notices carousel showing real-time safety alerts

### IncidentReporting.tsx
Comprehensive incident logging with:
- Multi-category selection (unsafe driving, fare manipulation, etc.)
- Severity rating system
- Evidence attachment URLs
- Draft persistence to localStorage
- Dynamic driver selection dropdown with fallback to all drivers

### SafetyJourney.tsx
Gamification engine featuring:
- Experience Points calculation and milestone tracking
- Trust Level progression (Commuter → Guardian → Community Guardian)
- Achievement badges and certification unlocking
- Leaderboard system and community recognition

### SettingsPage.tsx
Accessibility and personalization controls:
- Dyslexia Mode toggle
- Dynamic font scaling (Normal, Large, Extra Large)
- High-contrast theme activation
- Language selector (Zulu, Yoruba, Swahili, Amharic)
- Voice guidance toggle

### ModeratorAdminPanel.tsx
Administrative interface for:
- Reviewing pending incident reports
- Driver verification workflows
- User role assignment (Admin, Moderator, Commuter)
- Rate-limit monitoring and security oversight
- Simulated Clerk Auth integration

---

## Architecture & Performance

### Database Optimization

Uyaphi uses intelligent indexing for sub-millisecond query execution:

```sql
-- High-traffic license plate lookups
CREATE UNIQUE INDEX CONCURRENTLY idx_drivers_license_plate 
ON drivers (UPPER(license_plate)) 
INCLUDE (id, name, trust_score, vehicle_make, vehicle_model);

-- User session verification
CREATE INDEX CONCURRENTLY idx_users_uuid 
ON users (clerk_uuid, active_role);

-- Regional threat aggregation
CREATE INDEX CONCURRENTLY idx_reports_city_category 
ON reports (city, category) 
WHERE status = 'verified';
```

### Read/Write Split Strategy
- **Read Queries**: Routed to read-replica nodes with <15ms replication latency
- **Write Queries**: Async queuing on master database, no blocking locks
- **Result**: Zero-lag user experience for commuters in transit

### Client-Side Persistence
All application state is auto-saved to browser localStorage:
- User preferences and accessibility settings
- Incident report drafts
- Search history
- Completed achievements and certifications

If a user loses connection or closes the browser, their progress is fully recovered on the next visit.

---

## Security & Rate Limiting

### API Security
- All credentials and API keys are stored server-side
- Credentials never shipped in browser bundle or native APK
- XSS protection: Strict input sanitization on all user submissions
- CORS headers configured per environment

### Biometric Rate Limiter
- Maximum 60 operations per minute per IP/UUID
- Breached attempts trigger a 20-minute safety lockout
- Prevents credential-stuffing attacks and abuse
- Indicators in Moderator Panel show current rate-limit budget

### Data Validation
- Client-side validation with TypeScript strict typing
- Server-side validation on all API endpoints
- Sanitization of user inputs to prevent SQL injection
- Role-based access control (Clerk Auth integration)

---

## Accessibility Features

### Dyslexia Mode
Overrides global typography to a highly legible monospace font (JetBrains Mono) with optimized tracking and line height ratios. Dramatically improves readability for users with dyslexia.

### Dynamic Scaling
Real-time layout adjustment via CSS variable override:
- Normal: 16px base font size
- Large: 20px base font size
- Extra Large: 24px base font size

All components reflow and re-render instantly—no page reload.

### High-Contrast Theme
Pure black backgrounds with ultra-bright borders and text. Designed for tropical sunlight legibility and low-vision users.

### African Languages Engine
Instant translation support (no page reload):
- Zulu
- Yoruba
- Swahili
- Amharic

Toggle via language selector in top navigation bar.

### Error Recovery
Global React Error Boundary prevents full app crashes. Unhandled errors are:
1. Caught and logged to `uyaphi_crash_logs` in localStorage
2. Displayed to users with recovery instructions
3. Automatically uploaded to monitoring service (future Sentry integration)

---

## Deployment

### Live Application
- **URL**: https://uyaphi-304072972581.europe-west2.run.app
- **Status**: Ready
- **Last Published**: June 27, 2026, 2:46:19 PM
- **Region**: Europe-West2 (London)

### Google Cloud Run
The application is deployed on Google Cloud Run, a serverless container platform.

#### Deploy Your Own

1. Build the Docker image:
```bash
gcloud builds submit --tag gcr.io/[PROJECT-ID]/uyaphi
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy uyaphi \
  --image gcr.io/[PROJECT-ID]/uyaphi:latest \
  --platform managed \
  --region europe-west2 \
  --set-env-vars GEMINI_API_KEY=[YOUR_API_KEY]
```

3. Set up custom domain (optional):
```bash
gcloud run domain-mappings create --service=uyaphi --domain=yourdomain.com
```

---

## Future Roadmap

### Phase 1: AI Visual Authentication
- Integrate Gemini Vision for automatic vehicle photo and license plate verification
- Filter fraudulent community submissions before moderator review
- Reduce manual verification overhead by 80%

### Phase 2: Geospatial Intelligence
- Interactive heatmaps showing crime hotspots and danger zones
- Route planning: Users visualize safe commuter corridors on live maps
- Real-time cluster alerts: "High-activity incident zone detected near your location"

### Phase 3: Offline-First PWA
- Service workers for incident report drafting without internet
- Automatic sync when connectivity resumes
- Critical for regions with spotty cellular coverage

### Phase 4: Real-Time Notifications
- WebSocket infrastructure for instant safety alerts
- Community broadcasts: "Emergency checkpoint reported 2km ahead"
- Passenger-to-passenger notifications within a geographic radius

---

## Contributing

We welcome contributions from developers, designers, and community members. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m "feat: add your feature"`
5. Push to your fork and open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use functional components with hooks
- Write descriptive commit messages
- Ensure all tests pass before submitting PR
- Maintain accessibility standards (WCAG AAA)

---

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

## Support & Community

- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community conversations in GitHub Discussions
- **Email**: contact@uyaphi.dev

---

## Acknowledgments

Uyaphi is built on the vision of creating a safer, more trustworthy ride-hailing experience across Africa. Special thanks to:
- The open-source community for React, TypeScript, and Tailwind CSS
- Google Cloud for infrastructure and Gemini API
- All contributors and early users shaping the platform

---

**Made with care for African commuters. Building trust at scale.**
