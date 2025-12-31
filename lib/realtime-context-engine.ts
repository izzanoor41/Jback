/**
 * Real-time Context Engine with MCP Integration
 * Confluent Intelligence - In-memory cache for AI agents
 */

import { prisma } from './prisma';

interface ContextTable {
  name: string;
  data: Map<string, any>;
  lastUpdated: Date;
  ttl: number; // Time to live in milliseconds
}

/**
 * Real-time Context Engine
 * Provides low-latency data access for AI agents using MCP
 */
export class RealtimeContextEngine {
  private tables: Map<string, ContextTable> = new Map();
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeTables();
  }

  private async initializeTables(): Promise<void> {
    // Initialize feedback context table
    await this.createTable('feedback_context', {
      ttl: 5 * 60 * 1000, // 5 minutes
      refreshInterval: 30 * 1000, // 30 seconds
      loader: this.loadFeedbackContext.bind(this),
    });

    // Initialize cultural insights table
    await this.createTable('cultural_insights', {
      ttl: 15 * 60 * 1000, // 15 minutes
      refreshInterval: 2 * 60 * 1000, // 2 minutes
      loader: this.loadCulturalInsights.bind(this),
    });

    // Initialize team statistics table
    await this.createTable('team_stats', {
      ttl: 10 * 60 * 1000, // 10 minutes
      refreshInterval: 60 * 1000, // 1 minute
      loader: this.loadTeamStats.bind(this),
    });

    // Initialize anomaly alerts table
    await this.createTable('anomaly_alerts', {
      ttl: 2 * 60 * 1000, // 2 minutes
      refreshInterval: 15 * 1000, // 15 seconds
      loader: this.loadAnomalyAlerts.bind(this),
    });
  }

  private async createTable(name: string, config: {
    ttl: number;
    refreshInterval: number;
    loader: () => Promise<Map<string, any>>;
  }): Promise<void> {
    const table: ContextTable = {
      name,
      data: new Map(),
      lastUpdated: new Date(0),
      ttl: config.ttl,
    };

    this.tables.set(name, table);

    // Initial load
    await this.refreshTable(name, config.loader);

    // Set up periodic refresh
    const interval = setInterval(async () => {
      await this.refreshTable(name, config.loader);
    }, config.refreshInterval);

    this.updateIntervals.set(name, interval);
  }

  private async refreshTable(name: string, loader: () => Promise<Map<string, any>>): Promise<void> {
    try {
      const table = this.tables.get(name);
      if (!table) return;

      const newData = await loader();
      table.data = newData;
      table.lastUpdated = new Date();

      console.log(`[Context Engine] Refreshed table ${name} with ${newData.size} entries`);
    } catch (error) {
      console.error(`[Context Engine] Failed to refresh table ${name}:`, error);
    }
  }

  // MCP-compatible query interface
  async query(tableName: string, key: string): Promise<any> {
    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`Table ${tableName} not found`);
    }

    // Check if data is stale
    const isStale = Date.now() - table.lastUpdated.getTime() > table.ttl;
    if (isStale) {
      console.warn(`[Context Engine] Data in table ${tableName} is stale`);
    }

    return table.data.get(key) || null;
  }

  async queryAll(tableName: string, filter?: (value: any) => boolean): Promise<any[]> {
    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`Table ${tableName} not found`);
    }

    const values = Array.from(table.data.values());
    return filter ? values.filter(filter) : values;
  }

  // Data loaders for each table
  private async loadFeedbackContext(): Promise<Map<string, any>> {
    const recentFeedback = await prisma.feedback.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      include: {
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    const contextMap = new Map();
    
    for (const feedback of recentFeedback) {
      contextMap.set(feedback.id, {
        id: feedback.id,
        teamId: feedback.teamId,
        text: feedback.translatedText || feedback.originalText,
        originalText: feedback.originalText,
        language: feedback.detectedLanguage,
        sentiment: feedback.sentiment,
        culturalNotes: feedback.culturalNotes,
        summary: feedback.summary,
        rating: feedback.rate,
        isResolved: feedback.isResolved,
        streamSource: feedback.streamSource,
        customer: feedback.customer,
        createdAt: feedback.createdAt,
      });
    }

    return contextMap;
  }

  private async loadCulturalInsights(): Promise<Map<string, any>> {
    const insights = await prisma.culturalInsight.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: { confidence: 'desc' },
    });

    const insightsMap = new Map();
    
    for (const insight of insights) {
      const key = `${insight.teamId}_${insight.language}_${insight.insightType}`;
      insightsMap.set(key, {
        id: insight.id,
        teamId: insight.teamId,
        language: insight.language,
        region: insight.region,
        insightType: insight.insightType,
        insight: insight.insight,
        confidence: insight.confidence,
        feedbackCount: insight.feedbackCount,
        createdAt: insight.createdAt,
      });
    }

    return insightsMap;
  }

  private async loadTeamStats(): Promise<Map<string, any>> {
    // Get team statistics
    const teams = await prisma.team.findMany({
      include: {
        feedbacks: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        },
      },
    });

    const statsMap = new Map();

    for (const team of teams) {
      const feedbacks = team.feedbacks;
      const sentimentCounts = feedbacks.reduce((acc, f) => {
        acc[f.sentiment || 'neutral'] = (acc[f.sentiment || 'neutral'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const languageCounts = feedbacks.reduce((acc, f) => {
        acc[f.detectedLanguage || 'en'] = (acc[f.detectedLanguage || 'en'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const avgRating = feedbacks.length > 0 ? 
        feedbacks.reduce((sum, f) => sum + (f.rate || 0), 0) / feedbacks.length : 0;

      statsMap.set(team.id, {
        teamId: team.id,
        teamName: team.name,
        totalFeedback: feedbacks.length,
        sentimentBreakdown: sentimentCounts,
        languageBreakdown: languageCounts,
        averageRating: Math.round(avgRating * 10) / 10,
        resolvedCount: feedbacks.filter(f => f.isResolved).length,
        streamingCount: feedbacks.filter(f => f.streamSource === 'kafka').length,
        lastUpdated: new Date(),
      });
    }

    return statsMap;
  }

  private async loadAnomalyAlerts(): Promise<Map<string, any>> {
    const alerts = await prisma.streamEvent.findMany({
      where: {
        eventType: 'anomaly_detected',
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const alertsMap = new Map();

    for (const alert of alerts) {
      const payload = alert.payload as any;
      alertsMap.set(alert.id, {
        id: alert.id,
        teamId: payload.teamId,
        anomalyType: payload.anomalyType,
        severity: payload.severity,
        reasoning: payload.reasoning,
        feedbackId: payload.feedbackId,
        status: alert.status,
        createdAt: alert.createdAt,
      });
    }

    return alertsMap;
  }

  // MCP Server interface methods
  async getTableSchema(tableName: string): Promise<any> {
    const schemas = {
      feedback_context: {
        primaryKey: 'id',
        fields: {
          id: 'string',
          teamId: 'string',
          text: 'string',
          originalText: 'string',
          language: 'string',
          sentiment: 'string',
          culturalNotes: 'string',
          summary: 'string',
          rating: 'number',
          isResolved: 'boolean',
          streamSource: 'string',
          customer: 'object',
          createdAt: 'datetime',
        },
      },
      cultural_insights: {
        primaryKey: 'id',
        fields: {
          id: 'string',
          teamId: 'string',
          language: 'string',
          region: 'string',
          insightType: 'string',
          insight: 'string',
          confidence: 'number',
          feedbackCount: 'number',
          createdAt: 'datetime',
        },
      },
      team_stats: {
        primaryKey: 'teamId',
        fields: {
          teamId: 'string',
          teamName: 'string',
          totalFeedback: 'number',
          sentimentBreakdown: 'object',
          languageBreakdown: 'object',
          averageRating: 'number',
          resolvedCount: 'number',
          streamingCount: 'number',
          lastUpdated: 'datetime',
        },
      },
      anomaly_alerts: {
        primaryKey: 'id',
        fields: {
          id: 'string',
          teamId: 'string',
          anomalyType: 'string',
          severity: 'string',
          reasoning: 'string',
          feedbackId: 'string',
          status: 'string',
          createdAt: 'datetime',
        },
      },
    };

    return schemas[tableName as keyof typeof schemas] || null;
  }

  async getTableInfo(): Promise<any[]> {
    return Array.from(this.tables.entries()).map(([name, table]) => ({
      name,
      recordCount: table.data.size,
      lastUpdated: table.lastUpdated,
      ttl: table.ttl,
    }));
  }

  // Cleanup method
  destroy(): void {
    this.updateIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.updateIntervals.clear();
    this.tables.clear();
  }
}

// Export singleton instance
export const realtimeContextEngine = new RealtimeContextEngine();

// MCP Server Tools for external access
export const mcpTools = {
  async queryContext(tableName: string, key: string) {
    return await realtimeContextEngine.query(tableName, key);
  },

  async queryAllContext(tableName: string, filter?: any) {
    return await realtimeContextEngine.queryAll(tableName, filter);
  },

  async getTableSchema(tableName: string) {
    return await realtimeContextEngine.getTableSchema(tableName);
  },

  async getTableInfo() {
    return await realtimeContextEngine.getTableInfo();
  },
};