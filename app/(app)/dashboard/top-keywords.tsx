"use client";

import { Hash, TrendingUp } from "lucide-react";

interface KeywordData {
  value: string;
  count: number;
}

export default function TopKeywords({ data }: { data: KeywordData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Hash className="w-10 h-10 text-gray-300 mb-2" />
        <p className="text-sm text-muted-foreground">No keywords extracted yet</p>
      </div>
    );
  }

  // Sort by count and get top 12
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 12);
  const maxCount = Math.max(...sortedData.map(d => d.count));

  // Color palette for keywords
  const colors = [
    { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
    { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
    { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
    { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200" },
    { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200" },
  ];

  return (
    <div className="space-y-4">
      {/* Tag Cloud Style */}
      <div className="flex flex-wrap gap-2">
        {sortedData.map((keyword, index) => {
          const color = colors[index % colors.length];
          const size = Math.max(0.75, (keyword.count / maxCount) * 0.5 + 0.75);
          const isTop3 = index < 3;
          
          return (
            <div
              key={keyword.value}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border
                ${color.bg} ${color.text} ${color.border}
                hover:scale-105 transition-transform cursor-default
                ${isTop3 ? 'ring-2 ring-offset-1 ring-emerald-500/20' : ''}
              `}
              style={{ fontSize: `${size}rem` }}
            >
              {isTop3 && <TrendingUp className="w-3 h-3" />}
              <span className="font-medium">{keyword.value}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${color.bg} opacity-80`}>
                {keyword.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Top 5 Bar Chart */}
      <div className="pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-3 font-medium">Top 5 Keywords</p>
        <div className="space-y-2">
          {sortedData.slice(0, 5).map((keyword, index) => {
            const percentage = (keyword.count / maxCount) * 100;
            const color = colors[index % colors.length];
            
            return (
              <div key={keyword.value} className="flex items-center gap-3">
                <span className="text-xs font-medium w-20 truncate">{keyword.value}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${color.bg.replace('100', '500')}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{keyword.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
