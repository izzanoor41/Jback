"use client";

import { useEffect, useState } from "react";
import { useTeam } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Globe2, 
  TrendingUp, 
  MessageSquare, 
  Lightbulb,
  Languages,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";

interface LanguageData {
  code: string;
  name: string;
  count: number;
  percentage: number;
  sentiments: {
    positive: number;
    neutral: number;
    negative: number;
  };
  dominantSentiment: string;
}

interface CulturalInsightsData {
  summary: {
    totalFeedback: number;
    uniqueLanguages: number;
    topLanguage: LanguageData | null;
  };
  languageBreakdown: LanguageData[];
  culturalNotes: Array<{
    language: string;
    note: string;
    sentiment: string;
  }>;
  insights: {
    insights: string[];
    recommendations: string[];
  };
}

export default function CulturalInsightsPage() {
  const team = useTeam((state) => state.team);
  const [data, setData] = useState<CulturalInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!team?.id) return;
      
      setLoading(true);
      try {
        const res = await fetch(`/api/cultural-insights?teamId=${team.id}`);
        const result = await res.json();
        
        if (result.success) {
          setData(result);
        } else {
          setError(result.error || 'Failed to load insights');
        }
      } catch (err) {
        setError('Failed to fetch cultural insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [team?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-500">Analyzing cultural patterns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Badge className="bg-emerald-100 text-emerald-700">Positive</Badge>;
      case 'negative': return <Badge className="bg-red-100 text-red-700">Negative</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-700">Neutral</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-emerald-500" />
            Cultural Intelligence
          </h1>
          <p className="text-gray-500 mt-1">
            Understand your global customers beyond translation
          </p>
        </div>
        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
          Powered by AI
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Total Feedback Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.summary.totalFeedback || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Languages Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.summary.uniqueLanguages || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Top Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data?.summary.topLanguage?.name || 'N/A'}
            </div>
            {data?.summary.topLanguage && (
              <p className="text-sm text-gray-500">
                {data.summary.topLanguage.percentage}% of feedback
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Language Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Language Distribution
          </CardTitle>
          <CardDescription>
            Feedback breakdown by detected language with sentiment analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.languageBreakdown && data.languageBreakdown.length > 0 ? (
            <div className="space-y-4">
              {data.languageBreakdown.map((lang) => (
                <div key={lang.code} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-sm text-gray-500">({lang.code})</span>
                      {getSentimentBadge(lang.dominantSentiment)}
                    </div>
                    <span className="text-sm font-medium">
                      {lang.count} ({lang.percentage}%)
                    </span>
                  </div>
                  <Progress value={lang.percentage} className="h-2" />
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Positive: {lang.sentiments.positive}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-500" />
                      Neutral: {lang.sentiments.neutral}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Negative: {lang.sentiments.negative}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Globe2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No language data available yet</p>
              <p className="text-sm">Start collecting feedback to see cultural insights</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cultural Notes & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cultural Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Cultural Notes
            </CardTitle>
            <CardDescription>
              AI-detected cultural context from feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.culturalNotes && data.culturalNotes.length > 0 ? (
              <div className="space-y-4">
                {data.culturalNotes.map((note, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{note.language}</Badge>
                      {getSentimentBadge(note.sentiment)}
                    </div>
                    <p className="text-sm text-gray-700">{note.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cultural notes detected yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Actionable insights for cross-cultural communication
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.insights?.insights && data.insights.insights.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm text-gray-500">Key Insights</h4>
                  <ul className="space-y-2">
                    {data.insights.insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {data.insights.recommendations && data.insights.recommendations.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2 text-sm text-gray-500">Recommendations</h4>
                    <ul className="space-y-2">
                      {data.insights.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Collect more feedback to generate insights</p>
                <p className="text-sm">At least 5 feedback items needed</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
