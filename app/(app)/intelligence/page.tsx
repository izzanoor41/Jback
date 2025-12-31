"use client";

import { useEffect, useState, useCallback } from "react";
import { useTeam } from "@/lib/store";
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Database,
  Activity,
  Globe,
  BarChart3,
  Cpu,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

interface IntelligenceData {
  teamStats: any;
  recentAnomalies: any[];
  currentAnomalies: any[];
  forecast: any;
  contextEngine: {
    tablesInfo: any[];
  };
}

export default function IntelligencePage() {
  const team = useTeam((state) => state.team);
  const [data, setData] = useState<IntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIntelligenceData = useCallback(async () => {
    if (!team) return;
    
    try {
      setRefreshing(true);
      const response = await fetch(`/api/streaming-agents?teamId=${team.id}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [team]);

  useEffect(() => {
    fetchIntelligenceData();
    const interval = setInterval(fetchIntelligenceData, 30000);
    return () => clearInterval(interval);
  }, [fetchIntelligenceData]);

  const triggerAnomalyDetection = async () => {
    if (!team) return;
    
    try {
      const response = await fetch('/api/streaming-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'detect_anomalies',
          teamId: team.id,
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(`Detected ${result.count} anomalies`);
        fetchIntelligenceData();
      }
    } catch (error) {
      toast.error('Failed to run anomaly detection');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
              Confluent Intelligence
            </h1>
            <p className="text-sm text-gray-500">Real-time AI workflows and cultural intelligence</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
            Confluent Intelligence
          </h1>
          <p className="text-sm text-gray-500">Real-time AI workflows and cultural intelligence</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            onClick={fetchIntelligenceData}
            disabled={refreshing}
            size="sm"
            className="gap-2 flex-1 sm:flex-none"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button 
            onClick={triggerAnomalyDetection}
            size="sm"
            className="gap-2 flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Run ML Analysis</span>
            <span className="sm:hidden">Analyze</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs font-medium flex items-center gap-1.5 text-blue-600">
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Real-time Context</span>
              <span className="sm:hidden">Context</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-blue-700">
              {data?.contextEngine?.tablesInfo?.reduce((sum, table) => sum + table.recordCount, 0) || 0}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">Records in memory</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs font-medium flex items-center gap-1.5 text-green-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ML Forecast</span>
              <span className="sm:hidden">Forecast</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-green-700">
              {data?.forecast?.forecast?.nextDay || 0}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">Predicted tomorrow</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs font-medium flex items-center gap-1.5 text-orange-600">
              <AlertTriangle className="w-3.5 h-3.5" />
              Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-orange-700">
              {data?.currentAnomalies?.length || 0}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">Active detected</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs font-medium flex items-center gap-1.5 text-purple-600">
              <Globe className="w-3.5 h-3.5" />
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-purple-700">
              {data?.teamStats?.languageBreakdown ? Object.keys(data.teamStats.languageBreakdown).length : 0}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">Detected</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="context-engine" className="space-y-4 sm:space-y-6">
        <TabsList className="bg-gray-100 p-1 sm:p-1.5 h-auto sm:h-11 rounded-xl w-full flex overflow-x-auto">
          <TabsTrigger value="context-engine" className="rounded-lg px-2 sm:px-4 py-1.5 sm:h-8 text-xs sm:text-sm font-medium flex-1 sm:flex-none gap-1 sm:gap-2">
            <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Context Engine</span>
            <span className="sm:hidden">Context</span>
          </TabsTrigger>
          <TabsTrigger value="streaming-agents" className="rounded-lg px-2 sm:px-4 py-1.5 sm:h-8 text-xs sm:text-sm font-medium flex-1 sm:flex-none gap-1 sm:gap-2">
            <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Streaming Agents</span>
            <span className="sm:hidden">Agents</span>
          </TabsTrigger>
          <TabsTrigger value="ml-analytics" className="rounded-lg px-2 sm:px-4 py-1.5 sm:h-8 text-xs sm:text-sm font-medium flex-1 sm:flex-none gap-1 sm:gap-2">
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">ML Analytics</span>
            <span className="sm:hidden">ML</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="context-engine" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Context Tables */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  Context Tables
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Real-time in-memory data tables for AI agents
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-2 sm:space-y-3">
                  {data?.contextEngine?.tablesInfo?.length ? data.contextEngine.tablesInfo.map((table, index) => (
                    <div key={index} className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{table.name}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">
                          Updated: {new Date(table.lastUpdated).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600 text-sm sm:text-base">{table.recordCount}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">records</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <Database className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs sm:text-sm">No context tables available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Team Statistics */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  Team Statistics
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Real-time team performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {data?.teamStats ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="text-center p-2.5 sm:p-3 rounded-xl bg-green-50">
                        <div className="text-lg sm:text-2xl font-bold text-green-600">
                          {data.teamStats.totalFeedback}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Total Feedback</div>
                      </div>
                      <div className="text-center p-2.5 sm:p-3 rounded-xl bg-blue-50">
                        <div className="text-lg sm:text-2xl font-bold text-blue-600">
                          {data.teamStats.averageRating}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Avg Rating</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs sm:text-sm font-medium mb-2">Sentiment Breakdown</div>
                      <div className="space-y-1.5 sm:space-y-2">
                        {Object.entries(data.teamStats.sentimentBreakdown || {}).map(([sentiment, count]) => (
                          <div key={sentiment} className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="capitalize">{sentiment}</span>
                            <Badge variant="outline" className="text-[10px] sm:text-xs">{count as number}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs sm:text-sm">No statistics available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="streaming-agents" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Recent Anomalies */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  Recent Anomalies
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  AI-detected anomalies from streaming agents
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-2 sm:space-y-3">
                  {data?.recentAnomalies?.length ? (
                    data.recentAnomalies.slice(0, 5).map((anomaly, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-orange-50 border border-orange-100">
                        <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px] sm:text-xs">
                              {anomaly.anomalyType}
                            </Badge>
                            <Badge 
                              variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}
                              className="text-[10px] sm:text-xs"
                            >
                              {anomaly.severity}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">{anomaly.reasoning}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                            {new Date(anomaly.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs sm:text-sm">No anomalies detected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Anomalies */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  Live Anomalies
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Real-time anomaly detection results
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-2 sm:space-y-3">
                  {data?.currentAnomalies?.length ? (
                    data.currentAnomalies.map((anomaly, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-red-50 border border-red-100">
                        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px] sm:text-xs">
                              {anomaly.type}
                            </Badge>
                            <Badge 
                              variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}
                              className="text-[10px] sm:text-xs"
                            >
                              {anomaly.severity}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">{anomaly.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs sm:text-sm">No live anomalies</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ml-analytics" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Forecast */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  ML Forecast
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Built-in ML functions for trend prediction
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {data?.forecast ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="text-center p-2.5 sm:p-3 rounded-xl bg-purple-50">
                        <div className="text-lg sm:text-2xl font-bold text-purple-600">
                          {data.forecast.forecast?.nextDay || 0}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Tomorrow</div>
                      </div>
                      <div className="text-center p-2.5 sm:p-3 rounded-xl bg-indigo-50">
                        <div className="text-lg sm:text-2xl font-bold text-indigo-600">
                          {data.forecast.forecast?.nextWeek || 0}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Next Week</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-gray-50">
                      <span className="text-xs sm:text-sm font-medium">Trend</span>
                      <Badge 
                        variant={
                          data.forecast.forecast?.trend === 'increasing' ? 'default' :
                          data.forecast.forecast?.trend === 'decreasing' ? 'destructive' : 'secondary'
                        }
                        className="text-[10px] sm:text-xs"
                      >
                        {data.forecast.forecast?.trend || 'stable'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-gray-50">
                      <span className="text-xs sm:text-sm font-medium">Confidence</span>
                      <span className="text-xs sm:text-sm font-bold">
                        {Math.round((data.forecast.forecast?.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs sm:text-sm">No forecast data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Language Analysis */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                  Cultural Intelligence
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Language and cultural pattern analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {data?.teamStats?.languageBreakdown ? (
                  <div className="space-y-2 sm:space-y-3">
                    {Object.entries(data.teamStats.languageBreakdown)
                      .sort(([,a], [,b]) => (b as number) - (a as number))
                      .slice(0, 6)
                      .map(([language, count]) => (
                        <div key={language} className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-emerald-50">
                          <div className="flex items-center gap-2">
                            <span className="text-base sm:text-lg">
                              {language === 'ja' ? '🇯🇵' : 
                               language === 'ko' ? '🇰🇷' :
                               language === 'zh' ? '🇨🇳' :
                               language === 'de' ? '🇩🇪' :
                               language === 'fr' ? '🇫🇷' :
                               language === 'es' ? '🇪🇸' :
                               language === 'ar' ? '🇸🇦' :
                               language === 'id' ? '🇮🇩' : '🌍'}
                            </span>
                            <span className="text-xs sm:text-sm font-medium uppercase">{language}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px] sm:text-xs">{count as number}</Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <Globe className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs sm:text-sm">No language data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}