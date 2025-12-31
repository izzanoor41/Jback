/**
 * Confluent Streaming Agents API
 * Real-time AI workflows with cultural intelligence
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { culturalIntelligenceAgent, mlAnalyticsAgent } from '@/lib/streaming-agents';
import { realtimeContextEngine } from '@/lib/realtime-context-engine';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, teamId, feedbackId, context } = body;

    switch (action) {
      case 'process_feedback':
        if (!context) {
          return NextResponse.json({ error: 'Context required for feedback processing' }, { status: 400 });
        }
        
        const actions = await culturalIntelligenceAgent.processStreamingFeedback(context);
        return NextResponse.json({
          success: true,
          actions,
          message: `Processed feedback with ${actions.length} agent actions`,
        });

      case 'detect_anomalies':
        if (!teamId) {
          return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
        }
        
        const anomalies = await mlAnalyticsAgent.detectAnomalies(teamId);
        return NextResponse.json({
          success: true,
          anomalies,
          count: anomalies.length,
        });

      case 'forecast_trends':
        if (!teamId) {
          return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
        }
        
        const forecast = await mlAnalyticsAgent.forecastTrends(teamId);
        return NextResponse.json({
          success: true,
          forecast,
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Streaming Agents API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    // Get real-time context for the team
    const teamStats = await realtimeContextEngine.query('team_stats', teamId);
    const recentAnomalies = await realtimeContextEngine.queryAll('anomaly_alerts', 
      (alert: any) => alert.teamId === teamId
    );

    // Get ML analytics
    const anomalies = await mlAnalyticsAgent.detectAnomalies(teamId);
    const forecast = await mlAnalyticsAgent.forecastTrends(teamId);

    return NextResponse.json({
      success: true,
      data: {
        teamStats,
        recentAnomalies: recentAnomalies.slice(0, 10),
        currentAnomalies: anomalies,
        forecast,
        contextEngine: {
          tablesInfo: await realtimeContextEngine.getTableInfo(),
        },
      },
    });
  } catch (error) {
    console.error('[Streaming Agents API] GET Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}