# Jback - Cross-Cultural Feedback Intelligence


## What is Jback?

Jback helps global businesses understand customer feedback across 100+ languages with cultural intelligence. A 5-star review in Japan might indicate dissatisfaction (cultural politeness), while direct German criticism could be constructive feedback. Jback bridges this gap using real-time streaming and AI.

## Features

- **Multi-Language Support** - Collect feedback in 100+ languages with automatic detection and translation
- **Cultural Intelligence** - AI analysis that understands cultural context and communication styles
- **Real-Time Streaming** - Confluent Cloud (Apache Kafka) for instant feedback processing
- **Smart Dashboard** - Visualize sentiment trends, language distribution, and cultural insights
- **AI Chat Assistant** - Interactive analysis powered by Google Gemini with real-time data context
- **Customizable Widgets** - Embed feedback forms with your brand styling
- **Easy Integration** - Single script tag, direct links, or QR codes

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, TypeScript, TailwindCSS, shadcn/ui |
| AI Engine | Google Gemini AI |
| Real-time Streaming | Confluent Cloud (Apache Kafka) |
| Database | TiDB Serverless + Prisma ORM |
| Authentication | NextAuth.js |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- Confluent Cloud account 
- Google AI Studio API key
- TiDB Serverless account

### Installation

```bash
# Clone repository
git clone https://github.com/izzanoor41/Jback
cd Jback

# Install dependencies
npm install --legacy-peer-deps

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | TiDB connection string |
| `AUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key from Google AI Studio |
| `CONFLUENT_BOOTSTRAP_SERVERS` | Kafka bootstrap servers |
| `CONFLUENT_API_KEY` | Confluent API key |
| `CONFLUENT_API_SECRET` | Confluent API secret |

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  User Feedback  │────▶│  Confluent Cloud │────▶│  Google Gemini  │
│   (100+ langs)  │     │   (Kafka Stream) │     │   (AI Analysis) │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
                                                ┌─────────────────┐
                                                │  TiDB Database  │
                                                └─────────────────┘
```

### AI Capabilities
- Language detection (100+ languages)
- Translation to English
- Sentiment analysis (positive/neutral/negative)
- Cultural context notes
- Actionable business suggestions

## Widget Integration

```html
<script src="https://jback.vercel.app/widgets.js" jback-id="YOUR_TEAM_ID"></script>
```

## Project Structure

```
jback/
├── app/
│   ├── (app)/           # Dashboard routes
│   ├── (auth)/          # Auth routes
│   ├── api/             # API endpoints
│   └── collect/         # Public feedback form
├── components/          # UI components
├── lib/                 # Utilities & services
└── prisma/              # Database schema
```

Set environment variables in Vercel project settings after deployment.

## License

MIT License

---
