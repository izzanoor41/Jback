/**
 * Test Kafka Connection to Confluent Cloud
 * Run with: npx ts-node scripts/test-kafka.ts
 */

import { Kafka, logLevel } from 'kafkajs';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔄 Testing Confluent Cloud connection...\n');

  const kafka = new Kafka({
    clientId: 'jback-test',
    brokers: [process.env.CONFLUENT_BOOTSTRAP_SERVERS || process.env.BOOTSTRAP_SERVERS || ''],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: process.env.CONFLUENT_API_KEY || process.env.KAFKA_API_KEY || '',
      password: process.env.CONFLUENT_API_SECRET || process.env.KAFKA_API_SECRET || '',
    },
    logLevel: logLevel.ERROR,
    connectionTimeout: 10000,
  });

  try {
    const admin = kafka.admin();
    console.log('📡 Connecting to Confluent Cloud...');
    await admin.connect();
    
    console.log('✅ Connected successfully!\n');
    
    // List topics
    const topics = await admin.listTopics();
    console.log(`📋 Topics found (${topics.length}):`);
    topics.forEach(topic => console.log(`   - ${topic}`));
    
    // Get cluster info
    const cluster = await admin.describeCluster();
    console.log(`\n🏢 Cluster Info:`);
    console.log(`   Cluster ID: ${cluster.clusterId}`);
    console.log(`   Brokers: ${cluster.brokers.length}`);
    
    await admin.disconnect();
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
