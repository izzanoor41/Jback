# Jback - Real-Time Cultural Intelligence Platform

<p align="center">
  <img src="public/Jback.webp" alt="Jback Logo" width="120" />
</p>

<p align="center">
  <strong>AI-Powered Feedback Intelligence with Real-Time Streaming</strong>
</p>

<p align="center">
  Built for the <a href="https://googlecloudxconfluent.devpost.com/">Confluent + Google Cloud Hackathon</a>
</p>

---

[Jback](https://jback.vercel.app) is a real-time cultural intelligence platform that helps businesses collect, analyze, and act on customer feedback from around the world. Powered by **Confluent Cloud** for real-time data streaming and **Google Gemini** for AI analysis, Jback goes beyond simple translation to understand cultural context, communication styles, and regional preferences.

## ✨ Features

- **🌍 Multi-Language Support**: Collect feedback in 100+ languages with automatic detection and translation
- **🧠 Cultural Intelligence**: AI-powered analysis that understands cultural context and communication styles
- **⚡ Real-Time Streaming**: Confluent Cloud (Apache Kafka) for instant feedback processing
- **📊 Smart Dashboard**: Visualize sentiment trends, language distribution, and cultural insights
- **💬 AI Chat Assistant**: Interactive analysis powered by Google Gemini with real-time data context
- **🎨 Customizable Widgets**: Embed feedback collection forms with your brand styling
- **🔗 Easy Integration**: Single line of code, direct links, or QR codes

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Zustand** - State management

### Backend & AI
- **Google Gemini 1.5 Flash** - Primary AI for cultural analysis
- **OpenAI GPT** - Fallback AI provider
- **Confluent Cloud** - Real-time data streaming (Apache Kafka)
- **TiDB Serverless** - MySQL-compatible database with vector search

### Authentication & Security
- **NextAuth.js v5** - Secure authentication
- **Prisma ORM** - Type-safe database access

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Confluent Cloud account ([Get 30-day trial](https://confluent.cloud) with code: `CONFLUENTDEV1`)
- Google Cloud account with Gemini API enabled
- TiDB Serverless account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/izzanoor41/Jback.git
   cd jback
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your credentials**

   | Variable | Description | How to Get |
   |----------|-------------|------------|
   | `DATABASE_URL` | TiDB connection string | [TiDB Cloud Console](https://tidbcloud.com) |
   | `AUTH_SECRET` | NextAuth secret | Run `openssl rand -base64 32` |
   | `GOOGLE_CLOUD_API_KEY` | Gemini API key | [Google AI Studio](https://aistudio.google.com/apikey) |
   | `OPENAI_API_KEY` | OpenAI API key (fallback) | [OpenAI Platform](https://platform.openai.com) |
   | `CONFLUENT_BOOTSTRAP_SERVERS` | Kafka bootstrap servers | Confluent Cloud Dashboard |
   | `CONFLUENT_API_KEY` | Confluent API key | Confluent Cloud Dashboard |
   | `CONFLUENT_API_SECRET` | Confluent API secret | Confluent Cloud Dashboard |

5. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
jback/
├── app/
│   ├── (app)/                 # Protected dashboard routes
│   │   ├── dashboard/         # Main dashboard
│   │   ├── feedback/          # Feedback management
│   │   ├── analysis/          # AI chat analysis
│   │   ├── intelligence/      # Confluent intelligence
│   │   ├── cultural-insights/ # Cultural analysis
│   │   ├── widgets/           # Widget customization
│   │   └── integrations/      # Integration options
│   ├── (auth)/                # Authentication routes
│   ├── api/                   # API endpoints
│   │   ├── chat/              # AI chat (Gemini + OpenAI)
│   │   ├── feedback/          # Feedback CRUD
│   │   ├── stream/            # Kafka streaming
│   │   └── streaming-agents/  # Real-time AI agents
│   └── collect/[id]/          # Public feedback collection
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── landing/               # Landing page components
├── lib/
│   ├── ai.ts                  # AI service (Gemini + OpenAI)
│   ├── ai-analysis.ts         # Feedback analysis
│   ├── confluent.ts           # Kafka client
│   └── prisma.ts              # Database client
├── prisma/
│   └── schema.prisma          # Database schema
└── public/
    └── widgets.js             # Embeddable widget script
```

## 🔌 Confluent Cloud Integration

Jback uses Confluent Cloud for real-time feedback streaming:

### Topics
- `feedback-raw` - Incoming feedback from all sources
- `feedback-analyzed` - AI-processed feedback with cultural insights
- `feedback-alerts` - Anomaly detection alerts

### Features
- **Real-time Processing**: Feedback is analyzed instantly as it arrives
- **Streaming Agents**: AI agents that monitor and react to feedback patterns
- **Anomaly Detection**: Automatic detection of unusual feedback patterns
- **Cultural Intelligence**: Real-time cultural context analysis

## 🤖 AI Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  User Feedback  │────▶│  Confluent Cloud │────▶│  Google Gemini  │
│   (Any Lang)    │     │   (Kafka Stream) │     │  (Primary AI)   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │   TiDB Database  │◀────│  OpenAI (Fallback)│
                        │  (Vector Search) │     └─────────────────┘
                        └──────────────────┘
```

### AI Capabilities
- **Language Detection**: Automatic detection of 100+ languages
- **Translation**: Accurate translation to English
- **Sentiment Analysis**: Positive, neutral, negative classification
- **Cultural Notes**: Communication style and regional context
- **Actionable Suggestions**: Business recommendations

## 📊 Dashboard Features

### Real-Time Metrics
- Total feedback count
- Sentiment distribution
- Language breakdown
- Average rating trends

### Cultural Insights
- Regional communication patterns
- Cultural context analysis
- Cross-cultural comparison

### AI Chat
- Natural language queries about your feedback
- Real-time data context
- Powered by Gemini with OpenAI fallback

## 🎨 Widget Integration

### Option 1: Script Embed
```html
<script src="https://jback.vercel.app/widgets.js"></script>
<script>
  JbackWidget.init({
    teamId: 'your-team-id',
    position: 'bottom-right',
    primaryColor: '#10B981'
  });
</script>
```

### Option 2: Direct Link
Share your feedback collection URL directly with customers.

### Option 3: QR Code
Generate a QR code for physical locations.

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/izzanoor41/Jback)

1. Click the button above
2. Connect your GitHub account
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your Vercel project settings.

## 📝 API Reference

### Feedback Collection
```
POST /api/feedback/collect
Content-Type: application/json

{
  "teamId": "string",
  "text": "string",
  "rating": 1-5,
  "email": "string (optional)"
}
```

### AI Chat
```
POST /api/chat
Content-Type: application/json

{
  "messages": [{ "role": "user", "content": "string" }],
  "team": { "id": "string", "name": "string" }
}
```

## 🏆 Hackathon Submission

This project is submitted for the **Confluent Challenge** at the Google Cloud x Confluent Hackathon.

### Challenge Requirements ✅
- [x] Confluent Cloud integration (Kafka streaming)
- [x] Google Cloud AI (Gemini 1.5 Flash)
- [x] Real-time data processing
- [x] AI/ML predictions (sentiment, cultural analysis)
- [x] Novel problem solving (cross-cultural feedback intelligence)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Confluent](https://confluent.io) - Real-time data streaming
- [Google Cloud](https://cloud.google.com) - AI/ML capabilities
- [TiDB](https://tidb.io) - Serverless database
- [Vercel](https://vercel.com) - Deployment platform
- [shadcn/ui](https://ui.shadcn.com) - UI components

---

<p align="center">
  Made with ❤️ for the Confluent + Google Cloud Hackathon
</p>
