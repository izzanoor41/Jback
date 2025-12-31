import { Kafka } from "kafkajs";

export const maxDuration = 30;

// Kafka configuration for Confluent Cloud
const kafkaConfig = {
  clientId: 'jback-data-api',
  brokers: [process.env.CONFLUENT_BOOTSTRAP_SERVERS || ''],
  ssl: true,
  sasl: {
    mechanism: 'plain' as const,
    username: process.env.CONFLUENT_API_KEY || '',
    password: process.env.CONFLUENT_API_SECRET || '',
  },
  connectionTimeout: 10000,
};

export async function GET(req: Request) {
  try {
    const kafka = new Kafka(kafkaConfig);
    const admin = kafka.admin();
    
    await admin.connect();
    const topics = await admin.listTopics();
    await admin.disconnect();

    // Get topic metadata
    const jbackTopics = topics.filter(t => t.startsWith('jback-'));

    return Response.json({
      status: 'connected',
      topics: jbackTopics,
      totalTopics: jbackTopics.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Confluent connection error:', error);
    return Response.json({
      status: 'disconnected',
      error: error?.message || 'Connection failed',
      topics: [],
      totalTopics: 0,
      timestamp: new Date().toISOString(),
    });
  }
}

// POST to consume messages from specific topics
export async function POST(req: Request) {
  try {
    const { topics, maxMessages = 50 } = await req.json();
    
    const kafka = new Kafka(kafkaConfig);
    const consumer = kafka.consumer({ 
      groupId: `jback-chat-consumer-${Date.now()}`,
    });

    await consumer.connect();
    
    const targetTopics = topics || ['jback-feedback-raw', 'jback-feedback-processed'];
    await consumer.subscribe({ topics: targetTopics, fromBeginning: true });

    const messages: any[] = [];
    let messageCount = 0;

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        resolve();
      }, 5000); // 5 second timeout

      consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          if (messageCount >= maxMessages) {
            clearTimeout(timeout);
            resolve();
            return;
          }

          try {
            const value = message.value?.toString();
            if (value) {
              messages.push({
                topic,
                partition,
                offset: message.offset,
                timestamp: message.timestamp,
                data: JSON.parse(value),
              });
              messageCount++;
            }
          } catch (e) {
            // Skip invalid messages
          }
        },
      });
    });

    await consumer.disconnect();

    return Response.json({
      status: 'success',
      messageCount: messages.length,
      messages,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Consume error:', error);
    return Response.json({
      status: 'error',
      error: error?.message || 'Failed to consume messages',
      messages: [],
      timestamp: new Date().toISOString(),
    });
  }
}
