"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from "@/lib/store";
import { 
  MessageSquare, 
  MessageSquareDashed, 
  MessageSquarePlus, 
  Star,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { useEffect, useState } from "react";
import TopKeywords from "./top-keywords";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

export default function Dashboard() {
  const team = useTeam((state) => state.team);
  const [stats, setStats] = useState<any>();
  const [topKeywords, setTopKeywords] = useState<any[]>([]);

  useEffect(() => {
    const getStats = async () => {
      fetch(`/api/team/${team.id}/stats/dashboard`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStats(data.data);
          }
        })
        .catch((err) => console.log(err));
    };

    const getTopKeywords = async () => {
      fetch(`/api/team/${team.id}/stats/top-keywords`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTopKeywords(data.data);
          }
        })
        .catch((err) => console.log(err));
    };

    if (team) {
      getStats();
      getTopKeywords();
    }
  }, [team]);

  const statCards = [
    {
      title: "Total Feedback",
      value: stats?.total || 0,
      icon: MessageSquarePlus,
      gradient: "from-emerald-500 to-green-600",
      bgGlow: "bg-emerald-500/10",
    },
    {
      title: "Open",
      value: stats?.open || 0,
      icon: MessageSquareDashed,
      gradient: "from-blue-500 to-cyan-600",
      bgGlow: "bg-blue-500/10",
    },
    {
      title: "Resolved",
      value: stats?.resolved || 0,
      icon: MessageSquare,
      gradient: "from-purple-500 to-violet-600",
      bgGlow: "bg-purple-500/10",
    },
    {
      title: "Avg Rating",
      value: stats?.ratingAverage || "0.0",
      icon: Star,
      gradient: "from-amber-500 to-orange-600",
      bgGlow: "bg-amber-500/10",
    },
  ];

  const sentimentData = [
    {
      activity: "positive",
      value: parseInt(stats?.sentiment?.find((o: any) => o.name === "positive")?.percentage) || 0,
      label: (parseFloat(stats?.sentiment?.find((o: any) => o.name === "positive")?.percentage) || 0).toFixed(1) + "%",
      fill: "#10B981",
    },
    {
      activity: "neutral",
      value: parseInt(stats?.sentiment?.find((o: any) => o.name === "neutral")?.percentage) || 0,
      label: (parseFloat(stats?.sentiment?.find((o: any) => o.name === "neutral")?.percentage) || 0).toFixed(1) + "%",
      fill: "#6B7280",
    },
    {
      activity: "negative",
      value: parseInt(stats?.sentiment?.find((o: any) => o.name === "negative")?.percentage) || 0,
      label: (parseFloat(stats?.sentiment?.find((o: any) => o.name === "negative")?.percentage) || 0).toFixed(1) + "%",
      fill: "#EF4444",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time cultural intelligence overview
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Zap className="w-3 h-3" />
          Live Data
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-4 sm:p-5 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5"
          >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgGlow} rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Sentiment Card */}
        <div className="lg:col-span-1">
          <Card className="h-full border-border/50 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Sentiment Analysis
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <ChartContainer
                config={{
                  negative: { label: "Negative", color: "#EF4444" },
                  neutral: { label: "Neutral", color: "#6B7280" },
                  positive: { label: "Positive", color: "#10B981" },
                }}
                className="h-[140px] w-full"
              >
                <BarChart
                  margin={{ left: 0, right: 0, top: 0, bottom: 10 }}
                  data={sentimentData}
                  layout="vertical"
                  barSize={28}
                  barGap={2}
                >
                  <XAxis type="number" dataKey="value" hide />
                  <YAxis dataKey="activity" type="category" tickLine={false} tickMargin={4} axisLine={false} className="capitalize text-xs" />
                  <Bar dataKey="value" radius={8}>
                    <LabelList position="insideLeft" dataKey="label" fill="white" offset={8} fontSize={11} fontWeight={600} />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="border-t border-border/50 pt-4">
              <div className="flex w-full items-center justify-between gap-2">
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-muted-foreground">Positive</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-500">
                    {stats?.sentiment?.find((o: any) => o.name === "positive")?.count || 0}
                  </div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-gray-500" />
                    <span className="text-xs text-muted-foreground">Neutral</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-500">
                    {stats?.sentiment?.find((o: any) => o.name === "neutral")?.count || 0}
                  </div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs text-muted-foreground">Negative</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-red-500">
                    {stats?.sentiment?.find((o: any) => o.name === "negative")?.count || 0}
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Top Keywords Card */}
        <div className="lg:col-span-2">
          <Card className="h-full border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Top Keywords
                </CardTitle>
                <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                  AI Extracted
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <TopKeywords data={topKeywords} />
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
