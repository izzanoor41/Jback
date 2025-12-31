/**
 * Confluent Kafka Health Check API
 * Verifies connection to Confluent Cloud
 */

import { NextResponse } from 'next/server';
import { checkKafkaConnection, ensureTopicsExist, KAFKA_TOPICS } from '@/lib/confluent';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check Kafka connection
    const isConnected = await checkKafkaConnection();
    const latency = Date.now() - startTime;

    if (!isConnected) {
      return NextResponse.json({
        status: 'unhealthy',
        kafka: {
          connected: false,
          latency: null,
          error: 'Failed to connect to Confluent Cloud',
        },
        topics: Object.values(KAFKA_TOPICS),
        timestamp: new Date().toISOString(),
      }, { status: 503 });
    }

    // Ensure topics exist
    await ensureTopicsExist();

    return NextResponse.json({
      status: 'healthy',
      kafka: {
        connected: true,
        latency: `${latency}ms`,
        broker: process.env.CONFLUENT_BOOTSTRAP_SERVERS?.split(':')[0] || 'unknown',
      },
      topics: Object.values(KAFKA_TOPICS),
      features: {
        realTimeStreaming: true,
        culturalIntelligence: true,
        sentimentAnalysis: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Health Check] Error:', error);
    return NextResponse.json({
      status: 'error',
      kafka: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
