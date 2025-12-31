"use client";

import { useEffect, useState, useCallback } from "react";
import { useTeam } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Zap, 
  Server, 
  Clock, 
  CheckCircle2, 
  XCircle,
  RefreshCw,
  ArrowRight,
  Database,
  Cloud,
  Loader2
} from "lucide-react";

interface StreamHealth {
  status: 'healthy' | 'unhealthy' | 'error';
  kafka: {
    connected: boolean;
    latency?: string;
    broker?: string;
    error?: string;
  };
  topics: string[];
  features: {
    realTimeStreaming: boolean;
    culturalIntelligence: boolean;
    sentimentAnalysis: boolean;
  };
  timestamp: string;
}

interface StreamEvent {
  id: string;
  eventType: string;
  payload: any;
  kafkaTopic: string | null;
  status: string;
  createdAt: string;
  processedAt: string | null;
}

export default function StreamMonitorPage() {
  const team = useTeam((state) => state.team);
  const [health, setHealth] = useState<StreamHealth | null>(null);
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/stream/health');
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setHealth({
        status: 'error',
        kafka: { connected: false, error: 'Failed to check health' },
        topics: [],
        features: { realTimeStreaming: false, culturalIntelligence: false, sentimentAnalysis: false },
        timestamp: new Date().toISOString(),
      });
    }
  };

  const fetchEvents = useCallback(async () => {
    if (!team?.id) return;
    try {
      const res = await fetch(`/api/stream/feedback?teamId=${team.id}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  }, [team?.id]);

  const refresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchHealth(), fetchEvents()]);
    setRefreshing(false);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchHealth(), fetchEvents()]);
      setLoading(false);
    };
    init();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchHealth();
      fetchEvents();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchEvents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-500">Connecting to stream...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'processed':
        return 'bg-emerald-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-500" />
            Stream Monitor
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time Confluent Kafka streaming status
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={refresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`border-2 ${health?.kafka.connected ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="w-4 h-4" />
              Kafka Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {health?.kafka.connected ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-emerald-700">Connected</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-red-700">Disconnected</span>
                </>
              )}
            </div>
            {health?.kafka.latency && (
              <p className="text-xs text-gray-500 mt-1">Latency: {health.kafka.latency}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Broker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm truncate">
              {health?.kafka.broker || 'N/A'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Confluent Cloud</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4" />
              Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{health?.topics.length || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Active topics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Auto-refresh: 10s</p>
          </CardContent>
        </Card>
      </div>

      {/* Features Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Feature Status
          </CardTitle>
          <CardDescription>
            Real-time processing capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${health?.features.realTimeStreaming ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {health?.features.realTimeStreaming ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium">Real-time Streaming</span>
              </div>
              <p className="text-sm text-gray-500">
                Kafka-powered event streaming
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${health?.features.culturalIntelligence ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {health?.features.culturalIntelligence ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium">Cultural Intelligence</span>
              </div>
              <p className="text-sm text-gray-500">
                AI-powered cultural analysis
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${health?.features.sentimentAnalysis ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {health?.features.sentimentAnalysis ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium">Sentiment Analysis</span>
              </div>
              <p className="text-sm text-gray-500">
                Multi-language sentiment detection
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            Kafka Topics
          </CardTitle>
          <CardDescription>
            Active streaming topics in Confluent Cloud
          </CardDescription>
        </CardHeader>
        <CardContent>
          {health?.topics && health.topics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {health.topics.map((topic) => (
                <div 
                  key={topic} 
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-sm">{topic}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No topics available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Recent Stream Events
          </CardTitle>
          <CardDescription>
            Latest feedback processing events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.slice(0, 10).map((event) => (
                <div 
                  key={event.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`} />
                    <div>
                      <div className="font-medium text-sm">{event.eventType}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.kafkaTopic && (
                      <Badge variant="outline" className="text-xs">
                        {event.kafkaTopic.split('-').pop()}
                      </Badge>
                    )}
                    <Badge 
                      className={`text-xs ${
                        event.status === 'processed' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : event.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {event.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No events recorded yet</p>
              <p className="text-sm">Events will appear when feedback is processed</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Architecture Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>Streaming Architecture</CardTitle>
          <CardDescription>
            How Jback processes feedback in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4 py-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-xl">📝</span>
              </div>
              <div className="font-medium text-sm">Feedback Input</div>
              <div className="text-xs text-gray-500">Widget / API</div>
            </div>
            
            <ArrowRight className="w-6 h-6 text-gray-400" />
            
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-xl">⚡</span>
              </div>
              <div className="font-medium text-sm">Confluent Kafka</div>
              <div className="text-xs text-gray-500">Real-time Stream</div>
            </div>
            
            <ArrowRight className="w-6 h-6 text-gray-400" />
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-xl">🧠</span>
              </div>
              <div className="font-medium text-sm">AI Processing</div>
              <div className="text-xs text-gray-500">Cultural Analysis</div>
            </div>
            
            <ArrowRight className="w-6 h-6 text-gray-400" />
            
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-xl">📊</span>
              </div>
              <div className="font-medium text-sm">Dashboard</div>
              <div className="text-xs text-gray-500">Real-time Insights</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
