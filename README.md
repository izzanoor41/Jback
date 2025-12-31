# Jback - Real-Time Cultural Intelligence Platform

<div align="center">
  <img src="public/logo.png" alt="Jback Logo" width="120" />
  
  **🏆 Built for Confluent + Google Cloud Hackathon**
  
  *Unleash the power of AI on data in motion!*
  
  [![Demo Video](https://img.shields.io/badge/Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/-BkMrIukKYo)
  [![Live Demo](https://img.shields.io/badge/Live-Demo-emerald?style=for-the-badge)](https://jback.vercel.app)
</div>

---

## 🎯 The Problem

Global businesses receive customer feedback in 100+ languages, but:
- **Translation alone isn't enough** - A 5-star rating in the US might be a 3-star "satisfactory" in Japan
- **Cultural context is lost** - Direct German feedback sounds harsh, while Japanese understatement hides true sentiment
- **Real-time insights are missing** - Batch processing delays critical business decisions

## 💡 Our Solution

**Jback** is a real-time cultural intelligence platform that doesn't just translate feedback — it explains **what customers mean** and **how to respond** based on cultural context.

### Key Features

| Feature | Description |
|---------|-------------|
| 🌍 **100+ Languages** | Auto-detect and translate with cultural context preservation |
| 🧠 **Cultural AI** | Understand communication styles and regional preferences |
| ⚡ **Real-time Streaming** | Confluent Kafka processes feedback instantly |
| 📊 **Smart Analytics** | Sentiment trends and actionable recommendations |
| 💬 **RAG-Powered Chat** | Ask questions in natural language |
| 🔒 **Enterprise Ready** | Team collaboration and secure data handling |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Feedback Input │────▶│  Confluent Kafka │────▶│  AI Processing  │
│  (Widget/API)   │     │  (Real-time)     │     │  (Google Cloud) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    Dashboard    │◀────│     TiDB         │◀────│ Cultural Intel  │
│  (Real-time)    │     │  (Serverless)    │     │   (Insights)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Kafka Topics

| Topic | Purpose |
|-------|---------|
| `jback-feedback-raw` | Raw feedback from widgets/API |
| `jback-feedback-processed` | AI-processed feedback with translations |
| `jback-feedback-sentiment` | Sentiment analysis results |
| `jback-cultural-insights` | Cultural intelligence insights |
| `jback-notifications` | Real-time notifications |

---

## 🛠️ Tech Stack

### Core Technologies (Hackathon Requirements)

| Technology | Usage |
|------------|-------|
| **Confluent Cloud** | Real-time Kafka streaming for feedback processing |
| **Google Cloud** | Vertex AI / Gemini for cultural analysis |

### Supporting Stack

| Technology | Usage |
|------------|-------|
| **Next.js 14** | React framework with App Router |
| **TiDB Serverless** | MySQL-compatible database with vector search |
| **OpenAI** | GPT-4 for sentiment & cultural analysis |
| **Prisma** | Type-safe database ORM |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Confluent Cloud account (use promo code: `CONFLUENTDEV1`)
- Google Cloud account
- TiDB Serverless account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jback.git
cd jback

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL=mysql://...@tidbcloud.com:4000/jback

# Authentication
AUTH_SECRET=your-secret-key

# AI Services
OPENAI_API_KEY=sk-...
GOOGLE_CLOUD_API_KEY=AIza...
GOOGLE_CLOUD_PROJECT_ID=your-project

# Confluent Cloud
CONFLUENT_BOOTSTRAP_SERVERS=pkc-xxx.gcp.confluent.cloud:9092
CONFLUENT_API_KEY=your-api-key
CONFLUENT_API_SECRET=your-api-secret
```

---

## 📱 Features Demo

### 1. Landing Page
Modern, animated landing page showcasing real-time cultural analysis capabilities.

### 2. Dashboard
Real-time metrics with sentiment analysis, keyword extraction, and feedback trends.

### 3. Cultural Insights
AI-powered analysis of feedback by language and culture, with actionable recommendations.

### 4. Stream Monitor
Live Kafka streaming status with topic monitoring and event tracking.

### 5. AI Chat
RAG-powered chat interface to ask questions about your feedback data.

---

## 🎬 Demo Video

Watch our 3-minute demo: [YouTube Link](https://youtu.be/-BkMrIukKYo)

**Demo Highlights:**
1. Real-time feedback collection in multiple languages
2. Confluent Kafka streaming visualization
3. Cultural AI analysis in action
4. Dashboard with live updates

---

## 📊 Judging Criteria Alignment

| Criteria | How Jback Addresses It |
|----------|------------------------|
| **Technological Implementation** | Deep integration of Confluent Kafka for real-time streaming + Google Cloud AI for cultural analysis |
| **Design** | Modern, intuitive UI with smooth animations and clear data visualization |
| **Potential Impact** | Helps global businesses understand customers across cultures, reducing miscommunication |
| **Quality of Idea** | Novel approach combining real-time streaming with cultural intelligence AI |

---

## 🤝 Team

Built with ❤️ for the Confluent + Google Cloud Hackathon 2025

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details
