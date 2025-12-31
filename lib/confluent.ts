/**
 * Confluent Cloud Kafka Client for Jback
 * Real-time streaming infrastructure for feedback processing
 */

import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';

// Kafka Topics
export const KAFKA_TOPICS = {
  FEEDBACK_RAW: 'jback-feedback-raw',
  FEEDBACK_PROCESSED: 'jback-feedback-processed',
  FEEDBACK_SENTIMENT: 'jback-feedback-sentiment',
  CULTURAL_INSIGHTS: 'jback-cultural-insights',
  NOTIFICATIONS: 'jback-notifications',
} as const;

// Kafka configuration for Confluent Cloud
const kafkaConfig = {
  clientId: 'jback-app',
  brokers: [process.env.CONFLUENT_BOOTSTRAP_SERVERS || ''],
  ssl: true,
  sasl: {
    mechanism: 'plain' as const,
    username: process.env.CONFLUENT_API_KEY || '',
    password: process.env.CONFLUENT_API_SECRET || '',
  },
  logLevel: logLevel.ERROR,
  connectionTimeout: 10000,
  requestTimeout: 30000,
};

// Singleton Kafka instance
let kafka: Kafka | null = null;
let producer: Producer | null = null;

export function getKafkaClient(): Kafka {
  if (!kafka) {
    kafka = new Kafka(kafkaConfig);
  }
  return kafka;
}

export async function getProducer(): Promise<Producer> {
  if (!producer) {
    const client = getKafkaClient();
    producer = client.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    });
    await producer.connect();
  }
  return producer;
}

export async function disconnectProducer(): Promise<void> {
  if (producer) {
    await producer.disconnect();
    producer = null;
  }
}

// Message types for type safety
export interface FeedbackMessage {
  id: string;
  teamId: string;
  originalText: string;
  customerEmail?: string;
  rating?: number;
  timestamp: string;
  source: 'widget' | 'api' | 'import';
}

export interface ProcessedFeedbackMessage extends FeedbackMessage {
  translatedText: string;
  detectedLanguage: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  culturalNotes?: string;
  summary?: string;
  suggestions?: string;
  processedAt: string;
}

export interface CulturalInsightMessage {
  teamId: string;
  language: string;
  region?: string;
  insightType: 'communication_style' | 'sentiment_pattern' | 'cultural_preference';
  insight: string;
  confidence: number;
  timestamp: string;
}

// Producer functions
export async function publishFeedback(feedback: FeedbackMessage): Promise<void> {
  const prod = await getProducer();
  await prod.send({
    topic: KAFKA_TOPICS.FEEDBACK_RAW,
    messages: [
      {
        key: feedback.teamId,
        value: JSON.stringify(feedback),
        headers: {
          'content-type': 'application/json',
          'source': feedback.source,
        },
      },
    ],
  });
}

export async function publishProcessedFeedback(feedback: ProcessedFeedbackMessage): Promise<void> {
  const prod = await getProducer();
  await prod.send({
    topic: KAFKA_TOPICS.FEEDBACK_PROCESSED,
    messages: [
      {
        key: feedback.teamId,
        value: JSON.stringify(feedback),
        headers: {
          'content-type': 'application/json',
          'sentiment': feedback.sentiment,
          'language': feedback.detectedLanguage,
        },
      },
    ],
  });
}

export async function publishCulturalInsight(insight: CulturalInsightMessage): Promise<void> {
  const prod = await getProducer();
  await prod.send({
    topic: KAFKA_TOPICS.CULTURAL_INSIGHTS,
    messages: [
      {
        key: insight.teamId,
        value: JSON.stringify(insight),
        headers: {
          'content-type': 'application/json',
          'insight-type': insight.insightType,
        },
      },
    ],
  });
}

// Consumer factory
export function createConsumer(groupId: string): Consumer {
  const client = getKafkaClient();
  return client.consumer({ groupId });
}

// Health check
export async function checkKafkaConnection(): Promise<boolean> {
  try {
    const client = getKafkaClient();
    const admin = client.admin();
    await admin.connect();
    await admin.listTopics();
    await admin.disconnect();
    return true;
  } catch (error) {
    console.error('Kafka connection check failed:', error);
    return false;
  }
}

// Create topics if they don't exist
export async function ensureTopicsExist(): Promise<void> {
  try {
    const client = getKafkaClient();
    const admin = client.admin();
    await admin.connect();
    
    const existingTopics = await admin.listTopics();
    const topicsToCreate = Object.values(KAFKA_TOPICS).filter(
      topic => !existingTopics.includes(topic)
    );
    
    if (topicsToCreate.length > 0) {
      await admin.createTopics({
        topics: topicsToCreate.map(topic => ({
          topic,
          numPartitions: 3,
          replicationFactor: 3,
        })),
      });
      console.log('Created Kafka topics:', topicsToCreate);
    }
    
    await admin.disconnect();
  } catch (error) {
    console.error('Failed to ensure topics exist:', error);
  }
}
